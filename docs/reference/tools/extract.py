# /// script
# requires-python = ">=3.11"
# dependencies = ["pymupdf>=1.24"]
# ///
"""Regenerate docs/reference/clean/<pdf>.md from docs/reference/pdfs/*.pdf.

Run:  uv run docs/reference/tools/extract.py [pdf-name-substring]
Needs tesseract 5 with san/hin/tam/eng traineddata:
      brew install tesseract tesseract-lang

Method per PDF (see EXTRACTION_NOTES.md):
- Text layer via pymupdf rawdict; TeX-style split diacritics (¯a, ´s, s.)
  are folded back into IAST; Kidambi's udātta ticks / anudātta underlines
  are re-attached as combining marks.
- Runs set in legacy/broken-CMap Indic fonts (Wikner skt, BRH/Mangal, the
  Kaalai CID fonts) are cropped from a 400 dpi render and OCR'd line by
  line with tesseract (san+hin / tam).
- Large embedded images (pasted mantra pictures) are OCR'd as blocks.
"""
import re
import subprocess
import sys
import tempfile
import unicodedata
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[1]
PDFS, CLEAN = ROOT / "pdfs", ROOT / "clean"
DPI = 400

# font-name substring -> tesseract lang, for text that must be OCR'd
INDIC_FONTS = {
    "Wikner": "san+hin",           # sandhyaavandanam.pdf (Kidambi, LaTeX skt)
    "BRHDevanagari": "san+hin",    # Sandhyavandanam.pdf (Baraha legacy font)
    "Mangal": "san+hin",           # Sandhyavandanam.pdf (broken ToUnicode)
    "CIDFont+F4": "san+hin",       # Yajurveda_Kaalai (Devanagari, broken CMap)
    "CIDFont+F5": "tam",           # Yajurveda_Kaalai (Tamil, broken CMap)
}
SPLIT_SPREADS = {"Yajurveda_Kaalai_Sandhyaavandanam.pdf"}  # 2 booklet pages per sheet
ACCENTS = {"¯": "̄", "´": "́", "˜": "̃", "˙": "̇", "¨": "̈"}
DEVA = re.compile(r"[ऀ-ॿ]")
INDIC = re.compile(r"[ऀ-ෟ]")


def indic_lang(font):
    return next((lang for k, lang in INDIC_FONTS.items() if k in font), None)


def tesseract(pngs, lang, psm):
    """OCR many images in one tesseract process; returns one string per image."""
    if not pngs:
        return []
    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as f:
        f.write("\n".join(map(str, pngs)))
    out = subprocess.run(
        ["tesseract", f.name, "stdout", "-l", lang, "--psm", str(psm)],
        capture_output=True, text=True, check=True).stdout
    parts = out.split("\f")
    return [clean_ocr(p) for p in parts[: len(pngs)]] + [""] * (len(pngs) - len(parts))


def clean_ocr(text):
    """Drop OCR lines that are only svara-tick noise (| I । ~ ^ ...)."""
    keep = [ln.strip() for ln in text.splitlines()
            if re.search(r"[\wऀ-௿]", ln) and len(re.sub(r"[|I।॥~^_.:'` \-]", "", ln)) > 1]
    return "\n".join(keep)


def fold_accents(chars):
    """chars: list of (c, bbox). Combine TeX-style separate accents into IAST.
    Spaces are kept only where there is a real horizontal gap (TeX kerns around
    accents show up as bogus ' ' chars in the text layer)."""
    out, pending, prev_x1 = [], "", None
    for i, (c, bb) in enumerate(chars):
        if c in ACCENTS:
            pending += ACCENTS[c]
            continue
        if c == " ":
            nxt = next((b for ch, b in chars[i + 1:] if ch != " " and ch not in ACCENTS), None)
            if prev_x1 is not None and nxt is not None and nxt[0] - prev_x1 < 1.0 and bb[2] - bb[0] < 4.5:
                continue                                # TeX kern, not a word space
            out.append(c)
            continue
        # a lowered '.' right after a letter is an underdot (ṣ ṇ ṭ ḍ ḥ ṃ ṛ ḷ)
        if c == "." and out and out[-1][0].isalpha() and i and bb[1] > chars[i - 1][1][1] + 2:
            out.append("̣")
            continue
        out.append(c + pending)
        pending = ""
        prev_x1 = bb[2]
    txt = "".join(out).replace("ﬁ", "fi").replace("ﬂ", "fl").replace("ı", "i")  # TeX \i
    return unicodedata.normalize("NFC", txt)


def overlap(a, b):
    return max(0.0, min(a[2], b[2]) - max(a[0], b[0]))


def page_atoms(page):
    """Return list of (bbox, text) atoms in no particular order."""
    atoms, indic_runs, marks, textchars = [], [], [], []
    for block in page.get_text("rawdict")["blocks"]:
        for line in block.get("lines", []):
            if abs(line["dir"][1]) > 0.1:      # rotated watermark
                continue
            run, run_lang, run_bb = [], None, None
            for span in line["spans"]:
                font, lang = span["font"], indic_lang(span["font"])
                for ch in span["chars"]:
                    c, bb = ch["c"], ch["bbox"]
                    if font.startswith("Helvetica") and span["size"] < 11 and c in "ı ":
                        if c == "ı":
                            marks.append(("udatta", bb))    # Kidambi IAST udātta tick
                        continue
                    if lang != run_lang and run:
                        _flush(run, run_lang, run_bb, atoms, indic_runs, textchars)
                        run, run_bb = [], None
                    run_lang = lang
                    run.append((c, bb))
                    run_bb = bb if run_bb is None else (min(run_bb[0], bb[0]), min(run_bb[1], bb[1]),
                                                        max(run_bb[2], bb[2]), max(run_bb[3], bb[3]))
            if run:
                _flush(run, run_lang, run_bb, atoms, indic_runs, textchars)
    # Kidambi anudātta underlines are 1x1 inline images stretched to ~5x0.7 pt
    for info in page.get_image_info():
        x0, y0, x1, y1 = info["bbox"]
        if x1 - x0 < 12 and y1 - y0 < 1.5:
            marks.append(("anudatta", info["bbox"]))
    _attach_marks(marks, textchars)
    atoms += [(bb, fold_accents(chars)) for bb, chars in textchars]
    runs = _merge_runs(indic_runs)
    atoms += _dandas(page, runs)
    atoms += _ocr_runs(page, runs)
    atoms += _ocr_images(page)
    # lone commas are table separators that sat inside OCR'd Devanagari cells
    return [(bb, t) for bb, t in atoms if t.strip() and not re.fullmatch(r"[,\s]+", t)]


def _flush(run, lang, bb, atoms, indic_runs, textchars):
    if lang is None:
        textchars.append((bb, run))
        return
    letters = [c for c, _ in run if not c.isspace()]
    if not letters or set(letters) <= {"Á"} or bb[2] - bb[0] < 2:   # Wikner dandas: see _dandas
        return
    if set(letters) <= set("।॥|"):                   # lone danda glyphs extract fine; skip OCR
        atoms.append((bb, "".join(letters)))
        return
    indic_runs.append([lang, list(bb)])


def _attach_marks(marks, textchars):
    """Append combining udātta (́) / anudātta (̱) to the letter under/over each mark."""
    letters = [(bb, run, i) for bb, run in textchars for i, (c, cb) in enumerate(run) if c.isalpha()]
    for kind, mb in marks:
        best, best_ov = None, 0.5
        for bb, run, i in letters:
            cb = run[i][1]
            if kind == "udatta" and not (-3 < mb[3] - cb[1] < 12):
                continue
            if kind == "anudatta" and not (-8 < mb[1] - cb[3] < 3):
                continue
            ov = overlap(mb, cb)
            if ov > best_ov:
                best, best_ov = (run, i), ov
        if best:
            run, i = best
            c, cb = run[i]
            if kind == "anudatta":
                run[i] = (c + "̱", cb)
            elif c.endswith("́"):                        # second tick on same letter = dīrgha svarita
                run[i] = (c[:-1] + "̎", cb)
            else:
                run[i] = (c + "́", cb)


def _dandas(page, runs):
    """Kidambi's Wikner danda glyph (gid 102) is zero-width and mapped to U+FFFD, so
    rawdict drops it; recover the ones that sit in IAST lines from the glyph trace."""
    xs = [(ch[3], sp["font"]) for sp in page.get_texttrace() if "Wikner" in sp["font"]
          for ch in sp["chars"] if ch[1] == 102]
    out = []
    for (x0, y0, x1, y1), _ in xs:
        if any(r[0] - 2 <= x0 <= r[2] + 2 and r[1] <= (y0 + y1) / 2 <= r[3] for _, r in runs):
            continue                                    # inside an OCR'd Devanagari line
        if out and abs(out[-1][0][0] - x0) < 4 and abs(out[-1][0][1] - y0) < 2:
            out[-1] = (out[-1][0], "॥")                 # two ticks = double danda
        else:
            out.append(((x0, y0, x0 + 3, y1), "।"))
    return out


def _merge_runs(runs):
    """Merge Indic runs (same lang, same visual line, small gap) into one crop each."""
    runs.sort(key=lambda r: (r[1][1], r[1][0]))
    merged = []
    for lang, bb in runs:
        for m in merged:
            mb = m[1]
            vo = min(bb[3], mb[3]) - max(bb[1], mb[1])
            if m[0] == lang and vo > 0.5 * min(bb[3] - bb[1], mb[3] - mb[1]) \
                    and (bb[0] - mb[2] < 15 and mb[0] - bb[2] < 15):
                m[1] = [min(bb[0], mb[0]), min(bb[1], mb[1]), max(bb[2], mb[2]), max(bb[3], mb[3])]
                break
        else:
            merged.append([lang, list(bb)])
    return merged


def _ocr_runs(page, merged):
    """Crop each merged Indic run from a 400 dpi render and OCR it as one line."""
    atoms = []
    for lang in sorted({m[0] for m in merged}):
        group = [m for m in merged if m[0] == lang]
        pngs = [_crop(page, m[1], pad=0) for m in group]
        texts = tesseract(pngs, lang, 7)
        # psm 7 gives up when neighbouring lines' svara marks leak into the crop;
        # retry those as a block and keep the longest line
        bad = [i for i, t in enumerate(texts) if not t]
        for i, t in zip(bad, tesseract([pngs[i] for i in bad], lang, 6)):
            texts[i] = max(t.splitlines(), key=len, default="")
        for m, txt in zip(group, texts):
            atoms.append((tuple(m[1]), txt.replace("\n", " ")))
    return atoms


def _ocr_images(page):
    """OCR wide embedded images (pasted mantra pictures); photos yield nothing after cleaning."""
    rects = [pymupdf.Rect(i["bbox"]) for i in page.get_image_info() if i["bbox"][2] - i["bbox"][0] > 250]
    rects = [r & page.rect for r in rects if (r & page.rect).height > 30]
    pngs = [_crop(page, r, pad=0, dpi=300) for r in rects]   # pasted images are ~180 dpi; 400 over-blurs
    out = []
    for r, txt in zip(rects, tesseract(pngs, "san+hin+eng", 6)):
        words = re.findall(r"[A-Za-z]{3,}", txt)
        if len(DEVA.findall(txt)) >= 12 or len(words) >= 8:
            out.append((tuple(r), "[image]\n" + txt))
    return out


def _crop(page, bb, pad, dpi=DPI):
    clip = pymupdf.Rect(bb[0] - pad, bb[1] - pad, bb[2] + pad, bb[3] + pad) & page.rect
    f = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
    page.get_pixmap(dpi=dpi, clip=clip, colorspace=pymupdf.csGRAY).save(f.name)
    return f.name


def layout(atoms):
    """Greedy visual-line grouping, then left-to-right; blank line on big vertical gaps."""
    atoms = sorted(atoms, key=lambda a: (a[0][1], a[0][0]))
    lines = []
    for bb, t in atoms:
        for ln in lines:
            lb = ln["bb"]
            vo = min(bb[3], lb[3]) - max(bb[1], lb[1])
            if vo > 0.5 * min(bb[3] - bb[1], lb[3] - lb[1]):
                ln["items"].append((bb, t))
                ln["bb"] = (min(lb[0], bb[0]), min(lb[1], bb[1]), max(lb[2], bb[2]), max(lb[3], bb[3]))
                break
        else:
            lines.append({"bb": bb, "items": [(bb, t)]})
    lines.sort(key=lambda ln: ln["bb"][1])
    out, prev_y1 = [], None
    for ln in lines:
        if prev_y1 is not None and ln["bb"][1] - prev_y1 > 8:
            out.append("")
        text, x1 = "", None
        for bb, t in sorted(ln["items"], key=lambda a: (a[0][0], a[0][2])):
            glued = x1 is not None and bb[0] - x1 < 1.0 and not INDIC.search(text[-1:] + t[:1])
            text += ("" if glued else " ") + t      # touching Latin atoms = one word split by pymupdf
            x1 = bb[2]
        out.append(re.sub(r"[ \t]+", " ", text).strip())
        prev_y1 = ln["bb"][3]
    return "\n".join(out).strip()


def extract(pdf):
    doc = pymupdf.open(pdf)
    parts = [f"# {pdf.name}\n"]
    for pno, page in enumerate(doc, 1):
        atoms = page_atoms(page)
        if pdf.name in SPLIT_SPREADS:
            mid = page.rect.width / 2
            for label, sel in (("left", lambda a: (a[0][0] + a[0][2]) / 2 < mid),
                               ("right", lambda a: (a[0][0] + a[0][2]) / 2 >= mid)):
                parts.append(f"\n## Page {pno} ({label} half)\n\n{layout([a for a in atoms if sel(a)])}\n")
        else:
            parts.append(f"\n## Page {pno}\n\n{layout(atoms)}\n")
        print(f"{pdf.name}: page {pno}/{len(doc)}", file=sys.stderr)
    (CLEAN / (pdf.stem + ".md")).write_text("\n".join(parts), encoding="utf-8")


if __name__ == "__main__":
    CLEAN.mkdir(exist_ok=True)
    pick = sys.argv[1] if len(sys.argv) > 1 else ""
    for pdf in sorted(PDFS.glob("*.pdf")):
        if pick in pdf.name:
            extract(pdf)
