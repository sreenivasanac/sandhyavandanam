# Content review notes — open items for a knowledgeable reviewer (paṇḍita / vādhyār)

Status 2026-08-18: content v0.2.x authored from the five source texts and machine-cross-checked; **rule applied: Kidambi wins conflicts, then Chakravarthy**; the user-facing text shows one reading and every displaced alternative is in `docs/reference/VARIANTS.md`. Nothing is marked `verified: true` yet. Resolved by the owner (see VARIANTS.md): bhurig, varuṇo devatā, sibilant sandhi joined, savitar, saṅkalpa preamble dropped. Still worth a paṇḍita's eye:

1. **narmada-vandanam** — Kaalai's `jaratkārvor … mahāyaśaḥ` kept; classical `jaratkāror … mahāyaśāḥ` recorded in VARIANTS.md.
2. **Prāśana svaras** — follow sandhya.pdf + Kidambi (which agree); the earlier seed had a more heavily accented reading from an unknown edition.
3. **Sandhyādi devatā list** — `devebhyo / ṛṣibhyo / munibhyo / gurubhyo / pitṛbhyo namaḥ` deliberately not included (absent from all five sources) — add if your tradition recites them.
4. **Aṣṭākṣara mantra text** — not printed (upadeśa mantra); a note tells the user to recite as imparted.
5. **Illustrations** — generated line-art; the character wears an ūrdhva-puṇḍra. Finger positions (prāṇāyāma, brāhma-tīrtha, deva-tīrtha) need a human check; a Smārta (vibhūti) variant is pending.

How to correct: edit `app/src/content/parts/*.json` (IAST only), run `pnpm xlit && pnpm test`, open a PR. See `docs/CONTENT_GUIDE.md`.
