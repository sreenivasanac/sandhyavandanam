# /// script
# requires-python = ">=3.10"
# ///
"""Build the Vāgdhenu batch-render shard from the content, and (after rendering) wire audio paths back in.

  uv run scripts/audio_shard.py build /abs/outdir > shard.json          # Vāgdhenu shard (laukika only)
  uv run scripts/audio_shard.py build /abs/outdir --vedic > shard.json  # the Vedic mantras, tone marks removed
  uv run scripts/audio_shard.py wire  public/audio                      # set item.audio for every rendered file

Selection: mantras WITHOUT {placeholders} (personalised items can't be pre-rendered). Vāgdhenu cannot chant the Vedic
tones, so Vedic mantras are rendered with the svara marks stripped: correct syllables, flat tone. The app says so
beside those clips (an item is Vedic when its IAST carries svara marks). Each shard entry: id (stable hash of the IAST), meter ('gadya' for prose; verse
detection is left to Vāgdhenu's own metre scan), padas (lines), out (file name).
"""
import hashlib, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "src/content/sandhya.json"
SVARA = re.compile("[̱̍̎]")
PLACEHOLDER = re.compile(r"\{\w+\}")


def item_id(iast: str) -> str:
    return hashlib.sha1(iast.encode()).hexdigest()[:10]


DEVA_SVARA = re.compile("[\u0951\u0952\u1CD0-\u1CFF\uA8E0-\uA8FF]")  # udātta, anudātta and the Vedic-extension tone marks


def laukika_items(vedic: bool = False):
    """Mantras to render: the non-Vedic ones by default, the Vedic ones (svara-marked) with vedic=True."""
    data = json.loads(CONTENT.read_text())
    for step in data["steps"]:
        for item in step["items"]:
            if item.get("kind") != "mantra":
                continue
            t = item["text"]["iast"]
            if PLACEHOLDER.search(t) or bool(SVARA.search(t)) != vedic:
                continue
            yield step, item


VOWELS = re.compile(r"[aāiīuūṛṝḷeo]|ai|au")
# syllables per half-verse (2 pādas) → Vāgdhenu reference-bank metre key; anything else is chanted as prose
PROSE_REF = "anushtubh"
METRE = {16: "anushtubh", 22: "upajati", 24: "vamshastha", 28: "vasantatilaka", 30: "malini", 38: "shardulavikridita", 42: "sragdhara"}


def guess_meter(lines: list[str]) -> str:
    counts = {len(VOWELS.findall(l)) for l in lines}
    return METRE[next(iter(counts))] if len(counts) == 1 and next(iter(counts)) in METRE else "gadya"


def build(outdir: str, vedic: bool = False) -> None:
    """Vāgdhenu shard: one clip per unique laukika mantra; padas = lines (Devanagari, dandas stripped)."""
    seen, shard = set(), []
    for step, item in laukika_items(vedic):
        t = item["text"]["iast"]
        i = item_id(t)  # id keeps the svara marks, so it matches the text the app shows
        t = SVARA.sub("", t)  # everything rendered or logged below is the unaccented text
        if i in seen:
            continue  # same mantra repeated in several steps → render once
        seen.add(i)
        lines = [p.strip(" |") for p in t.split("\n") if p.strip(" |")]
        meter = guess_meter(lines) if len(lines) in (2, 4) else "gadya"
        verse = meter != "gadya"
        # Prose is chanted on the anuṣṭubh reference: Vāgdhenu's own prose ("gadya") reference swallowed the first
        # syllable/word of short lines (found by transcribing every clip — see docs/reference/tools/CHANT_AUDIO.md).
        meter = meter if verse else PROSE_REF
        # for prose keep the source's `|` groups as separate padas (short breath groups chant better)
        src_padas = lines if verse else [p.strip() for p in re.split(r"\n|\|\|?", t) if p.strip()]
        deva = DEVA_SVARA.sub("", item["text"]["devanagari"])
        deva_padas = [p.strip() for p in re.split(r"\n|॥|।", deva) if p.strip()]
        if len(deva_padas) != len(src_padas):  # fall back to whole text as one pada
            deva_padas = [re.sub(r"[।॥\n]+", " ", deva).strip()]
        shard.append({"id": i, "step": step["id"], "meter": meter, "padas": deva_padas, "iast": src_padas, "seed": 60, "no_sandhi": True,  # speak exactly what is shown (no engine-side sandhi)
                      "ref": re.sub(r"\s+", " ", deva).strip(), "out": f"{outdir}/{i}.wav"})
    json.dump(shard, sys.stdout, ensure_ascii=False, indent=1)
    from collections import Counter
    print(f"\n# {len(shard)} unique items, {sum(len(s['padas']) for s in shard)} padas, metres {dict(Counter(s['meter'] for s in shard))}", file=sys.stderr)


def wire(audio_dir: Path) -> None:
    """Point every mantra at its rendered file, if there is one (any of .opus/.mp3/.m4a/.wav)."""
    have = {p.stem: p.name for p in audio_dir.iterdir() if p.suffix in (".opus", ".mp3", ".m4a", ".wav")}
    parts_dir = ROOT / "src/content/parts"
    n = 0
    for part in parts_dir.glob("*.json"):
        steps = json.loads(part.read_text())
        for step in steps:
            for item in step["items"]:
                if item.get("kind") != "mantra":
                    continue
                i = item_id(item["text"]["iast"])
                # a line that names the time of day has one clip per kāla (<id>-<kala>); see docs/reference/tools/vagdhenu/segments.py
                by_kala = {k: f"/audio/{have[f'{i}-{k}']}" for k in ("pratah", "madhyahnika", "sayam") if f"{i}-{k}" in have}
                if i in have:
                    item["audio"] = f"/audio/{have[i]}"
                    n += 1
                elif by_kala:
                    item["audio"] = by_kala
                    n += 1
        part.write_text(json.dumps(steps, ensure_ascii=False, indent=2) + "\n")
    print(f"wired {n} items; now run pnpm xlit")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "build"
    if cmd == "build":
        build(sys.argv[2] if len(sys.argv) > 2 else "out", "--vedic" in sys.argv)
    elif cmd == "wire":
        wire(Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "public/audio")
    else:
        sys.exit("usage: audio_shard.py build | wire [audio_dir]")
