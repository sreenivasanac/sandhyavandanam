# /// script
# requires-python = ">=3.10"
# ///
"""Build the Vāgdhenu batch-render shard from the content, and (after rendering) wire audio paths back in.

  uv run scripts/audio_shard.py build /abs/outdir > shard.json   # Vāgdhenu shard (laukika only)
  uv run scripts/audio_shard.py wire  public/audio               # set item.audio for every rendered file

Selection: mantras WITHOUT Vedic svara marks and WITHOUT {placeholders} (Vāgdhenu is laukika-only; personalised
items can't be pre-rendered). Each shard entry: id (stable hash of the IAST), meter ('gadya' for prose; verse
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


def laukika_items():
    data = json.loads(CONTENT.read_text())
    for step in data["steps"]:
        for item in step["items"]:
            if item.get("kind") != "mantra":
                continue
            t = item["text"]["iast"]
            if SVARA.search(t) or PLACEHOLDER.search(t):
                continue
            yield step, item


VOWELS = re.compile(r"[aāiīuūṛṝḷeo]|ai|au")
# syllables per half-verse (2 pādas) → Vāgdhenu reference-bank metre key; anything else is chanted as prose
METRE = {16: "anushtubh", 22: "upajati", 24: "vamshastha", 28: "vasantatilaka", 30: "malini", 38: "shardulavikridita", 42: "sragdhara"}


def guess_meter(lines: list[str]) -> str:
    counts = {len(VOWELS.findall(l)) for l in lines}
    return METRE[next(iter(counts))] if len(counts) == 1 and next(iter(counts)) in METRE else "gadya"


def build(outdir: str) -> None:
    """Vāgdhenu shard: one clip per unique laukika mantra; padas = lines (Devanagari, dandas stripped)."""
    seen, shard = set(), []
    for step, item in laukika_items():
        t = item["text"]["iast"]
        i = item_id(t)
        if i in seen:
            continue  # same mantra repeated in several steps → render once
        seen.add(i)
        lines = [p.strip(" |") for p in t.split("\n") if p.strip(" |")]
        meter = guess_meter(lines) if len(lines) in (2, 4) else "gadya"
        # for prose keep the source's `|` groups as separate padas (short breath groups chant better)
        src_padas = lines if meter != "gadya" else [p.strip() for p in re.split(r"\n|\|\|?", t) if p.strip()]
        deva = item["text"]["devanagari"]
        deva_padas = [p.strip() for p in re.split(r"\n|॥|।", deva) if p.strip()]
        if len(deva_padas) != len(src_padas):  # fall back to whole text as one pada
            deva_padas = [re.sub(r"[।॥\n]+", " ", deva).strip()]
        shard.append({"id": i, "step": step["id"], "meter": meter, "padas": deva_padas, "iast": src_padas, "seed": 60, "no_sandhi": False, "out": f"{outdir}/{i}.wav"})
    json.dump(shard, sys.stdout, ensure_ascii=False, indent=1)
    from collections import Counter
    print(f"\n# {len(shard)} unique items, {sum(len(s['padas']) for s in shard)} padas, metres {dict(Counter(s['meter'] for s in shard))}", file=sys.stderr)


def wire(audio_dir: Path) -> None:
    """Point every laukika item at its rendered file (any of .opus/.mp3/.wav present)."""
    have = {p.stem: p.name for p in audio_dir.iterdir() if p.suffix in (".opus", ".mp3", ".m4a", ".wav")}
    parts_dir = ROOT / "src/content/parts"
    n = 0
    for part in parts_dir.glob("*.json"):
        steps = json.loads(part.read_text())
        for step in steps:
            for item in step["items"]:
                if item.get("kind") != "mantra":
                    continue
                t = item["text"]["iast"]
                if SVARA.search(t) or PLACEHOLDER.search(t):
                    continue
                name = have.get(item_id(t))
                if name:
                    item["audio"] = f"/audio/{name}"
                    n += 1
        part.write_text(json.dumps(steps, ensure_ascii=False, indent=2) + "\n")
    print(f"wired {n} items; now run pnpm xlit")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "build"
    if cmd == "build":
        build(sys.argv[2] if len(sys.argv) > 2 else "out")
    elif cmd == "wire":
        wire(Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "public/audio")
    else:
        sys.exit("usage: audio_shard.py build | wire [audio_dir]")
