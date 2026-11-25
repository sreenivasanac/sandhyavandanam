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

## Source check 2026-11-25 (applied)

Owner's rule from this date: **Sandhyavandanam.pdf (Mumbai, "S1")** is the main source for the Smārta text; then the rev7 PDF ("R7"), the scanned Trikala book ("S2") and the T S Ranganathan video ("V"). Kidambi, Chakravarthy and sandhya.pdf are fillers, used where those four are silent. The Śrī Vaiṣṇava variant keeps Kidambi's readings. Details and page references: `source-check-2026-11-25.md`. This table supersedes earlier rows for the same items.

| step id | item | reading now shown (source) | reading moved out of the main Smārta text (source) | note |
|---|---|---|---|---|
| acamanam and all later steps | evening facing | north from ācamanam to tarpaṇam, west for arghya, west from the japa saṅkalpa on, north again from samarpaṇam to the end (S1; R7 general note) | east until arghya, west after (Kidambi, Chakravarthy) | `facing` is not per tradition, so Śrī Vaiṣṇavas now see the S1 directions too |
| acamanam | posture | sit on the plank, hands between the knees; "some squat on the heels" (S1; R7) | squat in kukkuṭāsana as the only posture (sandhya.pdf; S2 drawing) | |
| acamanam | hand shape | index finger bent to the base of the thumb, other fingers curled into a hollow (S2; R7 similar) | little, ring and middle fingers straight, index bent (earlier app text) | R7: "bend all the fingers except the thumb and the little finger" |
| acamanam | wiping the lips | optional note (R7: "only a few follow it") | part of the main instructions | not in S1 or S2 |
| pranayamam | breath and mantra | in through the left with the seven vyāhṛtis, hold with the Gāyatrī, out through the right with *oṃ āpo jyotī*; no opening exhale (S1 p2–3; S2 p.4–5) | exhale first through the right; whole mantra said while holding the breath (earlier app text) | R7 beginner form: inhale with part 1, exhale with parts 2 and 3 |
| pranayamam and every later prāṇāyāma | rounds | one round at each point; three before the japa (owner's decision) | three rounds at every point (earlier app text) | S1 has one round before the japa as well; S2 "three … nine"; R7 ten |
| tilakam | status and action | core for Smārta; write *oṃ* on the water with the ring finger (S1 p4; S2; R7 item 5; V) | "only if you did not apply it after your bath"; "trace the mantra on the water" (sandhya.pdf) | still optional for Śrī Vaiṣṇava: Kidambi and Chakravarthy have no tilakam step. R7 places the mark between the eyebrows |
| prokshanam, punar-marjanam | sprinkling | with the right ring finger, on head and face (S1; S2) | "with your right fingers", on the head | |
| prokshanam, punar-marjanam | `yasya kṣayāya jinvatha` | on the feet (R7; sandhya.pdf; S2 in punar-mārjanam) | big toes (Chakravarthy); knees/legs (S1); thighs (S2 in prokṣaṇam) | owner's decision: feet |
| prokshanam, prasanam, punar-marjanam, arghya-pradanam, prayascitta-arghyam, gayatri-upasthanam, surya-upasthanam | ṛṣi / chandas / devatā nyāsa lines | hidden by default for Smārta (`optional: ["smarta"]`); in the normal flow for Śrī Vaiṣṇava (Kidambi) | shown to everyone | in none of S1, S2, R7, V |
| arghya-pradanam | before the offering | nothing: punar-mārjanam → arghya (S1, S2, R7, V) | prāṇāyāma, saṅkalpa `…sūryārghya pradānaṃ kariṣye` and nyāsa first (sandhya.pdf, Chakravarthy, Kidambi) | kept for Śrī Vaiṣṇava; hidden by default for Smārta |
| arghya-pradanam | count at noon | two (S1 p7; S2 p.13; R7 item 9; V) | one (Kidambi p61) | `repeat.madhyahnika` 1 → 2 |
| arghya-pradanam | posture | morning standing; noon standing (some sit); evening sitting, facing west (S2 p.13; R7 item 9) | standing at all three times (Kidambi) | S1 does not say. Noon facing: east (S1, R7); S2 has north |
| arghya-pradanam | releasing the water | flows down from the fingertips, not over the thumb, onto the plate (S1 "pour the water on the floor"; S2) | thrown up towards the sun (Chakravarthy) | |
| prayascitta-arghyam | status | a normal step in all three kālas, explained as covering any delay (S1 p8; S2 p.14–15; R7 item 11; V) | "only if you are late"; "at noon only some families" (sandhya.pdf; Kidambi) | |
| prayascitta-arghyam | mantra | Smārta: the plain Gāyatrī with *oṃ bhūr bhuvas suvaḥ*, as in the main arghya (S1 p8; R7 "as in 9") | seven vyāhṛtis + Gāyatrī + *oṃ āpo jyotī* (Kidambi, Chakravarthy) | long form kept for Śrī Vaiṣṇava |
| prayascitta-arghyam | Smārta saṅkalpa | `…kālātīta prāyaścittārthaṃ turīyārghya pradānaṃ kariṣye` (as authored) | S1 p8: `kālātīta prāyaścittārtham arghyapradānaṃ kariṣye` with no "turīya" and no preamble | **not changed — owner to decide** |
| brahma-bhavanam | hands for the meditation | fingertips of both hands on the chest, eyes closed (R7 item 13; S2 drawing) | palms joined in añjali, facing the sun (Kidambi, Chakravarthy) | |
| tarpanam | hands | a spoonful in the right palm, off the fingertips (S1; S2) | both joined palms as the only way (Chakravarthy) | now "some use both joined palms" |
| asanam | whole step | hidden by default for Smārta (S2 only among the main sources; not in S1); Smārta posture: sit, touch the floor then the brow with the ring finger (S2 p.21–22) | shown to everyone, standing (Kidambi p33–34) | Śrī Vaiṣṇava lines unchanged |
| uttaranga-acamanam | whole step | removed: the ācamanam after tarpaṇam already covers it (S1, S2, R7, V) | optional ācamanam at the start of the japa part (sandhya.pdf, Chakravarthy) | step id `uttaranga-acamanam` no longer exists |
| japa-sankalpam | Gaṇapati dhyānam | core Smārta item at the start of the japa part (S1 p12; S2 p.22; R7 item 18; V) | only inside the optional ācamanam step | same text and audio as before |
| japa-sankalpam | Smārta saṅkalpa | `…{kala} sandhyā gāyatrī mahāmantra japaṃ kariṣye`, no count (S1 p13) | `…{kala} sandhyā {japaCount} vāraṃ gāyatrī mahāmantra japaṃ kariṣye` (sandhya.pdf form) | **text changed**; the Śrī Vaiṣṇava saṅkalpa keeps the count (Kidambi p34) |
| japa-sankalpam | counts note | Smārta: 108 morning / 32 noon / 64 evening (S1 p16; S2 p.30; R7 item 23), 28 or 10 as reduced counts | Sanskrit count words for 108 / 28 / 10 shown to everyone | Sanskrit count note now Śrī Vaiṣṇava only |
| pranayama-nyasam | Gāyatrī nyāsa (`sāvitryā ṛṣir viśvāmitraḥ …`) at this point | hidden by default for Smārta; it is said after the āvāhanam, in gayatri-japam (S1 p15–16; S2 p.28; V) | said here as well (R7 item 21, with the remark "not widely practiced"; Kidambi) | |
| pranayama-nyasam | Gāyatrī-śiras nyāsa, `oṃ āpo jyotī` body touch, `arkamaṇḍala madhyasthaṃ` | hidden by default for Smārta | shown to everyone (Kidambi) | in none of S1, S2, R7 |
| pranayama-nyasam | `muktāvidruma` dhyāna | kept here | S2 p.28 says it after the āvāhanam and the Gāyatrī nyāsa; S1 and R7 do not have it | position not changed |
| kala-dhyanam | time-of-day verses (`prātar dhyāyāmi…`, `madhyandine tu…`, `sāyaṃ sarasvatīṃ…`) | hidden by default for Smārta; `yo devassavitā` stays (S2 p.28–29) | shown to everyone (Kidambi, sandhya.pdf, Chakravarthy) | in none of S1, S2, R7 |
| gayatri-japam | posture at noon | standing or seated (R7 item 23) | standing only (Chakravarthy) | S2 has the japa seated at all times |
| gayatri-japam | evening facing | west while the sun is up; "after sunset some face east" (S1 west; S2 p.30) | — | |
| gayatri-japam | counting | both ways given: two hands (units and tens); or the right hand alone from the middle line of the ring finger (S2 p.30) | two hands only | |
| gayatri-upasthanam | rising | Smārta: ring finger on the floor while rising, then to the brow (S1 p17; S2) | "stand up", then open the joined palms outward (Kidambi, Chakravarthy) | Śrī Vaiṣṇava lines unchanged. S2 p.31 describes another udvāsana gesture: clasp and twist both hands, rotate them from inside and release |
| surya-upasthanam | noon facing | east (S1, R7) | north (S2 p.35) | not changed |
| abhivadanam, abhivadanam-2 | hands | cover the ears with the hands; "some cross the forearms, right over left" (S2 p.39–40) | crossed forearms as the only way | crossing is in none of S1, S2, R7 |
| abhivadanam, abhivadanam-2 | noon facing | north (S1 p21, p24) | east (Kidambi) | |
| dik-vandanam | tail of the list | unchanged: `brahmaṇe`, `viṣṇave`, then optional `rudrāya`, `yamāya` | R7 and V add `mṛtyave namaḥ` after `viṣṇave`; R7 notes that `rudrāya namaḥ` is in one book only | **`mṛtyave namaḥ` not added: it is in none of the clean extractions — owner to supply** |
| narmada-vandanam | status and facing | core for Smārta; east morning and noon, west in the evening (S2 p.43; R7 item 33; V) | optional, "some families add this step" | not in S1. R7: face the Narmadā, i.e. north for South India |
| surya-narayana-vandanam | `namo brahmaṇya devāya` | hidden by default for Smārta | shown to everyone, described as optional in a note (Kidambi) | S2 has it at the start of the japa part (p.20) |
| abhivadanam-2, samarpanam, samapti | order at the end | samarpaṇam → ācamanam (new step `acamanam-3`) → japa-place prokṣaṇam → brahmārpaṇam (S1 p24–26; S2; R7 items 36–39; V) | ācamanam right after the second abhivādanam and again after brahmārpaṇam (earlier app text) | Kidambi's own end order (see the samapti row above) is still not applied |
| samarpanam, samapti | evening facing | north (S1 p24–26; R7 general note) | west | |
