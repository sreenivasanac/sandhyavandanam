# Clean-text extraction notes

Regenerate with `uv run docs/reference/tools/extract.py` (needs `brew install tesseract tesseract-lang`
for the `san`, `hin`, `tam`, `eng` models). Output: `docs/reference/clean/<pdf>.md`, one `## Page N`
section per PDF page (the Kaalai booklet is split into left/right halves = physical pages).

Common pipeline: pymupdf `rawdict` for the text layer → atoms with bboxes; anything set in a legacy /
broken-CMap Indic font is cropped from a 400 dpi render and OCR'd line by line with tesseract
(`--psm 7`, fallback `--psm 6`); wide embedded images are OCR'd as blocks (300 dpi, `san+hin+eng`);
atoms are re-flowed into visual lines (top→bottom, left→right). Tesseract `san`/`hin` models do
**not** emit Vedic svara marks reliably, so OCR'd Devanagari is largely svara-less.

| PDF | Method | Devanagari | Roman | Tamil |
|---|---|---|---|---|
| sandhya.pdf | text layer only | – | Unicode IAST **with svaras** (as in PDF) | – |
| sandhyaavandanam.pdf (Kidambi) | text layer + accent folding + line OCR | OCR (Wikner skt font) | IAST rebuilt, **svaras recovered** | – |
| Sandhyavandanam.pdf (26 pp) | text layer + line OCR | OCR (BRH + Mangal) | ITRANS from text layer | – |
| Yajurveda_Kaalai_Sandhyaavandanam.pdf | text layer + line OCR | OCR | plain Roman from text layer | OCR |
| Yajurveda-Sandhyavandanam.pdf | text layer + image OCR | OCR of pasted images | ITRANS from text layer | – |

## sandhya.pdf (srimatham, 29 pp)
- Method: text layer. Nothing OCR'd except the cover picture (dropped as junk).
- Spot check: Gāyatrī / Āpo hiṣṭhā (`āpo̱ hiṣṭho ma̍yo̱ bhuva̱ḥ | tā na̍ ū̱rje da̍dhātana`) / Keśavādi
  (`oṃ keśavāya namaḥ`) all exact, svara marks (U+0331 / U+030D) preserved.
- Unreadable: nothing. Bullets come through as `!`/`•` (Wingdings). Best mantra source.

## sandhyaavandanam.pdf (Kidambi, prapatti.com, 117 pp)
- Source hunt: prapatti.com only serves this PDF (`/slokas/sanskrit/sandhyaavandanam.pdf` and
  `/slokas/english/…` are the same 3.2 MB file; tamil/kannada/telugu/.tex/.zip variants 404; the
  site's HTML directory listing is 403). No LaTeX source found → nothing saved under `sources/`.
- Devanagari is Charles Wikner's `skt` LaTeX font (glyph codes are half-forms + stems, not
  decodable without the ligature tables) → OCR per line. Danda glyph (gid 102) is zero-width and
  mapped to U+FFFD, so it is recovered from `get_texttrace()`.
- IAST: CM italic with TeX-style split accents (`¯a`, `´s`, lowered `.`) folded back; the udātta
  tick (a small Helvetica-Oblique `ı` placed above the vowel) becomes U+0301, two ticks U+030E,
  the anudātta underline (a 1×1 inline image stretched to ~5 pt) becomes U+0331. Kern-only
  spaces are dropped by geometry. Rotated "prapatti dot com" watermark filtered by line direction.
- Spot check (p26/p40/p20): `sūryaśca mā manyuśca manyupatayaśca manyú kṛte̱bhyaḥ ।` ✔;
  `oṃ । bhūrbhuva̱ssuváḥ । tatsávi̱turvareṇíyaṃ । bhargó de̱vasyá dhīmahi । dhiyo̱ yo náḥ praco̱daya̎̄t ॥` ✔;
  `āpo̱ hiṣṭhā máyo̱ bhuváḥ` ✔; `oṃ keśavāya namaḥ` ✔ (Devanagari OCR: `ओ केशवाय नमः` – anusvāra
  on ओं sometimes lost).
- Remaining issues: OCR'd Devanagari has typical tesseract slips (भ→म, ष→ष्, missing ं) and no
  svaras — always prefer the IAST line next to it. Table cells interleave (Action | Mantra) as in
  pdftotext. `′` = avagraha. Section headings carry the decorative `⋆⋆⋆⋆⋆N ⋆⋆⋆⋆⋆`.

## Sandhyavandanam.pdf (Mumbai vādhyārs, 26 pp)
- Fonts: `BRHDevanagari`/`BRHDevanagariExtra` (Baraha legacy 8-bit) for bold words and
  `Mangal-Regular` with a broken ToUnicode (all mātrās dropped) for the rest → whole Devanagari
  runs OCR'd (`san+hin`, 400 dpi grey; 300 dpi was noticeably worse for this font). Roman ITRANS
  and English come from the text layer.
- Spot check: `सूर्यश्च मा मन्युश्च मन्युपतयश्च मन्युकृतेभ्यः । पापेभ्यो रक्षन्ताम्‌ …` ✔;
  `ओं भूर्भुवः सुवः । ओं तत्सवितुवरिण्यं भर्गो देवस्य धीमहि …` (OCR slip in वरेण्यं);
  `ओं श्री केशवाय नम : ।` ✔ (visarga spacing).
- Remaining: svaras (the PDF has them) are lost; occasional OCR slips; the ITRANS line beside each
  mantra is reliable and should be preferred.

## Yajurveda_Kaalai_Sandhyaavandanam.pdf (Bangalore 2020, 14 sheets = 28 pages)
- CID fonts F4 (Devanagari) / F5 (Tamil) have broken CMaps (Tamil maps into Greek Extended) →
  OCR (`san+hin` / `tam`) per line. Roman/English from text layer. Landscape sheets are split at
  the gutter into `(left half)` / `(right half)`.
- Spot check: Tamil `ஓம்‌ பூர்புவஸ்ஸுவ:|| தத்ஸவிதுர்வரேண்யம்‌| பர்க்கோ தேவஸ்ய தீமஹீ்‌ தியோ யோ ந:
  ப்ரசோதயாத்‌||` ✔; Devanagari `ओं भूर्भुवस्सुवः॥ तथ्सवितुर्वरण्यं। भर्गो देवस्य धीमहि।` (one slip);
  Keśavādi tarpaṇam list ✔; `ஆபோ ஹிஷ்டா மயோபுவ।|` ✔.
- Remaining: Tamil OCR is very good; Devanagari OCR has occasional slips; the plain-Roman line is
  authoritative. Gotra/pravara appendix table extracts row by row (three scripts).

## Yajurveda-Sandhyavandanam.pdf (Chakravarthy 2010, 46 pp)
- Text layer (ITRANS + English) is clean. Beyond pp 40–41, ~26 pasted images across pp 13–45
  contain the Devanagari mantras with svaras plus English notes; every image wider than 250 pt is
  OCR'd and kept if it yields ≥12 Devanagari chars or ≥8 words (posture photos are dropped).
  OCR blocks are marked `[image]`.
- Spot check: p20 `सूर्यश्च मा मन्युश्च मन्युपतयश्च मन्युकृतेभ्यः। पापेभ्यो रक्षन्ताम्‌ ।` ✔;
  p40 `आ सत्येन रजसा वर्तमानो निवेशयन्नमृतं मर्त्यं च।` ✔ (later lines have slips);
  p35 `आयातु वरदा देवी अक्षरं ब्रह्मसंमितम्‌ …` ✔.
- Remaining: the source images are ~180 dpi and svara ticks sit on their own rows, so OCR lines
  are interspersed with tick-noise fragments (`~ ज्यो = ~`) and some words are mangled; svaras
  lost. Use these only to confirm the ITRANS text / step order.
