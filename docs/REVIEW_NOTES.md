# Content review notes — open items for a knowledgeable reviewer (paṇḍita / vādhyār)

Status 2026-08-17: content v0.2.0 authored from the five source texts and machine-cross-checked (≈25 mantras verified word-by-word against Kidambi / sandhya.pdf; svaras unified). Nothing is marked `verified: true` yet. Please check these first:

1. **surya-upasthanam, morning nyāsa** — Kidambi prints `bhīruḍh gāyatrī triṣṭup chandāṃsi` (Devanagari भीरुढ्). Almost certainly a misprint (perhaps *bhurig gāyatrī*); no other source has this nyāsa. Kept as printed.
2. **surya-upasthanam, evening nyāsa** — Kidambi gives `savitā devatā` for the Varuṇa hymns (*imaṃ me varuṇa…*); *varuṇo devatā* would be expected. Kept per source.
3. **narmada-vandanam** — Kaalai's `jaratkārvor … mahāyaśaḥ` kept; classical `jaratkāror … mahāyaśāḥ` given as a note.
4. **samapti** — `viśvā̎ni deva savitar duri̱tāni` (RV 5.82.5 vocative); sandhya.pdf prints *savitur*, Kaalai *savita*.
5. **pranayama-nyasam, Muktāvidruma dhyānam** — `varadābhayāṃ kuśakaśaṃ` (Kidambi) vs `varadābhayāṅkuśakaśāṃ` (Kaalai).
6. **Sandhi rendering** — `bhuva̱s suva̍ḥ`, `va̍ś śi̱vata̍mo̱`, `śa̱rada̍ś śa̱taṃ` are written with a space (Devanagari `…श् श…`); many printed texts join them (`…श्श…`) or use visarga. Convention question, not a reading question.
7. **Facing** — app follows Kidambi/Chakravarthy (east; evening west from arghya onward). sandhya.pdf (E/N/W) and the Mumbai Smārta text (mostly N in evening) differ; alternatives noted only in the ācamanam intro.
8. **Prāśana svaras** — follow sandhya.pdf + Kidambi (which agree); the earlier seed had a more heavily accented reading from an unknown edition.
9. **Sandhyādi devatā list** — `devebhyo / ṛṣibhyo / munibhyo / gurubhyo / pitṛbhyo namaḥ` deliberately not included (absent from all five sources) — add if your tradition recites them.
10. **Aṣṭākṣara mantra text** — not printed (upadeśa mantra); a note tells the user to recite as imparted.
11. **Illustrations** — generated line-art; the character wears an ūrdhva-puṇḍra. Finger positions (prāṇāyāma, brāhma-tīrtha, deva-tīrtha) need a human check; a Smārta (vibhūti) variant is pending.

How to correct: edit `app/src/content/parts/*.json` (IAST only), run `pnpm xlit && pnpm test`, open a PR. See `docs/CONTENT_GUIDE.md`.
