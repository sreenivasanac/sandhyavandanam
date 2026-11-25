"""Join checked segment clips into the final chant clips (run with the vagdhenu venv: it has numpy and soundfile).

  python join_segments.py WORKDIR OUTDIR [--max-cer 0.12]

Reads WORKDIR/plan.json and WORKDIR/best.json ({segment id: {f, cer}}). A clip is written only if every one of its
segments passed the listening check; the others are listed so the app simply shows no chant button for them.
Segments are joined with a short pause; "GAP" leaves a longer silence for the user's own word (name, gotra, count).
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf

LINE_PAUSE, GAP_PAUSE = 0.35, 1.4
work, out = sys.argv[1], sys.argv[2]
max_cer = float(sys.argv[sys.argv.index("--max-cer") + 1]) if "--max-cer" in sys.argv else 0.12
best = json.load(open(f"{work}/best.json"))
os.makedirs(out, exist_ok=True)
skipped = []
for clip in json.load(open(f"{work}/plan.json")):
    bad = [p for p in clip["parts"] if p != "GAP" and (p not in best or best[p]["cer"] > max_cer)]
    if bad:
        skipped.append((clip["out"], clip["step"], [best.get(b, {}).get("hyp", "missing") for b in bad]))
        continue
    audio, sr, prev = [], 24000, None
    for p in clip["parts"]:
        if p == "GAP":
            audio.append(np.zeros(int(sr * GAP_PAUSE), dtype="float32"))
        else:
            a, sr = sf.read(best[p]["f"], dtype="float32")
            if prev not in (None, "GAP"):
                audio.append(np.zeros(int(sr * LINE_PAUSE), dtype="float32"))
            audio.append(a)
        prev = p
    wav = f"{work}/joined-{clip['out']}.wav"
    sf.write(wav, np.concatenate(audio), sr)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-af", "loudnorm=I=-18:TP=-1.5:LRA=11", "-ar", "24000", "-ac", "1", "-c:a", "aac", "-b:a", "64k", f"{out}/{clip['out']}"], check=True)
print("skipped:", json.dumps(skipped, ensure_ascii=False, indent=1))
