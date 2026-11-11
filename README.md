# Sandhyāvandanam

A web app (PWA; native later via Capacitor) that guides practitioners through Sandhyāvandanam — step-by-step actions, mantras in the script of your choice with transliteration, and meanings.

**Live**: https://sandhya.pragnyalabs.com

**Status**: alpha — full Kṛṣṇa Yajur Smārta + Śrī Vaiṣṇava sandhyā for all three kālas, chant clips for the non-Vedic lines; mantra text still awaits review by a knowledgeable person (`docs/REVIEW_NOTES.md`). See [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) for scope/decisions and [docs/reference/source-analysis.md](docs/reference/source-analysis.md) for the analysis of source texts.

## Layout
- `app/` — the PWA (Vite + React + TS + Tailwind). `pnpm dev | build | test | xlit`.
- `docs/CONTENT_GUIDE.md` — how mantras/steps are authored; `docs/REVIEW_NOTES.md` — open items for a knowledgeable reviewer.
- `docs/REQUIREMENTS.md` — product/tech decisions.
- `docs/reference/pdfs/` — source procedure texts (Kṛṣṇa Yajur Smārta & Śrī Vaiṣṇava; Śukla Yajur).
- `docs/reference/extracted/` — `pdftotext` dumps of the above.
- `docs/reference/transcripts/` — YouTube auto-captions + fetch script.

## Sources
- Pandit Sri Rama, *Kṛṣṇa & Śukla Yajur Veda Sandhyā Vandana* (srimatham.com, 2015)
- Sunder Kidambi, *Yajurveda Kālatraya Sandhyāvandanam* (prapatti.com, 2007)
- Sushil Narayanan et al., *Yajurveda Kaalai Sandhyaavandanam* (2020)
- Kaustubha Chakravarthy, *Yajurveda Sandhyavandanam – detailed procedure with illustrations* (2010)
- Anonymous, *Sandhyavandanam (Smārta, Āpastamba)*
- Videos: Soulful Mantra — *See, Learn And Perform Sandhyavandanam (Yajur–Smartha)*; Sringeri Gurubandhava — *Meaning of Sandhyavandanam Mantras* (Lalith Gannavaram)

## Deployment
Static build served by nginx on the pragnyalabs Hetzner server (`/var/www/sandhya`, HTTPS via Let's Encrypt; wildcard DNS for `*.pragnyalabs.com`).

```bash
cd app && pnpm deploy   # test, build, rsync dist/ to the server (needs the `hetzner-agent` SSH host)
```

The site was created once with `ssh hetzner-agent 'sudo new-site sandhya /var/www/sandhya'`; redeploys only replace the files.
