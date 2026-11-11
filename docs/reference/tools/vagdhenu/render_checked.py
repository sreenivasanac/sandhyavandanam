"""Render shard clips with Vāgdhenu's MLX backend (run inside the vagdhenu checkout with its venv).

  python render_checked.py shard.json OUTDIR [--ids ids.txt] [--seed 60] [--meter anushtubh]

Writes OUTDIR/<id>.wav and OUTDIR/man.json ([{id, f, ref}]) for hear.py. `ref` has ॐ removed because the
Su-śrotā recogniser never transcribes oṃ (Whisper confirms it is voiced) — otherwise every oṃ line would score as an error.
"""
import argparse, json, os, sys, time
sys.path.insert(0, "src")
import soundfile as sf, mlx.core as mx
from vagdhenu_mlx import Renderer

ap = argparse.ArgumentParser(); ap.add_argument("shard"); ap.add_argument("outdir")
ap.add_argument("--ids"); ap.add_argument("--seed", type=int, default=60); ap.add_argument("--meter")
a = ap.parse_args()
os.makedirs(a.outdir, exist_ok=True)
clips = json.load(open(a.shard, encoding="utf-8"))
if a.ids:
    want = set(open(a.ids).read().split()); clips = [c for c in clips if c["id"] in want]
r = Renderer("models/mlx", nfe=64, cfg=3.0, speed=0.90, dtype=mx.bfloat16)
man = []
for n, c in enumerate(clips, 1):
    t0 = time.time()
    try:
        sr, au = r.render_one(c["padas"], a.meter or c["meter"], seed=a.seed, no_sandhi=True)
    except Exception as e:  # keep going; the check pass will flag the missing clip
        print("ERR", c["id"], repr(e)[:160], flush=True); continue
    f = os.path.join(a.outdir, c["id"] + ".wav"); sf.write(f, au, sr)
    man.append(dict(id=c["id"], f=f, ref=c["ref"].replace("ॐ", "")))
    print(f"[{n}/{len(clips)}] {c['id']} {len(au)/sr:.1f}s in {time.time()-t0:.0f}s", flush=True)
json.dump(man, open(os.path.join(a.outdir, "man.json"), "w"), ensure_ascii=False)
