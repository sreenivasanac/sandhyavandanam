# Sandhyāvandanam app — requirements (v1)

Decisions from 2026-08-17 kickoff. Edit freely; this is the source of truth for scope.

## Goal
Help practitioners perform Sandhyāvandanam correctly: what to do at each step, the mantra (Sanskrit text in the user's preferred script + optional transliteration), and its meaning.

## Scope (v1)
- **Tradition**: Kṛṣṇa Yajur Veda — Smārta and Śrī Vaiṣṇava variants (Āpastamba). Data model tags every step/mantra with `tradition`, `time`, `optional` so Śukla Yajur / Rig / Sāma / Mādhva can be added later.
- **Kālas**: prātaḥ, mādhyāhnika, sāyaṃ — all three.
- **Modes**: *Perform* (guided, one step per screen, big type, Next/Prev, keep-screen-awake) and *Read* (full scroll for study/reference).
- **Per step**: action/instruction (text; images where useful), mantra, meaning.
- **Scripts**: mantras stored once (Devanagari/IAST); rendered on the fly into Devanagari (default), Tamil, Kannada, Telugu, IAST via `@indic-transliteration/sanscript`. Transliteration line toggle (IAST default; simple-Roman option).
- **Meaning**: English v1, shown by default with toggle off. Tamil/Hindi later (i18n-ready keys).
- **Personalisation (onboarding + settings)**: name, gotra (→ pravara auto-filled from table), sūtra, veda/śākhā, tradition, preferred script, meaning on/off, japa count.
- **Sankalpam**: auto-compute panchanga fields (saṃvatsara, ayana, ṛtu, māsa, pakṣa, tithi, vāra, nakṣatra) from device date + location (geolocation or manual city/lat-long in settings). If computation for a field is unreliable, fall back to user input stored in settings. User's janma-nakṣatra collected in onboarding.
- **Audio**: none in v1 (data model leaves an `audio` slot per mantra).
- **Accounts**: none. Settings in localStorage; export/import as JSON.
- **Platform**: responsive web (desktop + mobile browsers), installable PWA (offline). Native iOS/Android later via Capacitor wrapping the same build.

## Tech
- Vite + React + TypeScript + Tailwind; PWA via `vite-plugin-pwa`.
- Content: static JSON/TS files in repo (`src/content/`), validated by a schema (zod) + tests.
- Panchanga: `mhah-panchang` (evaluate accuracy; fallback to manual settings).
- No backend. Public GitHub repo `sreenivasanac/sandhyavandanam`. Deployment deferred.

## Design
Warm traditional-modern: cream / saffron / deep-red palette, large readable Indic type, light + dark mode, high contrast (phone-on-floor at dawn/dusk). Accessibility basics (font scaling, contrast, keyboard nav).

## Open questions
- Link to the "Sanskrit chant / shloka" reference project mentioned at kickoff (not received).
- Which sankalpam fields to show given sources omit them in nitya sandhyā — show as an optional "detailed sankalpam" block?
- Content verification: who reviews mantra text/meanings before public release?
- Domain / hosting when ready.
