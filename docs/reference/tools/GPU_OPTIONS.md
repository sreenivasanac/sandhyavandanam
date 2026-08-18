# GPU rental options for the one-off Vāgdhenu batch render (2026-08-17)

Job: render ~157 laukika Sanskrit items (~7,600 chars) with Vāgdhenu (IndicF5 DiT ~337M fp32 + BigVGAN-v2). Needs **CUDA GPU with ≥ 8 GB VRAM** (peak inference ~2.5 GB per the tech report), ~2.5 GB of weight downloads (voice 1.35 GB + vocoder 0.45 GB + BigVGAN base ~0.5 GB + Vocos), Python 3.10.

**Read `VAGDHENU_LOCAL.md` first** — the render works on the M4 Pro (MPS) at ~17 s per hemistich (~2 h for the whole corpus, unattended). Renting a GPU is only worth it if you want it in ~10 min or want to iterate on seeds/cfg. On a T4 the tech report quotes RTF ≈ 1.2 at nfe 64 (~10 s per hemistich); a 3090/4090/L4 is 2–4× faster than that. Realistic wall time on any rented GPU: **setup 15–30 min + render 5–15 min ≈ 30–45 min**, i.e. every option below costs well under $2. The decisive factor is **friction**, not price.

Reddit thread consulted (r/LocalLLaMA "Where do you all rent GPU servers for small ML/AI side projects?", Mar 2026): consensus = Vast.ai (cheap retail 3090/4090, pick data-center hosts), RunPod (most-used, simple), Thunder Compute (cheap A100/H100, CEO posts there), gpus.io as the live price aggregator; several people note "AWS is overkill for short experiments" and one warns "you forget to tear it down and wake up to a bill".

## Comparison (single GPU, prices checked 2026-08-17; marketplaces fluctuate — verify on gpus.io)

| Provider | GPU for us | $/hr | Billing min. | Setup friction | Est. total for our job | Gotchas |
|---|---|---|---|---|---|---|
| **RunPod Pods** (Community Cloud) | RTX 3090 24 GB $0.50 · RTX A5000 24 GB $0.27 · L4 $0.49 · RTX 4090 $0.74 · A40 48 GB $0.44 | 0.27–0.74 | per-second | Account + card (min $10 top-up), pick "PyTorch 2.4 CUDA 12.1" template, web terminal or SSH, Jupyter included | **~$0.50–1** for 45 min + ~$0.10 disk | Community-cloud pods can be pre-empted/unavailable in region; container disk is ephemeral — copy wavs out (runpodctl / scp / HF upload) before stopping. Storage billed while stopped ($0.10–0.20/GB/mo). |
| RunPod Serverless | L4/A5000/3090 class $0.69/hr, A4000 16 GB $0.58/hr | per-second | Must package a Docker handler; cold starts | ~$0.30 | Only worth it for a repeatable API, not a one-off; the packaging is more work than the render. Reddit thread notes reliability complaints. |
| **Vast.ai** (marketplace) | RTX 3090 ~$0.15–0.30 · RTX 4090 ~$0.30–0.50 (on-demand; interruptible ~50 % less) | ~0.2–0.5 | per-second, small deposit ($5+) | Account + card, choose a host (filter "verified/data-center", ≥ 99 % reliability, ≥ 200 Mbps down), pytorch/cuda template, SSH or Jupyter | **~$0.30–0.60** | Peer hosts vary (slow disks/uplinks make the 2.5 GB download slow); host may go away — render, copy out, destroy. Cheapest raw $/hr. |
| **Thunder Compute** | A6000 48 GB $0.35 · L40 $0.79 · A100 80 GB $1.09 | 0.35 | per-minute | Account + card, `pip install tnr` CLI, `tnr create --gpu a6000`, `tnr connect` (SSH), snapshots | **~$0.30–0.50** | Virtualised GPU (their own layer) — occasional CUDA lib quirks reported; T4/3090-class not offered (A6000 is the entry). No egress fees. |
| gpus.io | (aggregator only) | — | — | Read-only price table over 17 providers | — | Use to pick the cheapest live 3090/4090/L4 offer, then go to that provider. |
| **Lambda** | Nothing small: cheapest single GPU is A100 40 GB $1.99 (V100 16 GB $0.79 rarely available) | 0.79–1.99 | per-minute | Account + card, SSH, Lambda Stack preinstalled | ~$1.50 | Overkill/priced for H100 users; capacity for 1× instances often "unavailable". |
| **Modal** (serverless) | T4 $0.59 · L4 $0.80 · A10 $1.10 · L40S $1.95 (per-second) | per-second | **$30/month free credit on the free Starter plan** — no card required to start | Write a ~40-line `modal.py` (image with deps, `@app.function(gpu="L4")`), `modal run`; weights cached in a Modal Volume; wavs come back via Volume/return value | **$0 (inside free credit)**; ~0.5 h × $0.80 = $0.40 of credit | Must express the run as a Python function + image (no interactive shell by default, though `modal shell` exists); first build downloads weights (~5 min). Best "no-card, scriptable" option. |
| **HF ZeroGPU** — duplicate the `prathoshap/vagdhenu-demo` Space | RTX Pro 6000 (48 GB slice), free | free | Free account (≥ 30 days old, verified email) can host 2 ZeroGPU Spaces; PRO $9/mo = 8× quota | Duplicate Space → remove/raise `limits.py` (10 renders/IP/day, ≤ 100 akṣaras) in **your** copy → drive it via `gradio_client` from a laptop loop | **$0–9** | ZeroGPU daily GPU-seconds quota (free tier is small; PRO ×8) — 157 items × ~15 s ≈ 40 GPU-min may exceed free quota → PRO for one month ($9). Gradio-only, per-request cold start 10–60 s, ZeroGPU torch ≥ 2.8 differs from the validated torch 2.4.1 stack (the demo already runs there, so it works). Not for bulk in the *original* Space (10/IP/day). |
| HF dedicated Space / Inference Endpoint | T4 small $0.40 · L4 $0.80 · A10G small $1.00 | per-minute | Push repo as a Space with `sdk: gradio` on paid hardware, or Endpoint with custom handler | ~$0.50–1 | Endpoint needs a custom handler image; a paid Space is just the demo on a private GPU — fine, but pods are simpler. Replicate has no Vāgdhenu model; building a Cog image is more work than the render. |
| **Google Colab** | Free: T4 16 GB (not guaranteed) · Pro $9.99/mo = 100 CU; T4 ≈ 1.2 CU/h, L4 ≈ 1.7 CU/h, A100 ≈ 5.4 CU/h | free / ~$0.12–0.17/h effective | Google account; Pro = card | Notebook: `!git clone`, `!bash scripts/setup.sh`, upload shard, `!python src/render.py`, zip + download or push to Drive | **$0 (free T4)** or $9.99 (Pro) | Free tier: session limits, GPU may be unavailable, disconnects idle sessions; py3.10 wheel pin (`torch==2.4.1+cu121`) may fight Colab's preinstalled torch/numpy — use a fresh venv inside the notebook. Weights re-download each session (~2 min). |
| **AWS EC2** | g4dn.xlarge (T4) $0.53 od / ~$0.30 spot · g6.xlarge (L4) $0.80 / ~$0.40 spot · g5.xlarge (A10G) $1.01 / ~$0.48 spot | per-second (60 s min) | AWS account + card, **vCPU quota request for G instances is often 0 by default (can take a day)**, key pair, security group, Deep Learning AMI | ~$0.50 (+ EBS pennies) | Quota request is the killer for a one-off; spot can be reclaimed; must remember to terminate + delete EBS. |
| **GCP** | T4 ~$0.35 + VM · g2-standard-4 (L4) $0.71 od / $0.42 spot | per-second (1 min min) | Google Cloud account + card, **GPU quota request (default 0)**, $300 new-account credit | ~$0.50 (or $0 on trial credit) | Same quota friction as AWS; new-account credit sometimes excludes GPUs until upgraded. |

Notes on suitability: T4 (16 GB) is enough (fp32 ~2.5 GB peak); L4/A10G/3090/4090 halve the render time. Nothing here needs > 24 GB.

## Ranking for this job

1. **Modal** — $0 (free monthly credit), no card, fully scriptable (`modal run render_modal.py`), weights cached in a Volume so re-runs (new seed/cfg) cost seconds of setup. Cost of a full render ≈ $0.40 of credit on an L4. Only "cost" is writing a ~40-line wrapper (below).
2. **RunPod Community pod (RTX 3090 / A5000 / L4, ~$0.30–0.50/hr)** — the most-recommended interactive path in the Reddit thread; `bash scripts/setup.sh` runs unmodified in the PyTorch-CUDA-12.1 template. Total ≈ $1 incl. a $10 minimum top-up (the balance stays for future runs). Pick this if you prefer an SSH/Jupyter shell over a function.
3. **Google Colab free T4** — $0, notebook, no card; acceptable if the free GPU is available and you tolerate re-downloading weights per session. Vast.ai is the cheapest per hour but adds host-selection friction for a saving of cents; Thunder Compute is a fine RunPod substitute (A6000 $0.35) if RunPod has no capacity.

Ruled out: HF Space quota (10/IP/day) for bulk; AWS/GCP (quota requests, account setup ≫ render time); Lambda (no small GPUs); RunPod Serverless / Replicate / HF Endpoints (packaging effort ≫ a 10-min render).

## Step list for the winner (Modal)

What **you** do (one-time, ~5 min): create a Modal account at https://modal.com (GitHub login; Starter plan, no card needed for the $30/mo credit), then locally `uv pip install modal` (or `uv run --with modal …`) and `modal setup` (opens browser, stores token). Optional: `HF_TOKEN` env for faster HF downloads (not required — the weights repo is public).

What is scripted (`docs/reference/tools/vagdhenu/render_modal.py`, sketch — untested, ~40 lines):

```python
import modal
app = modal.App("vagdhenu")
image = (modal.Image.from_registry("nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu22.04", add_python="3.10")
    .apt_install("git", "ffmpeg")
    .run_commands("git clone --depth 1 https://github.com/prathoshap/vagdhenu /vagdhenu",
                  "cd /vagdhenu && bash scripts/setup.sh"))       # torch cu121 + deps + BigVGAN clone + weights
vol = modal.Volume.from_name("vagdhenu-out", create_if_missing=True)

@app.function(image=image, gpu="L4", timeout=3600, volumes={"/out": vol})
def render(shard: bytes) -> list[str]:
    import subprocess, json, pathlib
    pathlib.Path("/out/shard.json").write_bytes(shard)
    subprocess.run(["python", "src/render.py", "--shard", "/out/shard.json", "--results", "/out/results.json",
                    "--outdir", "/out/wav"], cwd="/vagdhenu", check=True, env={"PYTHONPATH": "/vagdhenu/BigVGAN", **os.environ})
    vol.commit(); return sorted(p.name for p in pathlib.Path("/out/wav").glob("*.wav"))

@app.local_entrypoint()
def main(shard: str = "shard.json"):
    print(render.remote(open(shard, "rb").read()))
```

Run: `modal run render_modal.py --shard shard.json` → then `modal volume get vagdhenu-out wav ./wav`. Setup: image build ~5–8 min once (cached), render 157 items on L4 ≈ 10–15 min. Then locally: `ffmpeg -i x.wav -c:a libopus -b:a 48k x.opus` (or use the same loop as in `VAGDHENU_LOCAL.md`).

Fallback (RunPod pod) — what you do: sign up at https://runpod.io, add $10 credit, Deploy → Community Cloud → RTX 3090 / A5000 / L4 → template "RunPod PyTorch 2.4.0 CUDA 12.4" (or any CUDA 12.x image; the cu121 wheels run on newer drivers) → Connect → Web Terminal. Scripted from there: `git clone https://github.com/prathoshap/vagdhenu && cd vagdhenu && bash scripts/setup.sh && export PYTHONPATH=$PWD/BigVGAN`, upload `shard.json` (Jupyter upload or `runpodctl receive`), `python src/render.py --shard shard.json --results res.json --outdir out`, `zip -r out.zip out`, download via Jupyter, **Terminate the pod** (not just Stop).
