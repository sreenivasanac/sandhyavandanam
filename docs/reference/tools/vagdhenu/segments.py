# /// script
# requires-python = ">=3.10"
# dependencies = ["aksharamukha>=2.3"]
# ///
"""Chant clips built from short segments, for the mantras the whole-mantra render cannot do.

  uv run segments.py build WORKDIR      # writes WORKDIR/shard.json (segments to render) and WORKDIR/plan.json (how to join)

Two kinds of mantra are covered:
  1. Mantras with no clip because the voice skipped a phrase when given the whole text: each line / `|` group is
     rendered on its own and the pieces are joined with a short pause.
  2. Personal lines (placeholders in braces). {kala} is filled in, giving one clip per time of day; every other
     placeholder (name, gotra, count …) becomes a silent gap in which the user says their own word.
     {panchanga} is dropped: with the day's details switched on the app hides the chant button for that line.

Render and check the segments with render_checked.py + hear.py, then join with join_segments.py.
Clip names: <id>.m4a, or <id>-<kala>.m4a when the line names the time of day (id = sha1 of the authored IAST, as in audio_shard.py).
"""
import hashlib, json, re, sys
from pathlib import Path
from aksharamukha import transliterate as T

CONTENT = Path(__file__).resolve().parents[4] / "app/src/content/sandhya.json"
SVARA = re.compile("[̱̍̎]")
PLACEHOLDER = re.compile(r"\{\w+\}")
KALA = {"pratah": "prātaḥ", "madhyahnika": "mādhyāhnika", "sayam": "sāyaṃ"}
GAP = "\x00"
LINE_PAUSE, GAP_PAUSE = 0.35, 1.4  # seconds between joined lines; seconds left for the user's own word

sha = lambda s: hashlib.sha1(s.encode()).hexdigest()[:10]
deva = lambda s: re.sub(r"\s+", " ", re.sub(r"[।॥]", " ", T.process("IAST", "Devanagari", s))).strip()


def build(work: Path) -> None:
    data = json.loads(CONTENT.read_text())
    segs, plan, seen = {}, [], set()

    def chunks(text: str) -> list[str]:
        """A long unbroken line is spoken in breath groups of at most 7 words (the voice drops words in longer ones)."""
        w = text.split()
        n = -(-len(w) // 7)
        size = -(-len(w) // n) if n else 0
        return [" ".join(w[k : k + size]) for k in range(0, len(w), size)] if n > 1 else [text]

    def seg(text: str) -> str:
        text = re.sub(r"\s+", " ", SVARA.sub("", text)).strip(" |")
        d = deva(text)
        i = sha(d)
        segs[i] = {"id": i, "meter": "anushtubh", "padas": [d], "seed": 60, "no_sandhi": True, "ref": d, "out": f"{work}/out/{i}.wav"}
        return i

    for step in data["steps"]:
        for item in step["items"]:
            if item.get("kind") != "mantra":
                continue
            t = item["text"]["iast"]
            if t in seen:
                continue
            personal = bool(PLACEHOLDER.search(t))
            if not personal and item.get("audio"):
                continue
            seen.add(t)
            base = sha(t)
            if not personal:  # kind 1: line by line
                parts = [p for p in re.split(r"\n|\|\|?", t) if p.strip(" |")]
                plan.append({"out": f"{base}.m4a", "step": step["id"], "parts": [seg(c) for p in parts for c in chunks(p.strip(" |"))]})
                continue
            for kala, word in KALA.items() if "{kala}" in t else [(None, "")]:  # kind 2: gaps for the user's words
                filled = PLACEHOLDER.sub(GAP, t.replace("{panchanga}", "").replace("{kala}", word))
                pieces = [c for c in (x.strip(" |\n") for x in re.split(f"(?:{GAP}\\s*)+", filled)) if c]
                parts = []
                for n, c in enumerate(pieces):
                    if n or filled.lstrip().startswith(GAP):
                        parts.append("GAP")
                    parts += [seg(x) for x in chunks(c)]
                if filled.rstrip(" |\n").endswith(GAP):
                    parts.append("GAP")
                plan.append({"out": f"{base}-{kala}.m4a" if kala else f"{base}.m4a", "step": step["id"], "parts": parts})
    work.mkdir(parents=True, exist_ok=True)
    (work / "shard.json").write_text(json.dumps(list(segs.values()), ensure_ascii=False, indent=1))
    (work / "plan.json").write_text(json.dumps(plan, ensure_ascii=False, indent=1))
    print(f"{len(plan)} clips from {len(segs)} segments")


if __name__ == "__main__":
    build(Path(sys.argv[2]).expanduser())
