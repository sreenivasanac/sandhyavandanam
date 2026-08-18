# Indic transliteration + rendering — evaluation (2026-08-17)

Experiments run in a scratch dir with `@indic-transliteration/sanscript@1.3.3` (JS), `aksharamukha` 2.3.x + `indic_transliteration` 2.3.82 (Python), the Aksharamukha web API, and 18 fonts rendered by headless Chrome. Raw outputs: `indic-rendering/{samples,sanscript_out,aksharamukha_out}.json`; screenshots: `indic-rendering/*.png`.

## TL;DR recommendation

| Decision | Choice |
|---|---|
| Canonical storage | **IAST with Vedic combining marks** (U+0331 anudātta, U+030D svarita, U+030E dīrgha-svarita), exactly as `sandhya.json` does today. One authored field, all sources are Roman, diffs are readable. |
| Transliteration | **Build-time, Python `aksharamukha` → pre-rendered JSON** (`text.devanagari/tamil/kannada/telugu/malayalam`), because it is the only library that maps IAST accents → `॒ ॑ ᳚` correctly, orders them after visarga/anusvāra, and does Tamil superscripts right. Keep `sanscript` in the client only for user-supplied vars (name/gotra — never accented) so the 32 KB gz bundle stays; or drop it and pre-render vars too. |
| Tamil | Aksharamukha default (superscript numerals for varga: `கோ³விந்தா³ய`, Grantha ஜ ஷ ஸ ஹ க்ஷ), post-process `꞉`→`ஃ`, `ʼ` kept (marks anusvāra vs `m`). Offer a "no numerals" toggle (`TamilRemoveNumbers`) — cheap, some readers hate the digits. |
| Fonts | Devanagari **Noto Serif Devanagari** (fontsource OK). Tamil/Kannada/Telugu/Malayalam **full Noto Serif TTFs self-hosted from notofonts.github.io — not the fontsource/Google-Fonts subsets** (they strip U+0951/0952/1CDA → tofu on accented Tamil). IAST: **Gentium Plus / Noto Serif full TTF** (subsets strip U+0331/030D/030E). |

## A. Library comparison

| | JS `sanscript` 1.3.3 | Py `aksharamukha` | Py `indic_transliteration` | JS `aksharamukha` (npm) / web API |
|---|---|---|---|---|
| IAST `a̱ ī̎ hi̍` → Deva | passes Latin marks through **unchanged** (`अ̱ग्निमी̎` = tofu in every Deva font, see screenshot) — needs the remap the app already does in `lib/text.ts` | **correct**: `अ॒ग्निमी᳚ळे पु॒रोहि॑तं`, and `na̍ḥ`→`नः॑`, `ya̎ṃ`→`यं᳚` (mark after sign, which is what fonts need) | same as JS (`॒` ok, `॑`/`᳚` wrong) | web API = same output as Python |
| Deva `॒ ॑ ᳚` → IAST | `a॒gnimī᳚l̤e pu॒rohi̭taṃ` (keeps `॒`, U+032D for udātta, `᳚` untouched) — **not standard IAST** | `a̱gnimī̎l̤e pu̱rohi̍taṃ` — round-trips | `a̱gnimī᳚ḻe pu̱rohi̭taṃ` | – |
| Round-trip IAST→Deva→IAST | ok for plain text | ok (danda `\|` comes back as `.` unless `post_options=['Dot2Dandas']`) | ok | – |
| Tamil (default) | Tamil letters + Grantha ஜ ஷ ஸ ஹ; **ka/kha/ga/gha collapse to க** (`பர்கோ தேவஸ்ய தீமஹி`), ṛ = `ரு'`, visarga ஃ | superscript digits `ப⁴ர்கோ³ தே³வஸ்ய தீ⁴மஹி`, ṛ = `ருʼ`, visarga `꞉` (U+A789), avagraha `(அ)`, n→ன medially per Tamil orthography | as JS | same |
| Tamil superscripted | `tamil_superscripted` scheme exists but **buggy**: `ஶ்ரீதரா⁴ய`, `தா³மோதரா³ய`, `ருத்ர³` (digit lands one akṣara late) | correct | worse: `ப⁴ூர்` (digit before vowel sign) | – |
| Tamil + Grantha block | `tamil_extended` = Tamil + U+11300 Grantha letters mixed (needs Grantha font, mixed-script shaping) | `TamilExtended` = **Malayalam-block hack** needing a proprietary font; `TamilGrantha` = Bengali-block hack. Both unusable with standard fonts | – | – |
| Kannada/Telugu/Mlym | literal: `ಗೋವಿನ್ದಾಯ ಗಙ್ಗಾ`, Mlym `ഭൂര്` (no chillu) | nativized: `ಗೋವಿಂದಾಯ ಗಂಗಾ`, final `-m`→`ം`, Mlym chillu `ഭൂർ` (`nativize=False` for literal) | as JS | – |
| Bengali | `য` for ya, `ত্` | `য়` for medial ya, `ৎ` final t (Bengali reading habits — arguably wrong for Sanskrit) | as JS | – |
| `m̐` (Yajur anunāsika) | → `ꣳ` U+A8F3 (`सꣳस्कृतम्`) | → `ँ` U+0901 (`सँस्कृतम्`); Deva `ꣳ` → IAST `gͫ` | as JS | – |
| `gṃ / ggṃ` | `ग्ं / ग्ग्ं` (both) | same | same | – |
| Speed / size | 164 KB min, **32 KB gz**, not tree-shakeable, sync | 200 conversions 0.17 s after ~1 s import; `uv run --with aksharamukha` works | small | npm `aksharamukha@2.3.0-32` = **Pyodide wrapper, 16.8 MB** (useless in a bundle, pointless at build time vs Python). Web API `https://aksharamukha-plugin.appspot.com/api/public?source=IAST&target=Tamil&text=…` works (both hosts), no auth, fine as a fallback |

### Sample outputs (aksharamukha unless noted; `.` = danda unless `RetainXDanda`)

```
s1 Deva  ॐ भूर् भुवः सुवः । तत् सवितुर् वरेण्यं । भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥   (identical in sanscript)
s1 Tamil ௐ பூ⁴ர் பு⁴வ꞉ ஸுவ꞉ . தத் ஸவிதுர் வரேண்யம்ʼ . ப⁴ர்கோ³ தே³வஸ்ய தீ⁴மஹி . தி⁴யோ யோ ந꞉ ப்ரசோத³யாத் ..
   sanscript: ௐ பூர் புவஃ ஸுவஃ । தத் ஸவிதுர் வரேண்யம் । பர்கோ தேவஸ்ய தீமஹி । தியோ யோ நஃ ப்ரசோதயாத் ॥
s1 Kannada ಓಂ ಭೂರ್ ಭುವಃ ಸುವಃ . ತತ್ ಸವಿತುರ್ ವರೇಣ್ಯಂ . ಭರ್ಗೋ ದೇವಸ್ಯ ಧೀಮಹಿ . ಧಿಯೋ ಯೋ ನಃ ಪ್ರಚೋದಯಾತ್ ..
s1 Telugu  ఓం భూర్ భువః సువః . తత్ సవితుర్ వరేణ్యం . భర్గో దేవస్య ధీమహి . ధియో యో నః ప్రచోదయాత్ ..
s1 Mlym    ഓം ഭൂർ ഭുവഃ സുവഃ . തത് സവിതുർ വരേണ്യം . ഭർഗോ ദേവസ്യ ധീമഹി . ധിയോ യോ നഃ പ്രചോദയാത് ..
s1 ITRANS  oM bhUr bhuvaH suvaH . tat savitur vareNyaM ...   HK: oM bhUr bhuvaH suvaH ...
s2 Deva  आपो हिष्ठा मयोभुवः । ता न ऊर्जे दधातन । महेरणाय चक्षसे ।
s2 Tamil ஆபோ ஹிஷ்டா² மயோபு⁴வ꞉ . தா ந ஊர்ஜே த³தா⁴தன . மஹேரணாய சக்ஷஸே .
s3 Deva  केशवाय नमः । नारायणाय नमः । माधवाय नमः । गोविन्दाय नमः । विष्णवे नमः । मधुसूदनाय नमः । … हृषीकेशाय नमः । पद्मनाभाय नमः । दामोदराय नमः
s3 Tamil கேஶவாய நம꞉ . நாராயணாய நம꞉ . மாத⁴வாய நம꞉ . கோ³விந்தா³ய நம꞉ . விஷ்ணவே நம꞉ . மது⁴ஸூத³னாய நம꞉ . … ஹ்ருʼஷீகேஶாய நம꞉ . பத்³மநாபா⁴ய நம꞉ . தா³மோத³ராய நம꞉
s3 Kannada ಕೇಶವಾಯ ನಮಃ . ನಾರಾಯಣಾಯ ನಮಃ . ಮಾಧವಾಯ ನಮಃ . ಗೋವಿಂದಾಯ ನಮಃ (sanscript: ಗೋವಿನ್ದಾಯ) . ವಿಷ್ಣವೇ ನಮಃ . … ಹೃಷೀಕೇಶಾಯ ನಮಃ
s4 IAST→Deva  अ॒ग्निमी᳚ऴे पु॒रोहि॑तं य॒ज्ञस्य॑ दे॒वमृ॒त्विज᳚म्      sanscript: अ̱ग्निमी̎ऴे पु̱रोहि̍तं … (Latin marks, tofu)
s4 IAST→Tamil அ॒க்³னிமீ᳚ழே பு॒ரோஹி॑தம்ʼ ய॒ஜ்ஞஸ்ய॑ தே³॒வம்ரு॒ʼத்விஜ᳚ம்   sanscript: அ̱க்நிமீ̎ழே பு̱ரோஹி̍தம் …
s4 IAST→Kannada ಅ॒ಗ್ನಿಮೀ᳚ೞೇ ಪು॒ರೋಹಿ॑ತಂ ಯ॒ಜ್ಞಸ್ಯ॑ ದೇ॒ವಮೃ॒ತ್ವಿಜಂ᳚   Telugu అ॒గ్నిమీ᳚ఴే పు॒రోహి॑తం …   Mlym അ॒ഗ്നിമീ᳚ഴേ പു॒രോഹി॑തം …
s4 Deva→IAST  a̱gnimī̎l̤e pu̱rohi̍taṃ (aksharamukha)   |  a॒gnimī᳚l̤e pu॒rohi̭taṃ (sanscript)   |  Deva→Tamil அ॒க்³னிமீ᳚ளே பு॒ரோஹி॑தம்ʼ
s5 Deva  ॐ भूर्भुवस्सुवः । नमग्ग्ं ते रुद्र मन्यव उतोत इषवे नमः । तेऽस्तु । कॢप्तं । संस्कृतं सँस्कृतम् (sanscript: सꣳस्कृतम्) । गङ्गा । नमोऽस्तु
s5 Tamil ௐ பூ⁴ர்பு⁴வஸ்ஸுவ꞉ . நமக்³க்³ம்ʼ தே ருத்³ர மன்யவ உதோத இஷவே நம꞉ . தே(அ)ஸ்து . க்லுʼப்தம்ʼ . ஸம்ʼஸ்க்ருʼதம்ʼ ஸம்ˮஸ்க்ருʼதம் . க³ங்கா³ . நமோ(அ)ஸ்து
   sanscript: … நமக்க்ம் தே ருத்ர … தேऽஸ்து (Devanagari avagraha leaks into Tamil) । க்லு'ப்தம் । ஸம்ஸ்க்ரு'தம் ஸம்̐ஸ்க்ரு'தம்
```

## B. Fonts — sample 4 rendered (Chrome, `indic-rendering/devanagari-fonts-sample4.png`)

| Font | Licence | Get it | U+0951/0952 | ᳚ 1CDA | ꣳ A8F3 | Observed on sample 4 |
|---|---|---|---|---|---|---|
| **Noto Serif Devanagari** | OFL | `@fontsource/noto-serif-devanagari` (49 KB woff2, subset keeps 1CD0-1CF9 + A8E0-A8FF) | Y | Y | Y | all three accents placed correctly, ꣳ ok — **use** |
| Noto Sans Devanagari | OFL | `@fontsource/noto-sans-devanagari` | Y | Y | Y | correct |
| Tiro Devanagari Sanskrit | OFL | `@fontsource/tiro-devanagari-sanskrit` (179 KB) | Y | Y | Y | correct, more classical letterforms — good alternative |
| Shobhika | OFL | github.com/Sandhi-IITBombay/Shobhika (OTF 359 KB) | Y | Y | Y | correct |
| Siddhanta | CC BY-NC-ND (web-font use allowed) | github.com/indic-transliteration/sanskrit-fonts | Y | Y | Y | correct, richest ligatures; also carries IAST combining marks; 1.1 MB |
| Adishila Vedic | proprietary; site says use OK, "not allowed to host or distribute" → **not for self-hosting** | adishila.com/fonts | Y | Y | Y | correct but small-looking metrics |
| Sanskrit 2003 | free (Omkarananda) | omkarananda-ashram.org | Y | **no** | no | ᳚ and ꣳ tofu |
| Chandas / Uttara | GPL | sanskrit-fonts repo | Y | **no** | no | ᳚, ꣳ tofu (Unicode 5-era; uses PUA) |
| Sahadeva | OFL | sanskrit-fonts repo | Y | **no** | no | ᳚, ꣳ tofu |
| Martel | OFL | `@fontsource/martel` | Y | no | no | tofu |
| Noto Serif/Sans Tamil **full TTF** | OFL | notofonts.github.io/tamil/fonts/NotoSerifTamil/full/ttf/ (126 KB) | Y | Y | – | accents position correctly on Tamil (`indic-rendering/tamil-full-noto-and-sanscript.png`) |
| Noto Serif Tamil **fontsource / Google Fonts** | OFL | `@fontsource/noto-serif-tamil` | **stripped** | **stripped** | – | tofu; browser cannot borrow a mark from another font for a cluster → unfixable via fallback stack |
| Noto Serif Kannada / Telugu / Malayalam (fontsource) | OFL | `@fontsource/noto-serif-{kannada,telugu,malayalam}` | Y | Y | – | correct in all three even in the subset |
| Noto Sans Grantha | OFL | `@fontsource/noto-sans-grantha` | Y | no | – | renders U+11300 Grantha; only needed if you go `tamil_extended` |
| Latin for IAST: Gentium Plus / Noto Serif / Charis fontsource subsets | OFL | – | U+0331/030D/030E **stripped** | | | tofu for ̎; system Times lacks U+030E too. Full TTFs (Noto Sans full, Gentium Plus from SIL, Siddhanta) have them and render `a̱gnimī̎ḻe` fine |

## C. Gotchas found

1. **sanscript ignores IAST accents** (passes U+0331 etc. through) and its own IAST↔Deva accent map is non-standard (`॑`↔U+032D). The `SVARA` remap in `app/src/lib/text.ts` is mandatory if sanscript stays.
2. **Mark order**: `॑ ॒ ᳚` must come *after* `ः ं ँ` (Deva/Knda/Telu/Mlym) or you get a dotted circle (`indic-rendering/accent-order.png`). In **Tamil the opposite holds for `ஃ`** (`நஃ॑` = dotted circle, `ந॑ஃ` fine); `ம்॑` works either way. `SVARA_BEFORE_SIGN` in `text.ts` currently swaps for Tamil `ஂஃ` too — bug once a `na̍ḥ` appears. Aksharamukha emits the right order per script.
3. Aksharamukha Tamil puts the varga digit between base and accent: `தே³॒வ` → the anudātta hangs under the `³`. Fix with one regex (`([³⁴²])([॒॑᳚])`→`$2$1`) or use `TamilRemoveNumbers` for accented lines.
4. Aksharamukha Tamil visarga is `꞉` U+A789 — no Tamil font has it (tofu even in full Noto Tamil). Replace with `ஃ` (what Tamil books and sanscript use).
5. **fontsource/Google-Fonts subsets strip Vedic marks from Tamil and strip U+0331/030D/030E from every Latin font.** Devanagari, Kannada, Telugu, Malayalam subsets are fine. Self-host the full Tamil TTF and a full Latin TTF (or `stripSvara` the IAST line, as the app does).
6. `ḻ` (used for ळ in Vedic-IAST sources) → **ऴ** (Tamil ḻa) in *both* libraries; ळ is `l̤`. Normalise at authoring (`ḻ`→`l̤`, or aksharamukha `pre_options=['IASTLDotRetroflex']` if you write ḷ). Note the current corpus writes ḻ.
7. `gṃ/ggṃ` → `ग्ग्ं` in both. Decide one Devanagari rendering: `ꣳ` (U+A8F3, in Noto/Tiro/Siddhanta/Shobhika) or `ग्ं`. Author as `m̐`→ sanscript gives ꣳ, aksharamukha gives ँ; or keep `gṃ` in IAST and regex to ꣳ at build. Tamil books write it `க்³ம்`/`ஹ்ம்` — leave the literal transliteration.
8. Aksharamukha writes `.`/`..` for dandas in non-Devanagari targets and in IAST; pass `post_options=['RetainTamilDanda']` etc. (Kannada/Telugu/Malayalam/Gujarati variants exist) and `Dot2Dandas` for IAST.
9. Aksharamukha nativizes Kannada/Telugu/Malayalam (anusvāra for homorganic nasal, chillu, final `-m`→`ം/ಂ`) — this is what printed Kannada/Telugu Sanskrit books do; `nativize=False` gives sanscript-style literal output. Its Bengali `য়`/`ৎ` is a Bengali-reading convention — irrelevant for v1.
10. Aksharamukha `TamilExtended`/`TamilGrantha` are font-hack encodings (Malayalam/Bengali codepoints) — do not use. sanscript `tamil_extended` uses real Grantha codepoints but mixes two scripts per word — heavy shaping risk; skip.
11. `sanscript.tamil_superscripted` misplaces digits (see table). Python `indic_transliteration` even worse. Only aksharamukha's Tamil superscripts are correct.
12. Adishila's licence forbids hosting/redistribution; Siddhanta is CC BY-NC-ND (explicitly allows web-font use, blocks selling). Noto/Tiro/Shobhika are OFL — no questions.
13. Aksharamukha import prints hundreds of `SyntaxWarning`s (`is` with str) on Python 3.13 — harmless, `warnings.filterwarnings('ignore')`.

## D. Recommended pipeline

```
scripts/render_scripts.py   (uv run --with aksharamukha)
  for each mantra text.iast:
    pre:  ḻ→l̤ ; (optional) g+ṃ→m̐
    for tgt in Devanagari, Tamil, Kannada, Telugu, Malayalam:
        out = transliterate.process('IAST', tgt, iast, post_options=[Retain<Tgt>Danda])
    Tamil post: ꞉→ஃ ; move accent before superscript digit ; optional TamilRemoveNumbers variant
    write text.<script> into sandhya.json (schema already allows it: "Missing scripts are transliterated at runtime")
```
- Runtime keeps `render()` fallback (sanscript + SVARA remap) only for `{name}/{gotra}` vars; add a test that every shipped mantra has all five scripts so sanscript never touches accented text. Add `verified` diff test: re-run script in CI, fail on drift.
- Fonts (`index.css`): Deva `'Noto Serif Devanagari'` (fontsource); Tamil `'Noto Serif Tamil'` from `public/fonts/NotoSerifTamil-Regular.ttf` (full build) via your own `@font-face` (drop `@fontsource/noto-serif-tamil`); Knda/Telu/Mlym fontsource as now; IAST line: keep `stripSvara` + Gentium Book Plus (fontsource) — or self-host full Gentium Plus TTF if accents should show in Roman. `font-feature-settings` not needed.
- Skipped: build-time Aksharamukha via npm/Pyodide (16.8 MB), web API (works, but adds a network dependency to the build; keep as fallback if uv is unavailable), Grantha-mixed Tamil, Adishila.
