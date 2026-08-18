# /// script
# requires-python = ">=3.10"
# ///
"""Build the Vāgdhenu batch-render shard from the content, and (after rendering) wire audio paths back in.

  uv run scripts/audio_shard.py build  > vagdhenu_shard.json   # items to render (laukika only)
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


def build() -> None:
    seen, shard = set(), []
    for step, item in laukika_items():
        t = item["text"]["iast"]
        i = item_id(t)
        if i in seen:
            continue  # same mantra repeated in several steps → render once
        seen.add(i)
        padas = [p.strip() for p in re.split(r"\n|\|\|?", t) if p.strip()]
        is_verse = "\n" in t and len(padas) in (2, 4)  # crude: 2/4 line items are ślokas, else prose (gadya)
        shard.append({"id": i, "step": step["id"], "meter": "auto" if is_verse else "gadya", "padas": padas, "seed": 1, "out": f"{i}.wav"})
    json.dump(shard, sys.stdout, ensure_ascii=False, indent=1)
    print(f"\n# {len(shard)} unique items, {sum(len(''.join(s['padas'])) for s in shard)} chars", file=sys.stderr)


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
        build()
    elif cmd == "wire":
        wire(Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "public/audio")
    else:
        sys.exit("usage: audio_shard.py build | wire [audio_dir]")
