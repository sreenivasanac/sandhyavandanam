# Source analysis — reference PDFs & videos

Generated 2026-08-17 from the five PDFs in `pdfs/` (text dumps in `extracted/`) and two YouTube videos (auto-captions in `transcripts/`).

## Videos

| ID | Title | Channel | Captions |
|---|---|---|---|
| yNXz54qLoIM | Sandhyavandanam — See, Learn And Perform (Yajur–Smartha) | Soulful Mantra | Kannada auto-captions of the chant itself (usable to check step order, not as mantra text) |
| srMGBBFV9aY | [Part 1] Meaning of Sandhyavandanam Mantras (English) — Sri Lalith Gannavaram | Sringeri Gurubandhava | English auto-captions of a lecture on meanings; large `[Music]/foreign` gaps |

## PDFs

### 1. `sandhya.pdf` (29 pp) — "Kṛṣṇa & Śukla Yajur Veda Sandhyā Vandana", Pandit Sri Rama, srimatham.com, 2015
- **Target**: three variants — (A) Kṛṣṇa Yajur (Smārta + Vaiṣṇava, boxed verses skipped by Vaiṣṇavas) pp 3–16; (B) Śukla Yajur pp 17–23; (C) Pauranika/Agamic "for all Hindus" pp 24–29. All three kālas via inline alternatives.
- **Scripts**: Roman IAST only (svara marks on some). **Meanings**: English after every mantra. Bullet instructions, no photos.
- **Extraction**: excellent — born-digital Unicode IAST. **Best raw mantra text + meanings.**
- Steps (Kṛṣṇa Yajur): Ācamanam · Aṅga-nyāsa (Keśavādi 12) · Vighna-apaharaṇam · Prāṇāyāma · Saṅkalpa (Smārta & Vaiṣṇava) · Prokṣaṇam · Prāśanam (M/N/E) · Punar-mārjanam · Arghya ×3 · Prāyaścitta arghyam · Brahma-bhāvanam · Tarpaṇam (9 + 12) · Gāyatrī japam (āsana, saṅkalpa, nyāsa, āvāhanam, dhyānam M/N/E, japa 108/28/10) · Gāyatrī upasthānam · Sūrya upasthānam (M/N/E) · Samaṣṭi-abhivādanam · Abhivādanam · Dig-devatā vandanam · Yama · Śiva prārthanā · Sūrya-Nārāyaṇa vandanam · Abhivādanam · Samarpaṇam · Samāpti.
- Personalised: abhivādanam blanks (pravara ṛṣis, gotra, sūtra, śākhā, name). No tithi/nakṣatra.

### 2. `sandhyaavandanam.pdf` (117 pp) — "Yajurveda Kālatraya Sandhyāvandanam", Sunder Kidambi, prapatti.com, 2007
- **Target**: Kṛṣṇa Yajur, **Śrī Vaiṣṇava (Iyengar) Āpastamba**. All three kālas fully written out (M pp19–49, N pp51–82, E pp83–113) + gotra/pravara & veda/sūtra tables pp115–117.
- **Scripts**: Devanagari (LaTeX devnag, svaras) + IAST side by side. No translations. Detailed **action | mantra** tables, nyāsa steps, posture **photographs**. Watermarked.
- **Extraction**: mixed — IAST fragmented by LaTeX diacritics; Devanagari garbage via pdftotext. LaTeX source likely at prapatti.com.
- 21 numbered steps identical across kālas: Ācamanam · Prāṇāyāmam · Saṅkalpam · Sātvika tyāgam · Prokṣaṇam · Prāśanam · Punaḥ prokṣaṇam · Arghya · Prāyaścitta arghyam · Keśavādi tarpaṇam (12 only, no navagraha) · Japasthala prokṣaṇam + āsana · Nyāsam · Gāyatrī āvāhanam · Gāyatrī japam · Aṣṭākṣara japam · Gāyatrī udvāsanam · Upasthānam · Sandhyādi devatā vandanam · Abhivādanam · Dik vandanam · Sātvika tyāgam close.
- **Best structural skeleton** (per-step ṛṣi/chandas/devatā, action per mantra, all 3 kālas).

### 3. `Sandhyavandanam.pdf` (26 pp) — anonymous, "Smārthas of Āpastamba sūtram", proof-read by Mumbai vādhyārs
- Kṛṣṇa Yajur Smārta. Morning in full; N/E as inline variants. Devanagari (legacy font — unusable) + Roman (ITRANS-ish). No meanings/images. Direction line before every step.
- Notable: japa count **108 M / 32 N / 64 E**; Part I sandhyā, Part II Gāyatrī japa; Viśvarūpa prārthanā; worked abhivādanam example.

### 4. `Yajurveda_Kaalai_Sandhyaavandanam.pdf` (14 pp) — Sushil Narayanan et al., Bangalore, 2020
- Kṛṣṇa Yajur **Smārta Āpastamba, morning only**. Devanagari + **Tamil** + plain Roman for every mantra. One-line procedure per step. Appendix: gotra→pravara table (20 gotras) in 3 scripts.
- Extraction: Roman excellent; Devanagari/Tamil lose vowel signs — re-transliterate from Roman instead.
- Extras: Bhūmi prārthanā, Narmadā-sarpa vandanam, Harihara vandanam.

### 5. `Yajurveda-Sandhyavandanam.pdf` (46 pp) — Kaustubha Chakravarthy, Bangalore, 2010, "detailed procedure with illustrations v4.0"
- Kṛṣṇa Yajur, Smārta saṅkalpa primary with Vaiṣṇava alternatives (Sātvika tyāga, aṣṭākṣara for Ahobila Mutt, Śrīraṅga maṅgala). Roman ITRANS. English **meaning after almost every step**, long theory front-matter (pramāṇa, timings, exceptions, mānasika snānam), many **photographs** of postures/mudrās. N/E upasthānam only as images.

## Variant matrix

| Varies by **time of day** | Varies by **tradition** |
|---|---|
| Facing direction (E / E-or-N / W after arghyam) | Saṅkalpa: Smārta "mamopātta-samasta-duritakṣaya-dvārā śrī-parameśvara-prītyartham" vs Vaiṣṇava "śrī bhagavad-ājñayā śrīman-nārāyaṇa-prītyartham" |
| Saṅkalpa word prātaḥ / mādhyāhnika / sāyaṃ | Sātvika tyāgam (Vaiṣṇava, open & close) |
| Prāśanam mantra: Sūryaśca / Āpaḥ punantu / Agniśca (+ nyāsa) | Tarpaṇam: Navagraha 9 + Keśavādi 12 vs Keśavādi 12 only |
| Arghya count 3 / 1–2 / 3; prāyaścitta arghyam optional at noon | Aṣṭākṣara japam (Vaiṣṇava, if samāśrayaṇam) |
| Gāyatrī kāla-dhyānam: Prātardhyāyāmi / Madhyandine / Sāyaṃ sarasvatīṃ | Yama, Śiva/Viśvarūpa (Ṛtaguṁ satyam), Sūrya-Nārāyaṇa, Narmadā-sarpa, Bhūmi prārthanā — Smārta extras |
| Japa count (108/28/10; one source 108/32/64), hand height, stand vs sit | Dik vandanam tail: viṣṇave only vs +brahmaṇe/rudrāya/yamāya |
| Upasthānam: Mitrasya… / Ā satyena…Ya udagān / Imam me varuṇa… | Śrīraṅga maṅgalamaṇim, Śrī kṛṣṇāya namaḥ ×10 (Vaiṣṇava) |
| Sandhyādi-devatā & dik order starts W in evening | Śukla Yajur = different ācamanam, prokṣaṇa extras, mudrās |

**Personalisation across all sources**: only abhivādanam (pravara ṛṣis + trayārṣeya/pañcārṣeya, gotra, sūtra, śākhā/veda, name) and japa-count choice. None puts tithi/nakṣatra/date in the nitya sandhyā saṅkalpa.

## Data-source plan
- Skeleton: Kidambi's 21 steps × 3 kālas.
- Mantra text (IAST) + English meanings + Smārta/Vaiṣṇava pairs + M/N/E variants: `sandhya.pdf`.
- Meanings/procedure notes secondary: `Yajurveda-Sandhyavandanam.pdf`.
- Devanagari/Tamil/Kannada/Telugu: generate from IAST via a transliterator (`@indic-transliteration/sanscript`), not from PDF scraping.

## Proposed unified step list (superset; tag each with time/tradition/optional)
1. Ācamanam (achyuta/ananta/govinda + Keśavādi 12 aṅga-sparśa)
2. Gaṇapati dhyānam / Vighna-apaharaṇam
3. Prāṇāyāmam
4. Saṅkalpam (Smārta | Vaiṣṇava; prātaḥ | mādhyāhnika | sāyaṃ)
5. Sātvika tyāgam [Vaiṣṇava]
6. Tilakam [optional]
7. Prokṣaṇam / Mārjanam
8. Prāśanam (Sūryaśca | Āpaḥ punantu | Agniśca) → Ācamanam
9. Punaḥ prokṣaṇam
10. Arghya pradānam
11. Prāyaścitta arghyam
12. Ātma-pradakṣiṇam + Sandhyopāsanam (Asāvādityo brahma)
13. Ācamanam
14. Tarpaṇam (Navagraha [Smārta] + Keśavādi) → Ācamanam
15. Japasthala prokṣaṇam + Bhūmi prārthanā [opt] + Āsana mantra
16. Gaṇapati / Prāṇāyāmam (Uttarāṅgam start) [some sources]
17. Gāyatrī japa saṅkalpam (108/28/10)
18. Prāṇāyāma-mantra nyāsam + Muktāvidruma dhyānam + Omāpo jyotī + Arkamaṇḍala
19. Gāyatrī āvāhanam
20. Kāla-dhyānam + Yo devassavitā
21. Gāyatrī japa nyāsam + japam
22. Aṣṭākṣara japam [Vaiṣṇava]
23. Gāyatrī udvāsanam / upasthānam saṅkalpa (Uttame śikhare)
24. Sūrya upasthānam (M/N/E)
25. Sandhyādi devatā vandanam / Samaṣṭi-abhivādanam
26. Abhivādanam (personalised)
27. Dik-devatā vandanam
28. Yama vandanam [Smārta]
29. Śiva/Viśvarūpa/Harihara prārthanā [Smārta]
30. Narmadā-sarpa vandanam [Smārta, rare]
31. Sūrya-Nārāyaṇa vandanam
32. Abhivādanam (repeat) + Ācamanam
33. Samarpaṇam (Kāyena vācā; Śrīraṅga maṅgala / Sātvika tyāgam close [Vaiṣṇava])
34. Samāpti / Japasthāna prokṣaṇam → Ācamanam
