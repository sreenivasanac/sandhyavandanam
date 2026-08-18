"""Build a Vāgdhenu shard JSON from a TSV of laukika items: `id<TAB>meter<TAB>iast text`.
IAST -> Devanagari via indic_transliteration; `|`/`||` split the text into padas (each pada is
rendered separately and stitched with a pause). meter = bank key (anushtubh, gadya, upajati, ...).
Usage: .venv/bin/python make_shard.py items.tsv shard.json /abs/outdir"""
import csv, json, os, sys
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate

src, dst, outdir = sys.argv[1], sys.argv[2], os.path.abspath(sys.argv[3])
clips = []
for row in csv.reader(open(src, encoding="utf-8"), delimiter="\t"):
    if not row or row[0].startswith("#"): continue
    cid, meter, text = row[0].strip(), row[1].strip(), row[2].strip()
    padas = [transliterate(p.strip(), sanscript.IAST, sanscript.DEVANAGARI)
             for p in text.replace("||", "|").split("|") if p.strip()]
    clips.append({"id": cid, "meter": meter, "padas": padas, "seed": 60, "no_sandhi": False,
                  "out": f"{outdir}/{cid}.wav"})
json.dump(clips, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{len(clips)} clips -> {dst}")

if __name__ == "__main__" and os.environ.get("SELFCHECK"):
    assert transliterate("śuklāmbaradharaṃ", sanscript.IAST, sanscript.DEVANAGARI) == "शुक्लाम्बरधरं"
