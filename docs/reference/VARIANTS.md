# Variant ledger — readings removed from the app content

Owner's rule (2026-08-17): where sources conflict, **Kidambi** (`docs/reference/clean/sandhyaavandanam.md`) wins; then **Chakravarthy** (`Yajurveda-Sandhyavandanam.md`); the other three (sandhya.pdf = `sandhya.md`, Mumbai = `Sandhyavandanam.md`, Kaalai = `Yajurveda_Kaalai_Sandhyaavandanam.md`) only where those two are silent. Between Kidambi and Chakravarthy, Kidambi wins for Sanskrit text, Chakravarthy for English meanings/instructions.

The app (`app/src/content/parts/*.json`) shows one reading. Every alternative that was removed from a `note`, `intro`, `meaning` or `action` is recorded here so nothing is lost. Untouched by design (owner to decide separately): `bhīruḍh gāyatrī triṣṭup chandāṃsi`, the evening `savitā devatā`, the sibilant-sandhi spacing (`bhuva̱s suva̍ḥ`), and the word `savitar` in samāpti.

| step id | item (first words) | reading kept (source) | reading removed (source) | note |
|---|---|---|---|---|
| acamanam | intro, "Direction: …" | east in the morning and at noon; evening east until arghya-pradānam, west thereafter (Kidambi, Chakravarthy) | noon: north (sandhya.pdf); evening: west throughout (sandhya.pdf); evening: north (Mumbai) | facing |
| sankalpam | Smārta noon saṅkalpa | `…prītyarthaṃ {kala} sandhyām upāsiṣye` (sandhya.pdf, Kaalai form) | `…prītyarthaṃ mādhyāhnikaṃ kariṣye` (Mumbai) | note removed |
| sankalpam | Vaiṣṇava saṅkalpa `śrī bhagavadājñayā…` | `śrī bhagavadājñayā śrīmannārāyaṇa prītyarthaṃ {kala} sandhyām upāsiṣye` (Kidambi; Chakravarthy gives it as the alternative) | `hariḥ oṃ tatsat \| govinda govinda govinda \| bhagavad ājñayā bhagavat kaiṅkarya rūpaṃ {kala} sandhyām upāsiṣye` (sandhya.pdf); combined form `śrī bhagavadājñayā bhagavat kaiṅkarya rūpaṃ śrīmannārāyaṇa prītyarthaṃ` (unsourced note); Chakravarthy's primary form `mamopātta samasta duritakṣaya dvārā śrīmannārāyaṇa prītyarthaṃ` | The `hariḥ oṃ tatsat \| govinda ×3 \|` preamble (sandhya.pdf; absent in Kidambi and Chakravarthy) was removed from **all** Vaiṣṇava saṅkalpas: sankalpam, arghya-pradanam, prayascitta-arghyam, japa-sankalpam, ashtakshara-japam, gayatri-upasthanam. Smārta saṅkalpas keep it (Kidambi/Chakravarthy silent). |
| satvika-tyagam | `bhagavāneva svaniyāmya…` | Kidambi p22–23 wording (`…svarūpasthiti pravṛtti svaśeṣataika rasena anena ātmanā kartrā svakīyaiśca … karma svasmai svaprītaye svayameva kārayati`) | Chakravarthy p17: begins `oṃ bhagavāneva…`, reads `svarūpasthiti pravṛtta svaśeṣataika rasena mayā svakīyaiśca upakaraṇaiḥ … karma bhagavān svasmai svaprītaye svayameva kārayati` | Kidambi wins for text |
| tilakam | intro, finger | ring finger (Mumbai, Kaalai) | middle finger (sandhya.pdf) | Kidambi/Chakravarthy have no tilakam step |
| prokshanam | intro, nyāsa | nyāsa performed: head/nose/heart/añjali (Kidambi, Chakravarthy) | sandhya.pdf, Mumbai and Kaalai omit the nyāsa | presence/absence |
| prokshanam, punar-marjanam | `yasya kṣayāya jinvatha` action | sprinkle on the big toes (Chakravarthy — instructions) | knees (Kidambi); feet (sandhya.pdf, Kaalai) | Kidambi and Chakravarthy disagree on an instruction; owner rule = Chakravarthy for instructions. Flip to "knees" if text-primacy is preferred. |
| arghya-pradanam | intro, releasing the water | thrown up towards the sun (Chakravarthy) | poured on the ground (sandhya.pdf) | |
| arghya-pradanam | intro + `repeat` at noon | one libation at noon (Kidambi p61, who adds "there is also a sampradāyam wherein … is done twice") | two at noon (Chakravarthy p25/26; Mumbai); three at every kāla (sandhya.pdf) | `repeat.madhyahnika` changed 2 → 1 |
| arghya-pradanam | `oṃ sūryāya namaḥ \| idam arghyam` | item kept, `optional:true` | action read "sandhya.pdf adds this after each libation" | sandhya.pdf-only item; attribution dropped |
| prayascitta-arghyam | turīyārghya mantra action | vyāhṛtis + Gāyatrī + vyāhṛtis (Kidambi, Chakravarthy) | Gāyatrī alone, as in the ordinary arghya (sandhya.pdf, Mumbai) | |
| brahma-bhavanam | intro | añjali directly after ātma-pradakṣiṇam (Kidambi, Chakravarthy) | a prāṇāyāma first (Kaalai) | |
| asanam | intro / `pṛthvi tvayā` action | stand in the sprinkled area, hands in añjali (Kidambi p33–34) | sit and touch the ground (sandhya.pdf) | Chakravarthy has no āsana mantra; earlier intro read "Sit (Kidambi: stand) … and touch the ground" |
| asanam | `apasarpantu te bhūtā` (bhūmi prārthanā) | item kept, `tradition:smarta`, `optional:true` | intro/action attributed it to "the Kaalai Smārta text" | Kaalai-only item; now "Some Smārtas first add…" |
| uttaranga-acamanam | `śuklāmbaradharaṃ` action | "five times, once after each phrase" (Mumbai, Kaalai; same as vighna-apaharanam intro) | "(some texts: five times, once after each word)" | vague hedge removed for consistency |
| japa-sankalpam | Vaiṣṇava saṅkalpa | `…{kala} sandhyā {japaCount} vāraṃ gāyatrī mantra japaṃ kariṣye` (Kidambi p34) | `gāyatrī mahāmantra japaṃ` (Chakravarthy, Mumbai, Kaalai); `…saṅkhyayā` for `vāraṃ` (Chakravarthy); `hariḥ oṃ tatsat \| govinda ×3` preamble (sandhya.pdf) | text changed; Smārta form keeps `mahāmantra` (Mumbai, Kaalai; Kidambi silent) |
| japa-sankalpam | counts note | 108 / 28 / 10 (Kidambi); 32 and 1008 also listed (Chakravarthy p36) | 108 in the morning, 32 at noon, 64 in the evening (Mumbai p13) | |
| pranayama-nyasam | Gāyatrī-śiras nyāsa (`gāyatrī-śiraso brahmā ṛṣiḥ …`) | included, untagged (Kidambi) | Chakravarthy: Gāyatrī-śiras nyāsa and the three verses that follow optional; Mumbai and Kaalai stop after the vyāhṛti nyāsa | note removed |
| pranayama-nyasam | `muktāvidruma…` line 3 | `varadābhayāṃ kuśakaśaṃ` (Kidambi, Chakravarthy) | `varadābhayāṅkuśakaśāṃ` (goad and whip; Kaalai) | |
| pranayama-nyasam | closing note, ten recitations | Kidambi's remark kept (recite the prāṇāyāma mantra ten times instead of three prāṇāyāmas) | Kaalai: perform ten prāṇāyāmas | |
| gayatri-japam | chandas nyāsa | `devī gāyatrī chandaḥ` (Kidambi, Chakravarthy) | `nicṛd-gāyatrī chandaḥ` (sandhya.pdf, Mumbai, Kaalai) | note removed |
| gayatri-japam | kara-nyāsa / aṅga-nyāsa header note | items kept, `optional:true` | "(sandhya.pdf; not in Kidambi or the Smārta booklets)" | sandhya.pdf-only block; attribution dropped |
| ashtakshara-japam | saṅkalpa | `śrī bhagavadājñayā śrīmannārāyaṇa prītyarthaṃ {japaCount} vāraṃ śrī aṣṭākṣara mantra japaṃ kariṣye` (Chakravarthy p37, with Kidambi's `vāraṃ` convention) | `hariḥ oṃ tatsat \| govinda ×3 \| … śrī aṣṭākṣara mahāmantra japaṃ` (earlier draft, after the sandhya.pdf pattern); Chakravarthy's own count phrase `aṣṭottara śata saṅkhyayā / aṣṭāviṃśati saṅkhyayā` | Kidambi has no separate aṣṭākṣara saṅkalpa |
| gayatri-upasthanam | intro, standing up | "stand up" (Kidambi, Chakravarthy) | rise while touching the ground with the right ring finger, then stand erect (Mumbai p16) | |
| gayatri-upasthanam | saṅkalpa | Vaiṣṇava `…{kala} sandhyā upasthānaṃ kariṣye` (Kidambi p42); Smārta `…{kala} sandhyopasthānaṃ kariṣye` (sandhya.pdf) | `{kala} sandhyā gāyatrī upasthānaṃ kariṣye` (Chakravarthy p38, Kaalai) | note removed |
| sandhyadi-devata-vandanam | `kāmo 'kārṣīt manyur akārṣīt namo namaḥ` | `kāmo 'kārṣīt manyur akārṣīt` (Kidambi p45, Chakravarthy p41) | `kāmo 'kārṣīn manyur akārṣīn` (sandhya.pdf p13); `kāmo akārṣīn manyur akārṣīt` (Mumbai) | **text changed** from the sandhya.pdf reading |
| sandhyadi-devata-vandanam | order of directions | E→S→W→N morning/noon; W→N→E→S evening (Kidambi) | Mumbai keeps E→S→W→N at all three kālas, turning west only for `sarvābhyo devatābhyo` in the evening | |
| dik-vandanam | tail of the list | `brahmaṇe` (Smārta), `viṣṇave`, then optional Smārta `rudrāya`, `yamāya`; Kidambi ends with `viṣṇave namaḥ` | sandhya.pdf: `viṣṇave, brahmaṇe, rudrāya`; Mumbai: `brahmaṇe, viṣṇave`; Kaalai adds `rudrāya, yamāya`; Chakravarthy adds `yamāya` as optional | order/tail |
| yama-vandanam | `yamāya dharmarājāya…` | `…citraguptāya vai namaḥ \| citraguptāya vai nama oṃ nama iti` (Chakravarthy p43) | sandhya.pdf: `citraguptāya vai namo namaḥ`, omits the closing `citraguptāya vai nama oṃ nama iti`; Mumbai prefixes `yamāya namaḥ` | |
| narmada-vandanam | `jaratkārvor jaratkārvāṃ samutpanno mahāyaśaḥ` | Kaalai text (only source) | classical `jaratkāror jaratkārvāṃ samutpanno mahāyaśāḥ` (Āstīka, son of the sage Jaratkāru and his wife Jaratkāru) | intro attribution "the Kaalai text, a morning manual, has it facing east" also dropped |
| samarpanam | `śrīraṅga maṅgalamaṇiṃ` | `maṅgalamaṇiṃ` (Kidambi p49) | `maṅgalanidhiṃ` (Chakravarthy p46) | Chakravarthy's "optional, for Ahobila Maṭha śiṣyas" remark kept in the note |
| samapti | `adyā no deva savitaḥ … parā duḥṣvapniyaguṃ suva \| viśvāni deva savitar duritāni…` | `duḥṣvapniyaguṃ` (sandhya.pdf); `savitar` (as authored — owner to decide) | `duṣvapnyaguṃ` (Mumbai; Kaalai Roman `dushvapnyahum`), `duṣvapniyaguṃ` (Kaalai Tamil); `savitur` (sandhya.pdf); `savita` (Kaalai) | Kidambi and Chakravarthy do not have this verse; note removed, word `savitar` unchanged |

## Owner decisions 2026-08-18 (applied)
| step | item | kept | removed / changed from | note |
|---|---|---|---|---|
| surya-upasthanam (morning nyāsa) | chandas line | `bhurig gāyatrī triṣṭup chandāṃsi` | Kidambi prints `bhīruḍh` (भीरुढ्) | treated as a misprint of the metre term *bhurig* |
| surya-upasthanam (evening nyāsa) | devatā line | `varuṇo devatā` | Kidambi prints `savitā devatā` | Varuṇa hymns (imam me varuṇa…) |
| all saṅkalpas (Smārta and Vaiṣṇava) | preamble | none | `hariḥ oṃ tatsat | govinda govinda govinda |` (sandhya.pdf only) | Kidambi, Chakravarthy, Kaalai, Mumbai all lack it |
| everywhere | doubled-sibilant sandhi | joined: `bhuva̱ssuva̍ḥ`, `va̍śśi̱vata̍mo̱`, `dhyeyassadā`, `yo devassavitā` | spaced form | matches Kidambi/Chakravarthy printing; other word spaces kept for readability |
| samapti | `viśvā̎ni deva savitar` | `savitar` (RV 5.82.5 vocative) | sandhya.pdf `savitur`, Kaalai `savita` | neither Kidambi nor Chakravarthy has this mantra |
| acamanam | intro, source tags | citations "(Kidambi, Chakravarthy)" dropped from user text; evening direction kept as a kāla-tagged todo line | — | 2026-11-23 wording pass: all source names removed from user-facing text; `sources` arrays unchanged |
| anga-nyasam | item hints | plain "Touch your right cheek with your right thumb." etc. | glosses "(seat of fire)", "(seat of the Sun)", "(seat of wind)", "(seat of Indra)", "(seat of Prajāpati)"; "thumb touches the middle of the finger used (Chakravarthy)" kept as a plain line without the name | commentary on the touch points removed |
| anga-nyasam | note | "repeat the whole ācamanam once more" (Śrī Vaiṣṇava, Kidambi) | name only dropped | |
| vighna-apaharanam | intro | step shown for both traditions; Śrī Vaiṣṇava line "Do this only if your family does it" | "Kidambi's Śrī Vaiṣṇava text omits this step"; "Chakravarthy: *viṣṇum* here refers to Gaṇapati" | commentary removed from user text |
| pranayamam | intro | detailed nostril sequence (unchanged); mantra recited mentally while holding the breath | Chakravarthy: seven vyāhṛtis while inhaling, Gāyatrī while holding, *oṃ āpo jyotī…* while exhaling (ratio 1:3:2) | |
| sankalpam | intro | pañcāṅga sentence kept without source; wash the right palm afterwards (Chakravarthy) | — | |
| arghya-pradanam | intro | prāṇāyāma "as in the Prāṇāyāmam step" with no round count; stand for the offering at all three times (Kidambi) | prāṇāyāma one round (Chakravarthy); noon: standing or sitting, evening: sitting (Chakravarthy); noon: some sampradāyas offer twice (Kidambi) | |
| prayascitta-arghyam | intro | late-sandhyā condition; at noon only some families (Kidambi) | — | duplicate note on prāṇāyāma removed |
| brahma-bhavanam, others | meanings | "Savitā" used everywhere | "Savitṛ" in English meanings | Sanskrit unchanged |
| punar-marjanam | item 1 meaning | no reference code | "(RV 4.39.6; TS 1.5.11.4)" | |
| tarpanam | intro | Smārta: nine grahas then twelve names; Śrī Vaiṣṇava: twelve names only (Kidambi) | — | tag-split lines |
| asanam | intro | optional bhūmi prārthanā line for Smārtas | "Some Smārtas first add…" | |
| uttaranga-acamanam | intro | "Some families begin the Gāyatrī part with a fresh ācamanam" | "Kidambi goes straight from the āsana mantra to prāṇāyāma and the japa saṅkalpam" | |
| japa-sankalpam | counts note | 108 / 28 / 10 in Sanskrit | 32 and 1008 also listed (Chakravarthy) | |
| gayatri-japam | intro | morning/noon standing, evening seated; hand level by kāla (Chakravarthy) | — | now kāla-tagged todo lines |
| gayatri-japam | last note | vareṇyaṃ read vareṇiyaṃ for 24 syllables | "(Kidambi)" | |
| ashtakshara-japam | intro | "Do this step at the point your ācārya or family teaches" | Ahobila Maṭha disciples do it before the upasthānam; others after the whole sandhyā (Chakravarthy); some after Gāyatrī udvāsanam (Kidambi); saṅkalpa posture hint "Kidambi has no separate saṅkalpa"; closing: ācamanam, sprinkling the japa spot, *sarvaṃ śrī kṛṣṇārpaṇam astu* (Chakravarthy) | step position unchanged |
| sandhyadi-devata-vandanam | note | — | "Chakravarthy adds four namaskārams here." | removed |
| abhivadanam | note | trayārṣeya / pañcārṣeya rule | worked example from Sandhyavandanam.pdf (`abhivādaye vaiśvāmitra āghamarṣaṇa kauśika trayārṣeya pravarānvita kauśika gotraḥ āpastamba sūtraḥ yajuś śākhādhyāyī śrī lakṣmīnārāyaṇa śarmā nāmāham asmi bhoḥ`); "see the gotra–pravara table" | example removed so students do not copy a name |
| surya-narayana-vandanam | note | namo brahmaṇya devāya optional; four sāṣṭāṅga namaskārams after (Chakravarthy) | — | name dropped |
| samarpanam | notes | Śrīraṅgam verse shown (optional) | Chakravarthy: optional, for Ahobila Maṭha śiṣyas; Kidambi: for all | |
| samapti | notes | order as in the app (sprinkling after the samarpaṇam) | Kidambi: this sprinkling and the ten *śrī kṛṣṇāya namaḥ* come right after the second abhivādanam and ācamanam, before the sātvika tyāgam and *kāyena vācā*; Chakravarthy: four prostrations (kept) | **ordering conflict left for the owner** |
