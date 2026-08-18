# Sandhyāvandanam app — requirements (v1)

Decisions from 2026-08-17 kickoff. Edit freely; this is the source of truth for scope.

## Goal
Help practitioners perform Sandhyāvandanam correctly: what to do at each step, the mantra (Sanskrit text in the user's preferred script + optional transliteration), and its meaning.

## Scope (v1)
- **Tradition**: Kṛṣṇa Yajur Veda — Smārta and Śrī Vaiṣṇava variants (Āpastamba). Data model tags every step/mantra with `tradition`, `time`, `optional` so Śukla Yajur / Rig / Sāma / Mādhva can be added later.
- **Kālas**: prātaḥ, mādhyāhnika, sāyaṃ — all three.
- **Modes**: *Perform* (guided, one step per screen, big type, Next/Prev, keep-screen-awake) and *Read* (full scroll for study/reference).
- **Per step**: action/instruction, mantra, meaning, and an illustration where useful — flat line-art stills generated with Nano Banana Pro from one style anchor (see `docs/reference/tools/IMAGES.md`); video deferred; photos of a real practitioner preferred for v2.
- **Scripts**: mantras authored once in IAST with Vedic svaras; Devanagari/Tamil (superscript-numeral style)/Kannada/Telugu/Malayalam pre-rendered at build time with Python `aksharamukha` (`pnpm xlit`); runtime `sanscript` only for user-typed names/gotra. Fonts: Noto Serif Devanagari/Kannada/Telugu/Malayalam (fontsource) + full Noto Serif Tamil TTF self-hosted (subset strips accents). See `docs/reference/tools/INDIC_RENDERING.md`.
- **Meaning**: English v1, shown by default with toggle off. Tamil/Hindi later (i18n-ready keys).
- **Personalisation (onboarding + settings)**: name, gotra (→ pravara auto-filled from table), sūtra, veda/śākhā, tradition, preferred script, meaning on/off, japa count.
- **Sankalpam**: optional detailed block (off by default, since sources omit it in nitya sandhyā): saṃvatsara, ayana, ṛtu, māsa (solar/Tamil or lunar/Kannada-Telugu convention), pakṣa, tithi, vāra, nakṣatra computed at local sunrise with `astronomy-engine` (own ~80-line implementation, Lahiri ayanāṃśa; `mhah-panchang` rejected after testing). Location via geolocation or manual lat/lon; preview shown in settings for the user to verify against their panchāṅgam. Janma-nakṣatra collected in onboarding.
- **Audio (chant/pronunciation)**: research in `docs/reference/tools/CHANT_AUDIO.md`. No TTS handles Vedic svaras; Vāgdhenu (Apache-2.0, prathosh.in) is excellent for laukika ślokas/prose only and needs a GPU to pre-render. Plan: per-mantra `audio` slot exists now; v1.x ships human-recorded clips (own/consented) + optionally Vāgdhenu-rendered laukika parts, labelled. Deferred: svara-aware TTS, pronunciation scoring (Vāgbodhinī needs a GPU server).
- **Accounts**: none. Settings in localStorage; export/import as JSON.
- **Platform**: responsive web (desktop + mobile browsers), installable PWA (offline). Native iOS/Android later via Capacitor wrapping the same build.

## Tech
- Vite + React + TypeScript + Tailwind; PWA via `vite-plugin-pwa`.
- Content: `app/src/content/sandhya.json` (see `docs/CONTENT_GUIDE.md`), zod-validated at load; `node --test` for logic.
- Panchanga: `astronomy-engine` + own logic (`app/src/lib/panchanga.ts`, tested against known dates).
- No backend. Public GitHub repo `sreenivasanac/sandhyavandanam`. Deployment deferred.

## Design
Warm traditional-modern: cream / saffron / deep-red palette, large readable Indic type, light + dark mode, high contrast (phone-on-floor at dawn/dusk). Accessibility basics (font scaling, contrast, keyboard nav).

## Open questions
- Link to the "Sanskrit chant / shloka" reference project mentioned at kickoff (not received).
- Which sankalpam fields to show given sources omit them in nitya sandhyā — show as an optional "detailed sankalpam" block?
- Content verification: who reviews mantra text/meanings before public release?
- Domain / hosting when ready.
