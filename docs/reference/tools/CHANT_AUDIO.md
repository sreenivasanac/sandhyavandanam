# Chant / pronunciation audio — research (2026-08-17)

## Report: prathosh.in projects & Sanskrit/Vedic chant audio options for the Sandhyavandanam PWA

### TL;DR
- **Vāgdhenu** is a real, open (Apache-2.0), high-quality **laukika Sanskrit śloka-to-chant TTS**. It explicitly does **not** do Vedic svaras ("No Vedic svaras" on the model card; "not intended for Vedic texts" on the Vāgbodhinī page). Upstream assumes a CUDA GPU (~1.8 GB weights), but it **runs on the M4 Pro via MPS** after a small patch — see `VAGDHENU_LOCAL.md` (≈17 s per hemistich; whole corpus ≈ 1–2 h) and `GPU_OPTIONS.md` for rentals. Usable only for the non-Vedic bits of Sandhyavandanam (saṅkalpa prose, dhyāna ślokas, ācamana names).
- **Vāgbodhinī** = Vāgdhenu + **Su-śrotā** ASR = a chant *tutor* (verify user's recitation). Su-śrotā's normalisation **drops Vedic accent marks** — it cannot score svaras. Server + GPU app, not embeddable in a static PWA.
- **No TTS anywhere (open or commercial) honours udātta/anudātta/svarita.** Even Prathosh's own Vedic app (VedaVaaNi) uses **professionally recorded human chanters** (Sringeri/Kanchi), not TTS.
- **Recommendation:** v1 chant feature = ship **human-recorded mp3s per step** (own/consented recording, or a licence-cleared source), plain `<audio>`. Optionally pre-generate the laukika ślokas with Vāgdhenu offline. Defer svara-TTS and pronunciation scoring.

---

### 1. The three prathosh.in projects

| | Vāgdhenu | Vāgbodhinī | Su-śrotā (Sushrotaa) |
|---|---|---|---|
| URL | https://prathosh.in/vagdhenu/ | https://prathosh.in/vagbodhini/ | https://prathosh.in/sushrotaa/ |
| What | **TTS**: metre-aware Sanskrit *chant* synthesis (pārāyaṇa style, not flat read-aloud). Detects vṛtta (anuṣṭubh, upajāti, śārdūlavikrīḍita, vasantatilakā, mālinī, sragdharā … 16 metres in bank + 2 `gadya`/prose refs) | **Tutor app**: paste śloka → hear Vāgdhenu chant per pāda/ardha/full → record yourself → per-akṣara correct/fix/unclear scoring | **ASR**: Sanskrit speech-to-text tuned for recitation/śāstra prose (dictation UI on the page) |
| Input / output | Devanāgarī/Kannada/Telugu/Tamil/Malayalam/Grantha/IAST/HK/ITRANS in → 24 kHz wav. Batch renderer takes shard JSON `[{"id","meter","padas":[…],"seed","out"}]` (`src/render.py`); single verse `src/render_production.py` | Text in any script + mic audio → per-syllable feedback JSON/UI | 16 kHz mono wav → Devanāgarī text |
| Vedic svaras | **No** ("No Vedic svaras", "not designable prosody"; prosody comes only from a per-metre reference clip) | No (laukika only, states this) | Normaliser strips accent marks → svara-blind |
| Tech | IndicF5 / F5-TTS flow-matching DiT (~337M) fine-tuned on ~5 h single-speaker chant corpus (author's own voice) + BigVGAN-v2 vocoder fine-tune. Routes Sanskrit via Kannada script (avoids Hindi schwa deletion). Frontend `src/prep_text.py` (visarga sandhi, homorganic anusvāra, ṝ, daṇḍa rules, metre scan) is pure-Python and reusable | FastAPI backend + single-file UI + TTS microservice + ASR (repo `vagbodhini/`); scripts assume lab server | IndicConformer-CTC (~129M) NeMo model, Sanskrit token slice; chant CER 6.0 %, prose 7.3 % |
| Size / runtime | Voice 1.35 GB + vocoder 450 MB + IndicF5 base; **Python 3.10 + CUDA 12.1 GPU required**. Not browser-runnable | Needs GPU server for both TTS and ASR | `.nemo` checkpoint; NeMo + GPU realistically |
| Licence | Code Apache-2.0; weights Apache-2.0 (built on IndicF5 MIT, BigVGAN-v2 — observe NVIDIA terms); dataset CC-BY-4.0. Ethics note: voice is the author's, "do not impersonate" | Apache-2.0 (in the sushrota repo) | "observe base model's (AI4Bharat IndicConformer) licence" — no explicit licence file |
| Maturity | Production: shipped Bhāgavatam (~18k verses) audio app + MBTN 17.5 h. 465 GH stars, expert MOS ≈ 4.6, tech report/paper. Created Jun 2026 | Shipped demo, ~19 stars, research-grade | Shipped model + live tool; author says acoustic model "saturated" |
| Demo/API | HF Space https://prathoshap-vagdhenu-demo.hf.space (Gradio, ZeroGPU): **10 renders/IP/day, 1 śloka ≤100 akṣaras** (`src/limits.py`) — fine for trying, not for bulk. No hosted API | Live in-page demo (mic) | Live in-page dictation tool |
| Links | GH https://github.com/prathoshap/vagdhenu · weights https://huggingface.co/prathoshap/vagdhenu · data https://huggingface.co/datasets/prathoshap/vagdhenu-data · paper https://prathosh.in/vagdhenu/vagdhenu_paper.pdf | GH https://github.com/prathoshap/sushrota-sanskrit-asr | HF https://huggingface.co/prathoshap/sushrota-sanskrit-asr |

Root https://prathosh.in/ is Prof. Prathosh A P's (IISc ECE) homepage; the Sanskrit work is summarised at https://prathosh.in/sanskrit-ai.html. GitHub user is `prathoshap` (only these two relevant repos). Also relevant: his **VedaVaaNi** Vedic app (Play `com.vedic.chant`, App Store id6761655457) — Rig/Taittirīya with word-synced *human* recordings (Sringeri & Kanchi renditions), explicitly for "daily Sandhyavandanam and parayana". Not open source; audio not licensed for reuse.

**How we could use Vāgdhenu in the Vite/React static PWA (concretely):**
1. Rent a GPU for an hour (Colab/RunPod, T4 is enough), `bash scripts/setup.sh`, build a shard JSON of the laukika items (saṅkalpa prose with `meter: "gadya"`, dhyāna ślokas with `meter` auto/`anushtubh` etc.), `python src/render.py --shard …`, `ffmpeg` to mp3/opus, commit under `public/audio/`, play with `<audio>`. This is exactly how Bhāgavata-VāNi ships (offline audio bundle). Cost ≈ $1, zero runtime dependency.
2. Do **not** run it in-browser or call the HF Space from the app (quota, ZeroGPU cold-start 10–60 s).
3. Skip Vāgbodhinī/Su-śrotā for v1: they need a GPU server and cannot judge svaras, which is the thing that matters most in Sandhyavandanam.

---

### 2. Alternatives for Sanskrit/Vedic chant audio (ranked for this use-case)

| # | Option | Sanskrit? | Vedic svaras? | Notes / URL |
|---|---|---|---|---|
| 1 | **Human recordings you own/commission** (a vaidika chanting each step, consented, CC-BY or app-only licence) | yes | **yes** (only option that does) | Simplest, correct by construction. Split by mantra, ship mp3/opus. |
| 2 | **Existing recordings** — need licence check | yes | yes | archive.org has several Yajur Sandhyāvandanam sets (e.g. https://archive.org/details/YajurvedaSandhyavandanam_201703 — 29 mp3s split by section; https://archive.org/details/vedamu-sandhyAvandanam; https://archive.org/details/shree-vaishnava-sandhyaavandanam-yajur-vedam-audio-files) but **none carry a licence** (uploader copies) → not safe to redistribute. Veda Prasara Samithi full KYV chanting is Public-Domain-marked (https://archive.org/details/krishnayajurveda_202106) but is whole-Saṃhitā, would need cutting. IGNCA Vedic Heritage Portal (https://vedicheritage.gov.in) requires **written permission**. Wikimedia Commons has a couple of Gāyatrī clips (https://commons.wikimedia.org/wiki/Category:Hindu_mantra_recordings), CC but ad-hoc quality. Brahmavidya Foundation sells guru-śiṣya style Sandhyāvandanam audio (donation-gated, no redistribution). |
| 3 | **Vāgdhenu** (above) | yes, excellent phonology | **no** | Best for laukika ślokas/prose only. |
| 4 | **AI4Bharat Indic Parler-TTS** https://huggingface.co/ai4bharat/indic-parler-tts | official Sanskrit voice "Aryan" (~20 h data) | no | Apache-2.0, ~880M, GPU or slow CPU; read-aloud, not chant. Fine fallback for prose. IndicF5 (its sibling) has no Sanskrit. AI4Bharat Indic-TTS (FastPitch) has 13 langs, **no Sanskrit**. |
| 5 | **kenpath/svara-tts-v1** https://huggingface.co/kenpath/svara-tts-v1 | Sanskrit listed (19 langs) | no (name is misleading) | Apache-2.0, Orpheus-style, GGUF/CPU-friendly. Untested quality. |
| 6 | Orpheus fine-tunes on IIT-M IndicTTS Sanskrit (R910/Sanskrit_TTS_v2, rverma0631/Sanskrit_TTS) | yes | no | Hobby-grade, 3B LLaMA-based, GPU. |
| 7 | **facebook/mms-tts** (VITS, 1100 langs) | `san` exists | no | **CC-BY-NC** → not for a shipped app unless non-commercial and you accept the terms; quality poor for Sanskrit. |
| 8 | **Sarvam Bulbul v3** https://docs.sarvam.ai/api/getting-started/models | **no** (11 langs; Sanskrit only in their STT) | no | Workaround = feed Kannada-transliterated text to kn-IN voice. |
| 9 | **Google Cloud / Azure TTS** | **no Sanskrit voice** (Azure confirmed none; Google none) | no | Same Kannada-voice workaround (used by https://github.com/avinashvarna/sanskrit_tts, which also wraps Bhashini). Paid, online. |
| 10 | **Browser Web Speech API** `hi-IN` voice | Devanāgarī reads with Hindi schwa deletion ("rāma"→"rām") | no | Zero-cost, but wrong pronunciation for Sanskrit and voice availability varies per OS/browser; only acceptable as an accessibility fallback, not as "correct pronunciation". |

Research on svara-aware synthesis exists only as accent *restoration* in text (e.g. https://aclanthology.org/2025.bhasha-1.11/), not audio.

---

### 3. Recommendation

**(a) v1 — feasible now, with human audio, not TTS.**
- Ship pre-recorded mp3/opus per Sandhyavandanam step under `public/audio/`, one `<audio>` (or a tiny play button) per step; add a "chant along / loop" toggle if wanted. No model, no server, works offline in the PWA.
- Source: record a qualified vaidika (or yourself) with explicit reuse consent — this is the only route that gives correct udātta/anudātta/svarita and a clean licence. If you'd rather reuse existing audio, ask the uploader/organisation for permission first (none of the archive.org Sandhyāvandanam sets are licensed).
- Optional add-on (cheap): pre-generate the *laukika* pieces (saṅkalpa, dhyāna ślokas, ācamana) with Vāgdhenu offline on a rented GPU and ship them alongside — good quality, Apache-2.0, ~$1. Keep them clearly labelled "synthesised" and don't mix voices within one mantra.

**(b) Defer.**
- Any AI chant for the Vedic (svara-marked) mantras — no tool can do it today; revisit if a svara-aware model appears (watch prathoshap's work; his own Vedic app still uses humans).
- Pronunciation scoring (Vāgbodhinī/Su-śrotā): needs GPU backend, laukika-only, svara-blind. Possible v2 if you add a server.
- Runtime TTS in-browser (Web Speech hi-IN): only as an accessibility fallback, never as the "correct pronunciation" reference.