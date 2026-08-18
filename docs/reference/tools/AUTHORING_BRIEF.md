# Content-authoring brief (shared by all authoring agents)

Repo: /Users/sreenivasanac/SoftwareProjects/sandhyavandanam
Read first (in this order):
1. docs/CONTENT_GUIDE.md — schema, IAST conventions, placeholders.
2. app/src/content/schema.ts — the zod schema (your JSON must validate).
3. app/src/content/sandhya.json — the SEED (style example; you will replace/extend the steps assigned to you; keep existing step `id`s and `image` fields where they exist).
4. docs/reference/source-analysis.md — variant matrix + unified 34-step list with per-source page refs.
5. Clean sources in docs/reference/clean/:
   - sandhya.md (Pandit Sri Rama; Kṛṣṇa Yajur Smārta+Vaiṣṇava; IAST with svaras + English meanings) — PRIMARY for mantra text (IAST) and meanings.
   - sandhyaavandanam.md (Kidambi; Śrī Vaiṣṇava; all 3 kālas fully; IAST WITH svaras reconstructed; per-step nyāsa (ṛṣi/chandas/devatā), actions) — PRIMARY for step structure, kāla variants, Vaiṣṇava text, nyāsa details.
   - Yajurveda-Sandhyavandanam.md (Chakravarthy; ITRANS + English meanings + procedure detail) — SECONDARY for meanings and instructions.
   - Sandhyavandanam.md (Smārta Āpastamba; ITRANS + OCR Devanagari) and Yajurveda_Kaalai_Sandhyaavandanam.md (Smārta, morning; Roman + Tamil/Devanagari OCR) — for Smārta-only extras and cross-checks.
   Also docs/reference/tools/EXTRACTION_NOTES.md for known extraction slips.

Rules
- Output ONLY IAST in `text.iast` (no devanagari/tamil fields — a build script generates them). Use standard IAST + Vedic svara combining marks (anudātta U+0331 ̱, svarita U+030D ̍, dīrgha-svarita U+030E ̎) copied from sandhya.md / Kidambi. Yajur nasal: `guṃ` (e.g. `oguṃ`, `āyūguṃṣi`). If a source only has ITRANS, convert to IAST carefully.
- DEDUPE across sources: one canonical text per mantra; where sources differ materially, prefer sandhya.md/Kidambi wording and add a `note` item ("Some texts read …") only if the difference is a real variant, not a typo.
- Tag variants: `kala:["pratah"|"madhyahnika"|"sayam"]`, `tradition:["smarta"|"srivaishnava"]`, `optional:true`. A step or item with no tag applies to all. Kāla-specific mantras = separate items. Nothing that is Smārta-only may be untagged if Vaiṣṇavas skip it (see the variant matrix: Yama/Śiva/Sūrya-Nārāyaṇa/Narmadā vandanam, navagraha tarpaṇam, dik tail etc.), and Vaiṣṇava-only parts (sātvika tyāgam, aṣṭākṣara, Śrīraṅga maṅgala, Śrī kṛṣṇāya namaḥ ×10) must be tagged srivaishnava.
- Every step: `id` (kebab), `title.sa` (IAST with diacritics), `title.en`, `section`, `intro` (what to do — concise, imperative, include hand/posture/direction details from Kidambi/Chakravarthy), `items`, `sources` (["sandhya.pdf p5","Kidambi p23–24", …] use the clean md page numbers).
- Every mantra item: `text.iast`, `meaning` (English, from sandhya.md/Chakravarthy; write your own faithful short one if none), `action` where there is a physical action, `repeat` where counted, and nyāsa lines (ṛṣi/chandas/devatā/viniyoga) as their own mantra items with action e.g. "touch head / nose / heart".
- Placeholders: `{name} {gotra} {pravara} {arsheya} {sutra} {kala} {kalaEn} {panchanga}` (see guide). Japa count: write the saṅkalpa with `{japaCount}` and add a note listing conventional counts (108 / 28 / 10; one Smārta source gives 108/32/64).
- Do NOT invent mantras. If unsure of a reading, keep the source reading and add `"verified": false` is implicit — do not add `verified:true` anywhere.
- Prose: English, no markdown except *italic*.
- Write your steps as a JSON ARRAY (top-level `[ Step, … ]`) to the file named in your task; validate it is well-formed JSON. Keep it faithful and complete rather than short: this is the actual ritual text; missing a mantra is worse than a long file.
- Finish by returning: list of step ids written, any readings you were unsure about, and anything you deliberately left out and why.
