# Vāgdhenu on Apple Silicon (M4 Pro, MPS) — runbook (verified 2026-08-17)

**Result: it works locally, no GPU rental needed.** Vāgdhenu (IndicF5/F5-TTS DiT + BigVGAN-v2, `use_cuda_kernel=False` torch path) renders on the M4 Pro 24 GB via PyTorch MPS after a 6-line device patch. Measured: **~17 s per hemistich at nfe 64** (production quality), **~9 s at nfe 32**; CPU-only ~3× slower than MPS. Whole corpus (157 items ≈ 7,600 chars, ~2 padas each) ≈ **1.5–2 h at nfe 64** or **~1 h at nfe 32**, unattended. Sample outputs: `vagdhenu/samples/*.wav` (listen and judge; MPS output was not audited by ear here — envelope/duration/sample-rate check only).

## What Vāgdhenu is (facts pulled from repo + HF card + tech report)
- Base: **IndicF5** (AI4Bharat fork of F5-TTS, flow-matching DiT, dim 1024/depth 22/heads 16, ~337M, no duration/pitch head), Sanskrit routed through **Kannada script**. Installed from GitHub commit `13f7c4d6` (NOT the PyPI `f5-tts`).
- Vocoder: **NVIDIA BigVGAN-v2** `bigvgan_v2_24khz_100band_256x` fine-tuned (`voc_bigvgan_EMA_2026-06-11.pth`, 450 MB, mandatory). Vocos is loaded only as a shim to capture the mel.
- Weights (HF `prathoshap/vagdhenu`, Apache-2.0): `voice_steer_ema_2026-06-17.pt` 1.35 GB (production voice), `voice_armA_ema_2026-06-11.pt` 1.35 GB (fallback, not needed), vocoder 450 MB, `vocab.txt`. Plus BigVGAN base from `nvidia/bigvgan_v2_24khz_100band_256x` (~0.5 GB pulled by `from_pretrained`) and `charactr/vocos-mel-24khz` (small).
- Upstream assumptions: Python 3.10, `torch==2.4.1+cu121`, `.cuda()` hard-coded in `src/render.py`; VRAM need ~2.5 GB peak (fp32); tech-report RTF on A6000: 1.24 @ nfe 64, 0.63 @ nfe 32.
- Batch shard JSON (`src/render.py --shard`): `[{"id","meter","padas":[devanagari,…],"seed":60,"no_sandhi":false,"out":"/abs/x.wav"}]`; optional per-clip `speed`, `sps`, `ref_wav`/`ref_text`, `no_autoprime`. Meter keys from `src/reference_bank/bank.json`: anushtubh, pramanika, vasantatilaka, upajati, indravajra, upendravajra, vamshastha, rathoddhata, shalini, indravamsha, drutavilambita, bhujangaprayata, malini, shardulavikridita, sragdhara, vrutta1, **gadya**, gadya_mbtn; unknown → falls back to vasantatilaka. Each pada is rendered separately with a 0.55 s gap (`--gap`).
- Demo Space (ZeroGPU) limits: 10 renders/IP/day, ≤ 100 akṣaras, one śloka per request (`src/limits.py`) → not for bulk.

## Setup (exact commands, ~10 min + ~2.5 GB download)
```bash
WORK=~/vagdhenu-work && mkdir -p $WORK && cd $WORK
git clone --depth 1 https://github.com/prathoshap/vagdhenu && cd vagdhenu
git clone --depth 1 https://github.com/NVIDIA/BigVGAN.git BigVGAN     # repo, not a pip pkg; torch path only

uv venv --python 3.10 .venv
uv pip install --python .venv/bin/python torch==2.4.1 torchaudio==2.4.1        # macOS arm64 wheels (MPS)
uv pip install --python .venv/bin/python --no-deps \
  "git+https://github.com/ai4bharat/IndicF5.git@13f7c4d627cc10111aea8fe9c0039462cacacdc7"
uv pip install --python .venv/bin/python transformers==4.46.3 accelerate==0.34.2 vocos==0.1.0 \
  x-transformers==2.19.7 librosa==0.11.0 soundfile "huggingface_hub<1.0" indic-transliteration \
  jieba pypinyin ema_pytorch torchdiffeq pydub matplotlib tqdm "datasets>=3" wandb safetensors
uv pip install --python .venv/bin/python numpy==1.26.4 torch==2.4.1 torchaudio==2.4.1   # re-pin (deps bump them)

# weights (skip the 1.35 GB armA fallback)
uv run --with huggingface_hub hf download prathoshap/vagdhenu \
  voice_steer_ema_2026-06-17.pt voc_bigvgan_EMA_2026-06-11.pth vocab.txt --local-dir models
uv run --with huggingface_hub hf download nvidia/bigvgan_v2_24khz_100band_256x     # ~3.5 GB cache incl. all files

# device patch (cuda -> mps/cpu autodetect, + per-clip timing)
patch -p0 < /path/to/sandhyavandanam/docs/reference/tools/vagdhenu/render_mps.patch
```
Why the extra pins: `IndicF5`'s setup.py drags in training deps (wandb, datasets, hydra…) — installed with `--no-deps` and only the imports the inference path actually touches added; `datasets 2.x` breaks on pyarrow ≥ 21 (`PyExtensionType`) → `datasets>=3`; `transformers 4.46.3` needs `huggingface_hub<1.0`; `x-transformers` pulls a newer torch → re-pin 2.4.1. `uv pip check` will still complain about `torch-einops-utils` wanting torch ≥ 2.5 and missing `cached_path/hydra/tomli` — harmless for inference. (Torch 2.13 also imported fine if you'd rather use latest MPS kernels; not timed.)

## Render
```bash
cd $WORK/vagdhenu
export PYTHONPATH=$PWD/BigVGAN PYTORCH_ENABLE_MPS_FALLBACK=1   # fallback needed: aten::unfold_backward (vocos istft) has no MPS kernel

# 1) items.tsv: id<TAB>meter<TAB>IAST (padas split on | / ||)  -> shard.json (Devanagari)
.venv/bin/python /path/to/sandhyavandanam/docs/reference/tools/vagdhenu/make_shard.py items.tsv shard.json $PWD/out
# 2) render (production settings: nfe 64, cfg 3.0, speed 0.90, seed 60)
.venv/bin/python -u src/render.py --shard shard.json --results results.json          # add --nfe 32 for ~2x speed
# 3) mp3/opus for the PWA
for f in out/*.wav; do ffmpeg -loglevel error -y -i "$f" -c:a libopus -b:a 48k "${f%.wav}.opus"; done
```
`VAGDHENU_DEVICE=cpu` forces CPU. `--outdir DIR` overrides per-clip `out`. Re-render a bad clip with a different `seed` in the shard (upstream retries seed+1..3 automatically when the output is near-silent).

## Measured timings (M4 Pro, 24 GB, macOS, torch 2.4.1)
| Run | Item | Output | Wall | RTF |
|---|---|---|---|---|
| MPS, nfe 64 | śuklāmbaradharaṃ… (anuṣṭubh, 2 padas) | 9.39 s @ 24 kHz | 34.7 s | 3.7 |
| MPS, nfe 64 | oṃ acyutāya namaḥ … (gadya, 3 padas) | 6.65 s | 53.4 s | 8.0 |
| MPS, nfe 32 | same śloka / same gadya | 9.39 s / 6.69 s | 18.1 s / 25.5 s | 1.9 / 3.8 |
| CPU, nfe 64 | same śloka | 9.67 s | 105.5 s | 10.9 |
| Model load (warm cache) | — | — | ~4 s (+ ~50 s first run: Vocos/BigVGAN downloads) | |

Cost model: time ≈ (#padas) × 17 s at nfe 64 (each pada is one DiT pass over ref + generated mel; the gadya reference is 7.8 s, so short prose lines still cost a full pass — that's why 3 short gadya pieces took longer than the śloka). Peak RSS ~6 GB; MPS fallback warning for `unfold_backward` is expected. **157 items ≈ 320 padas → ~90 min at nfe 64, ~45 min at nfe 32.** Outputs verified with soundfile: 24 kHz mono float, energy envelope shows the expected pada/pause structure. The gadya clip has 115 samples at full scale (upstream normalises each piece to 0.97 only when > 1.0; the louder gadya reference runs hot) — normalise in ffmpeg (`-af loudnorm` or `-filter:a volume=-1dB`) if audible.

## Files here
- `vagdhenu/render_mps.patch` — the only code change (device autodetect `cuda>mps>cpu`, `VAGDHENU_DEVICE` override, per-clip wall/RTF print). Apply with `patch -p0` inside the cloned repo (paths `src/render.py`).
- `vagdhenu/make_shard.py` — IAST TSV → Devanagari shard (self-check: `SELFCHECK=1`).
- `vagdhenu/items_example.tsv` — the two test items.
- `vagdhenu/samples/` — the rendered wavs (nfe 64 and nfe 32) to audition.
- `GPU_OPTIONS.md` — rental comparison if you want it faster / to iterate seeds (Modal free credit or a $0.50/h RunPod pod; ~10 min render).
