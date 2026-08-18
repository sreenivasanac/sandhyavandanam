# /// script
# requires-python = ">=3.10"
# dependencies = ["aksharamukha>=2.3"]
# ///
"""Pre-render every mantra's IAST into Devanagari/Tamil/Kannada/Telugu/Malayalam (in place, idempotent).

Run: pnpm xlit   (= uv run scripts/xlit.py)
Why build-time Python: aksharamukha handles Vedic accents (॒ ॑ ᳚ in the right order) and Tamil superscript
numerals correctly; the JS sanscript in the app only remains as runtime fallback for user-typed names.
"""
import json, re, sys
from pathlib import Path
from aksharamukha import transliterate as T

CONTENT = Path(__file__).resolve().parent.parent / "src/content/sandhya.json"
TARGETS = {"devanagari": "Devanagari", "tamil": "Tamil", "kannada": "Kannada", "telugu": "Telugu", "malayalam": "Malayalam"}
PLACEHOLDER = re.compile(r"(\{\w+\})")


def xlit(iast: str, script: str) -> str:
    opts = ["Dot2Dandas"] + (["TamilRemoveApostrophe"] if script == "Tamil" else [])
    out = []
    for part in PLACEHOLDER.split(iast):  # keep {name}-style placeholders untouched
        if PLACEHOLDER.fullmatch(part) or not part:
            out.append(part)
            continue
        s = T.process("IAST", script, part, post_options=opts)
        if script == "Tamil":
            s = s.replace("꞉", "ஃ")  # visarga ꞉ (no Tamil glyph) → āytham ஃ (Tamil-Brahmin convention)
            s = re.sub(r"([²³⁴])([॒॑᳚])", r"\2\1", s)  # accent goes on the letter, not on the superscript digit
        out.append(s)
    return "".join(out)


def main() -> None:
    data = json.loads(CONTENT.read_text())
    n = 0
    for step in data["steps"]:
        for item in step["items"]:
            if item.get("kind") != "mantra":
                continue
            for key, script in TARGETS.items():
                item["text"][key] = xlit(item["text"]["iast"], script)
            n += 1
    CONTENT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(f"rendered {n} mantras × {len(TARGETS)} scripts → {CONTENT.relative_to(Path.cwd())}")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--check":  # tiny self-check
        assert xlit("dhiyo̱ yo na̍ḥ | {name} śarmā", "Devanagari") == "धियो॒ यो नः॑ । {name} शर्मा"
        assert xlit("na̍ḥ", "Tamil") == "ந॑ஃ"
        print("ok")
    else:
        main()
