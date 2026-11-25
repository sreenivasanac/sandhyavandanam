# Source check: Sandhyāvandanam app vs. trusted sources

Checked 2026-11-25. App content: `app/src/content/parts/{purvanga,gayatri,uttaranga}.json` (36 steps).

## Sources and how they were read

| # | Source | How read | Short name |
|---|---|---|---|
| 1 | `Sandhyavandanam.pdf` (26 pp, Smārta Āpastamba, "proof-read by … Mumbai vādhyārs") | Repo extraction `docs/reference/clean/Sandhyavandanam.md`. The file is byte-identical to the one in `/Users/sreenivasanac/tasks/sandhyavandanam/`, and its English and ASCII lines are clean. | **S1** (page = PDF page) |
| 2 | `sandhyavandanam-1.pdf` (67 pp scan), "Yajurveda Trikala Sandhyavandanam, Āpastamba & Bodhāyana" | All 67 pages read as images (a sub-agent did this; full notes in `src2-notes.md` beside this file). PDF p.1 = book p.15. | **S2** (p. = PDF page) |
| 3 | `334439492-…-rev7-pdf.pdf` (12 pp, compiled by Prof. K. Ramesh, IIT Madras) | `pdftotext`. The English is readable; the Sanskrit is in a garbled font. Items are numbered 1–39 plus a "General Instructions" box and "Compiler's Notes". | **R7** (item no.) |
| 4 | Video RkLJ9Lh2Jcs (T S Ranganathan) | The only caption track is **Hindi auto-generated ASR**. It renders the English narration phonetically in Devanagari ("राइट हैंड", "रिंग फिंगर"), so English instructions are only fragmentary. Mantras are recognisable, which makes it usable for **step order, counts and timestamps**, not for posture wording. YouTube refused machine translation. Raw file: `vid/tr.txt`. | **V** (seconds) |
| 5 | Fillers: `18663569-Yajurveda-Sandhyavandanam.pdf` (Chakravarthy, illustrated), `sandhya.pdf` (Pandit Sri Rama), `sandhyaavandanam.pdf` (Kidambi, Śrī Vaiṣṇava) | Repo extractions in `docs/reference/clean/` | **Ch**, **SR**, **Ki** |

Notes on the video structure, inferred from the mantras heard:
- Narrated instructions run from 0:00 to about 9:20. They cover props from about 90 s, then ācamana, aṅga-vandana, Gaṇapati, prāṇāyāma and saṅkalpa.
- **Morning** sandhyā is performed from **573 s to about 1466 s**.
- Samidādhāna follows, from about 1470 to 1830 s.
- **Noon** runs from **about 1830 s to about 2700 s**.
- Brahma-yajña and deva-ṛṣi-pitṛ tarpaṇa run from about 2700 to 3030 s.
- **Evening** runs from **about 3036 s to about 3930 s**.
- Evening samidādhāna and yajñopavīta dhāraṇa run from about 3930 s to the end.

Conventions: "not found in X" means I looked and X is silent. **[own]** marks my own inference or summary, not a source statement.

---

## 0. The findings most worth acting on (summary)

1. **Arghya at noon is 2, not 1.** S1 p7 says "three times for prātha and sāyam sandhyā but only two times for mādhyāhnikam". S2 p.13 and R7 item 9 also say 2, and V has two Gāyatrī-arghyas at 1994 s and 2005 s. The app says "Make this offering once" (madhyahnika, repeat 1).
2. **Prāyaścitta-arghya is a routine step in all four main sources**, not "only if late":
   - S1 p8 gives "kālātīta prāyaścittārtham…" with no condition.
   - S2 p.14–15 prints it as a normal step.
   - R7 item 11.
   - V has it in all three kālas (morning 814–836 s, noon 2039–2061 s, evening 3290–3313 s).
   
   Only the filler SR says "If the Sandhyā is being done after the Sun has already risen". Recommend showing it by default, explained as covering any delay. The **turīya** name and the "sāndīpanī ṛṣiḥ" nyāsa line come from Ki only.
3. **No prāṇāyāma, saṅkalpa or nyāsa before the main arghya** in S1, S2, R7 or V. In all four, the order is punar-mārjanam → arghya → prāṇāyāma → prāyaścitta saṅkalpa + arghya. The app's arghya pre-sequence comes from the fillers SR, Ch and Ki.
4. **Prāṇāyāma mantra–breath mapping is wrong in the app.** S1 and S2 both have you inhale through the left nostril with the vyāhṛtis, hold with the Gāyatrī, and exhale through the right with "āpo jyotī". The app says to recite the whole mantra while holding. The app also starts with an exhale through the right, which none of S1, S2 or R7 has. S1 **does** say "close both the nostrils and hold".
5. **The Gāyatrī-with-vyāhṛti prelude in Prokṣaṇam is in none of S1, S2, R7 or V.** Only Ki (Śrī Vaiṣṇava) has it. The app already tags it srivaishnava, so keep it there.
6. **The ṛṣi/chandas/devatā nyāsa lines for prokṣaṇam, prāśanam (incl. "sūryaścety anuvākasya agnir ṛṣiḥ"), punar-mārjanam, arghya, prāyaścitta, upasthānam and sūryopasthānam are in none of S1, S2, R7 or V.** Ki has them all; Ch has some. Candidates for "optional / some families". The main sources do have nyāsa for: praṇava + vyāhṛtis (S1, S2, R7, V), āyātu (S1, S2, R7, V), sāvitryā/viśvāmitra before japa (S1, S2, R7, V) and āsanam (S2).
7. **Tilakam is core, not optional.** It is in S1 p4, S2 p.6–7, R7 item 5 and V about 649 s ("om śrī keśavāya namaḥ" right before āpo hi ṣṭhā). The app's "Trace the mantra on the water" should be "write *oṃ* on the water" (S2, R7).
8. **Narmadā-sarpa vandanam is in S2 (p.43), R7 (item 33) and V (about 1301 s).** Only S1 lacks it. Don't hide it for Smārtas.
9. **Gaṇapati dhyānam at the start of the japa part is core** in S1 p12, S2 p.22, R7 item 18 and V (930 s). The app has it only inside the optional `uttaranga-acamanam` step.
10. **Gāyatrī-japa count:** S1 p16, S2 p.30 and R7 item 23 all say **108 morning / 32 noon / 64 evening**. The app offers 108/28/10 as one global choice. Recommend per-kāla defaults of 108/32/64, with 28 and 10 as reduced options (fillers).
11. **Facing in the evening:** S1 and R7 say north for ācamanam through tarpaṇam, except arghya, which faces west. The app's `acamanam` says the evening faces east until arghya. R7 explains it: "As achamanam cannot be done facing west, in the evening do items 1–16 facing north except arghyam."
12. **Order at the end:** S1, S2, R7 and V all put **ācamanam after samarpaṇam** (kāyena vācā), then the japa-place prokṣaṇam, then brahmārpaṇam. The app puts ācamanam inside `abhivadanam-2`, before samarpaṇam.
13. **Evening arghya is done sitting** (S2 p.13 and R7 item 9). The app says "Stand upright" for all kālas.
14. **The ācamanam hand shape in the app contradicts S2 and R7.** The app keeps three fingers straight with the index bent. S2 says fold the forefinger to the thumb and bend the other three into a hollow. R7 says "Bend all the fingers except the thumb and the little finger".

---

## A–D per step (app order)

Key: ✔ = present, ✘ = not found, ~ = present but different.

### 1. `before-you-begin`
- **A.** S1 has no preparation section. Its ācamanam line names the props: "Sit on a plank with a Panchapatram (or tumbler) in front, full of water and a spoon or UddharaNi" (p1). S2's preparation pages are missing from the scan. R7 has a "General Instructions" box. V narrates the props at about 90–270 s. Keep as is.
- **B.** No contradictions.
  - "Room to stand and to turn all the way around" is supported: S1 p8 has you turning "on the spot clockwise one round".
  - Upper cloth: R7 general note 4 says "Even for Brahmacharis – two vastrams are needed". V (about 210–235 s) mentions a dhoti of about 4 m and an "upavastram / uttarīyam" that is mandatory for gṛhasthas (ASR, approximate).
  - Water: R7 note 3 says "A single panchapatram water is not sufficient … keep a pot full of water nearby". Suggest adding a small pot or kalaśa of extra water.
  - R7 note 5: keep "a separate panchapatram, asanam etc.". Optional advice.
- **C.** "Gather what you need and settle into a clean place, so the rite runs without interruption." [own]
- **D.** See the Props section below.

### 2. `acamanam`
- **A.** Core in all four (S1 p1, S2 p.1, R7 item 1, V 573 s).
- **B.**
  - (i) **Posture.**
    - App: "Squat or sit low on your heels (kukkuṭāsana)".
    - S1: "Sit on a plank" (p1).
    - S2 text: "performed in a sitting posture, facing north or east" (p.1). S2's drawing, though, shows squatting on the heels.
    - R7: "Do this sitting facing east or north. The hands should be between the knees" (item 1). "Hands between the knees" fits a squat or knees-up sit [own].
    - SR (filler) is the one that names it: "sit or squat in kukuṭāsana".
    - Proposed: "Sit on your plank or squat on your heels, knees up, with your hands between your knees."
  - (v) **Hand shape.** The app's "keep the little, ring and middle fingers straight and bend the index finger inward" is contradicted twice:
    - S2: "Fold the forefinger … and join it with the thumb … Bend the other three fingers to form space enough for a uddharani … full of water" (p.1).
    - R7: "Bend all the fingers except the thumb and the little finger" (item 1).
    - Proposed: "Cup your right palm: bend the index finger to the base of the thumb and curl the other fingers to make a hollow that holds one spoonful."
  - **Amount.** S2 says one uddharaṇi full. R7 says "a very small quantity". S1 says "a few drops".
  - **Lips.** The app's "wipe your lips with the right thumb, right to left": R7 says "Put little water on the base of thumb and wipe the mouth. Repeat this twice. Clean the palm." R7's compiler notes add that "only a few follow it". S1 and S2 don't mention it. Suggest marking it optional.
  - (iv) **Evening facing.** The app has the evening facing east until arghya. S1 says "North for sāyam sandhyAvandanam" (p1, p6, p9). R7's general note says evening items 1–16 face north, except arghya. Proposed: "Evening: face north until tarpaṇam, except arghya, which faces west."
  - Noon facing: S1 and R7 say east; SR (filler) says north.
- **C.** "Inner cleansing: purify body, speech and mind by sipping water with the Lord's names before worship."
  - R7 glosses ācamana as "clean the interior by sipping of water with mantra".
  - SR gives "purification of body, speech and mind".
- **D.** Squat on the heels on a mat (or sit on a low plank), facing east.
  - The pañcapātra/tumbler and a plate sit on the floor in front, slightly to the right.
  - The left hand holds the uddharaṇi and pours one spoonful into the cupped right palm, which is raised to the lips.
  - Eyes look down at the palm.
  - This matches the S2 p.1 drawing: feet flat on a checkered mat, knees to the chest, buttocks off the floor, tumbler and plate front-right.

### 3. `anga-nyasam`
- **A.** Core: S1 p1–2 (full table), S2 p.2–3, R7 item 1, V 590 s.
- **B.**
  - The finger map matches S1 exactly: thumb for the cheeks, ring finger for the eyes, index for the nose, little finger for the ears, middle finger for the shoulders, all fingers for the navel ("Belly button") and the head.
  - The app's thumb on the middle of the finger is supported. R7: "the thumb should be touching the middle of the respective fingers". S2: "the thumb touching the respective fingers".
  - S2 p.3 is internally inconsistent: its gloss says "heart", its table says navel. S1 says navel. Keep navel.
  - The app's "This continues the ācamanam" is fine.
- **C.** "Outer cleansing: touch the senses and limbs with the Lord's names so that the whole body is purified and protected."
  - R7 glosses it as "clean the exterior by touching the various organs chanting divine name".
  - S2: "strengthens the limbs of the body and shields them" (p.3).
  - The app's "makes your body a temple of God" is not from S1–S4 [own].
- **D.** Same squat or seat, eyes ahead or half-closed. Right hand only. Close-up frames per touch: thumb on the right cheek; ring-finger tip (thumb on its middle joint) on the right eye; and so on. Left hand rests on the left knee.

### 4. `vighna-apaharanam`
- **A.** Core at the start: S1 p2, S2 p.4, R7 item 2, V 600 s and 366 s narration ("five times").
- **B.** Matches S1: "Gently hit the temple with the knuckles five times in all". The app's "nectar … spreading" is supported by R7: "Imagine that the nectar in the head flows down through all the nerves".
- **C.** "Remove obstacles: invoke Gaṇapati so that the rite proceeds without hindrance." S2: "to keep off all impediments" (p.4).
- **D.** Seated or squatting, both hands in loose fists, knuckles tapping both temples together. Eyes closed or soft.

### 5. `pranayamam`
- **A.** Core (S1 p2–3, S2 p.4–5, R7 item 3, V 615 s; narration at 383–419 s).
- **B.**
  - (ii) **Fingers.**
    - S1: "Touch the right nostril with the right thumb and the left nostril with the right ring finger".
    - S2: "Fold the index and the middle fingers. Press the right nostril with the thumb and the left with the ring and little fingers."
    - The app matches S2. Fine.
  - (ii) **Order.**
    - The app's first two lines ("Close the left nostril and breathe out slowly through the right" first) are **not in S1, S2 or R7**.
    - S1: "gently press the right thumb … and inhale through the left nostril with the following mantra" (vyāhṛtis).
    - R7: "Start inhalation from left nostril".
    - Proposed: remove the opening exhale.
  - (ii) **What is said when.** The app says "recite the mantra silently in your mind while holding your breath". The sources split it:
    - S1 says to inhale with "oṃ bhūḥ … satyam"; then "Now close both the nostrils and hold the breath" with "oṃ tat savitur…"; then "leave the right thumb and exhale" with "om āpo jyotī…" (p2–3).
    - S2 splits it the same way: "Inhale … chanting mentally, the first part … Hold the breath during the second part and breathe out … chanting the third part" (p.4–5).
    - R7 gives a beginner form (inhale with I, exhale with II + III) and an advanced 1:3:2 form.
    - Proposed: "Close the right nostril with the thumb and breathe in through the left while saying *oṃ bhūḥ … oṃ satyam* in your mind. Close both nostrils and hold while saying *oṃ tat savitur … pracodayāt*. Release the thumb and breathe out through the right while saying *oṃ āpo jyotī … suvarom*. Touch your right ear."
    - The item action "Recite silently while holding your breath" (used in several steps) needs the same fix.
  - **"Close both nostrils".** Supported by S1, explicitly, four times. In S2 it is only implied by the hand.
  - **Rounds.** The app's "do three rounds" is not in S1, which describes one prāṇāyāma at each point. S2 also has one at most points; at the step before japa, its heading says "10 times" but its note says three. R7 says "Do Pranayamam 10 times" before japa only. Proposed: one at each point, with 3 (or 10) before the japa.
  - **Ear touch.** Supported: S2 says "(touch the right ear.)", R7 says "Touch the right ear with right hand palm".
  - **Left hand.** The app's "palm up, thumb and index finger touching" on the left thigh is from Ch (filler): "The thumb and first finger of the left hand should be in contact … palm facing skywards". Not found in S1, S2 or R7.
- **C.** "Steady the breath and the mind with the Gāyatrī before resolving to worship." R7 labels it only "Regulation of breath"; the rest is [own].
- **D.** Seated cross-legged or squatting, spine upright, eyes closed.
  - Right hand at the nose: index and middle fingers folded into the palm, thumb on the right nostril, ring and little fingers on the left nostril.
  - Left hand on the left knee or thigh, palm up.
  - S2's drawing shows the right hand at the nose and a second panel with the palm cupped over the right ear.

### 6. `sankalpam`
- **A.** Core (S1 p3, S2 p.6, R7 item 4, V 634–649 s; narration at 462 s mentions "left … right leg").
- **B.**
  - The app's "Take the saṅkalpa posture from the previous step" points to nothing: the previous step doesn't describe it.
  - S1: "Keep the left palm on the right thigh with palm facing upwards and keep the closed right palm over the left palm" (p3). R7 and S2 say the same.
  - Proposed: put that sentence in this step.
  - The app's "wash your right palm afterwards" is supported by R7: "After any sankalpam wash the right palm with water".
  - The detailed pañcāṅga saṅkalpa is not found in S1, S2 or R7, which use the short form only. Fine as a setting.
- **C.** "Resolve: state what you are about to do and why — to remove accumulated faults and please the Lord."
  - S2: "to be worthy of God Parameshvara's grace, by destroying all the sins" (p.6).
  - R7: "determination to do an action … the Lord Parameshwara is the Phaladhata".
- **D.** Seated cross-legged. The left palm lies face-up on the right thigh, the right palm (closed or cupped) rests face-down over it. Eyes forward. The S2 p.6 drawing is seated cross-legged.

### 7. `satvika-tyagam` (Śrī Vaiṣṇava)
- **A.** Not found in S1, S2, R7 or V; all four are Smārta. It is in Ki (filler) only. It is already tradition-gated; keep it as is.
- **B.** Nothing to check against the main sources.
- **C.** "Acknowledge that the Lord Himself is doing this worship through you, for His own pleasure." This paraphrases the mantra; [own].
- **D.** Seated, palms joined at the chest.

### 8. `tilakam` (marked optional in the app)
- **A.** **Core** in S1 p4 ("put a tilak on the middle of your fore head with your right ring finger wetted by the water"), S2 p.6–7, R7 item 5 and V about 649 s. Recommend removing `optional`.
- **B.**
  - The app's "If you did not apply the tilakam after your bath, apply it now" makes it conditional. Only SR (filler) says that ("If urdhva-pundram was not applied after bath"). S1, S2 and R7 do it unconditionally with water.
  - "Trace the mantra on the water" should be: write the syllable **oṃ** on the water.
    - R7: "Write the letter ॐ on the uddarani water using ring finger and touch the space between the eyebrows".
    - S2: "after writing 'om' on the water".
  - **Place.**
    - S1: "middle of your fore head". R7: "the space between the eyebrows".
    - App: "middle of your forehead". Fine; mention the R7 variant.
  - SR (filler) uses the middle finger. S1, S2 and R7 use the ring finger, as the app does.
  - S2 adds a water prayer ("āpo vā idagṃ sarvam") here. It is in S2 only.
- **C.** "Mark yourself with consecrated water as a sign that you now stand before the Lord." [own]. S2's gloss: "brings out the importance of water, representing it as the essence of everything" (p.7).
- **D.** Seated or squatting. The right ring finger dips into the water in the uddharaṇi (held in the left hand, or resting in the pañcapātra) and writes ॐ on the surface. Then the wet ring finger touches the middle of the forehead between the eyebrows. Eyes look at the vessel, then close.

### 9. `prokshanam`
- **A.** Core (S1 p4, S2 p.7–8, R7 item 5, V 651–678 s). The items the owner doubts:
  - **Gāyatrī-with-vyāhṛti prelude** (srivaishnava item): ✘ in S1, S2, R7 and V (V goes straight from the tilak at 649 s to āpo hi ṣṭhā at 651 s). It is in **Ki only** (Table 4 "Prelude to prokṣaṇa mantram"). Keep it Śrī-Vaiṣṇava-only, or make it optional.
  - **"āpo hiṣṭheti mantrasya sindhudvīpa ṛṣiḥ…" nyāsa:** ✘ in S1, S2 and R7. Not audible in V. It is in **Ki and Ch** (fillers). Make it optional.
- **B.**
  - The app's todo "Hold the vessel in your left hand … do the nyāsa" adds the nyāsa, which S1, S2 and R7 don't have.
  - **Sprinkling finger.** The app says "with your right fingers". S1 says "using your right ring finger"; S2 says "using the ring finger". Proposed: "with your right ring finger".
  - **Count.** S1: "sprinkle seven times on your head and the face". The app says "on your head". Proposed: "on your head and face".
  - **yasya kṣayāya.** The sources disagree:

    | Source | Where the water goes |
    |---|---|
    | App | "big toes" |
    | S1 | "Now sprinkle water on your knees/leg" |
    | S2 | "Touch the right and left thighs" (prokṣaṇam); "on feet" (punar-mārjanam) |
    | R7 | "Sprinkle water on the feet" |
    | SR | "on the feet" |
    | Ch | "Big Toes" |

    Proposed: "sprinkle on your feet (S1: knees/legs)".
  - **Final bhūr bhuvas suvaḥ.**
    - S1: "sprinkle water around you in clockwise direction".
    - R7: "rotate the palm around the head to sprinkle water around the body".
    - The app matches.
- **C.** "Purify body and mind with water, invoking the waters as nourishing mothers."
  - R7: "Prayer for the purification of the body and mind".
  - S2: "Cleansing of the mind and the body".
- **D.** Seated or squatting.
  - The uddharaṇi with water is in the left hand (SR); in S1 the water is taken from the tumbler.
  - The right ring finger dips and flicks drops onto the crown and face at each phrase, then onto the feet or knees, then the crown again.
  - Finally the right palm holds a little water and circles clockwise around the head.
  - Eyes are lowered or closed.

### 10. `prasanam`
- **A.** Core (S1 p4–5, S2 p.9–11, R7 item 6, V 679 s). The **nyāsa lines ("sūryaścety anuvākasya agnir ṛṣiḥ…", the noon and evening equivalents)**: ✘ in S1, S2 and R7; V goes straight into "sūryaśca" at 679 s. In **Ki only**. Make them optional.
- **B.** Otherwise the app matches: water in the right palm, recite, drink, then ācamanam. S1 has ācamanam right after prāśanam (p5–6), as do S2 and R7.
- **C.** "Atone: ask that the faults of the past night (or morning or day) be burnt away, and offer yourself into the inner light." R7: "Prayer for removal of sins committed in the previous part of the day".
- **D.** Seated or squatting. Cupped right palm with one spoonful of water held at chest level during the mantra, then raised to the lips. The left hand holds the uddharaṇi.

### 11. `punar-marjanam`
- **A.** Core (S1 p6–7, S2 p.12–13, R7 item 8, V about 730–755 s). The "dadhikrāvṇṇa iti mantrasya vāmadeva ṛṣiḥ" nyāsa: ✘ in S1, S2 and R7. In Ki only. Make it optional.
- **B.**
  - "Sprinkle four times with the four pādas, then seven" is roughly supported.
    - S1 says "sprinkle seven times on your head and the face" for the whole block, dadhikrāvṇṇo included.
    - S2 says "Sprinkle water on head after every line".
    - The count is not fixed across sources; leave as is.
  - Same finger fix (ring finger) and feet/knees note as in Prokṣaṇam.
- **C.** "Purify again, asking that face and senses be made fragrant and life long." R7: "Prayer for face and other organs to be fragrant and for long life".
- **D.** As in Prokṣaṇam.

### 12. `arghya-pradanam`
- **A.** Core (S1 p7, S2 p.13, R7 item 9, V 760–789 s). The pre-sequence items the app adds — prāṇāyāma, saṅkalpa ("…arghyapradānaṃ kariṣye"), "arghyapradāna mantrasya viśvāmitra ṛṣiḥ" nyāsa, and "oṃ sūryāya namaḥ idam arghyam" — are all ✘ in S1, S2 and R7, and not heard in V.
  - The saṅkalpa and prāṇāyāma come from SR, Ch and Ki.
  - The ṛṣi line comes from Ch and Ki.
  - "sūryāya namaḥ idam arghyam" comes from SR.
  - Recommend making the whole pre-sequence optional ("some families").
- **B.**
  - (iii) **Count.** The app gives noon as "once". S1, S2, R7 and V all say **twice at noon** (see the summary). Fix the todo and `repeat`.
  - (iv) **Standing or sitting.**
    - The app says "Stand upright" for all kālas. S1 doesn't say.
    - S2: "three times in the morning (stand facing East) and evening (sit facing west) and twice at noon (stand facing North)".
    - R7: "Morning (East – standing), evening (West – sitting) 3, Noon (East – standing/sitting) 2".
    - Proposed: "Morning: stand. Noon: stand (or sit). Evening: sit, facing west."
  - (iv) **Facing.** S1 and R7 say east at noon; S2 says north. The app says east. Keep east and note the S2 variant.
  - (v) **Hands.**
    - S1: "Hold water in the palm in both the hands … and pour the water on the floor".
    - S2: "Take plenty of water in both hands raising the heels a little, and let it flow down through the finger tips other than the thumb".
    - R7: deva-tīrtha, "Use large quantities of water".
    - The app's "thrown up towards the sun" comes from Ch (filler): "throw the water up in the air". S1, S2 and R7 say pour or let it flow down.
    - Proposed: "Raise your joined palms full of water, heels slightly lifted, look toward the sun, and let the water flow down from the fingertips (not over the thumb) onto the plate."
  - **"Recite the Gāyatrī aloud".** Ch: "Recite gayathri mantra verbally". S1, S2 and R7 don't say. Fine.
  - **"Look towards the sun".** Ch supports it. S1, S2 and R7 are silent; the S2 drawing shows arms straight forward, gaze forward.
- **C.** "Offer water to the Sun to dispel the darkness (inner sloth and ignorance) that hides true knowledge."
  - R7: "Water poured turns into a vajrayudha and fights laziness which obscures Divine Knowledge".
  - Ch: "bring light / eliminate darkness".
- **D.** Standing on a mat (seated, facing west, in the evening), facing the sun.
  - Both palms joined, cupped side by side and full of water, arms raised forward to face or forehead height.
  - Heels slightly lifted.
  - Water streams from the fingertips onto a plate on the floor in front.
  - The uddharaṇi or tumbler is held in the left hand between thumb and index finger while scooping (Ch); the vessel is on the floor.
  - Eyes toward the sun.
  - The S2 drawing: a man standing in profile, both arms straight forward at shoulder height, water falling to a plate at his feet, heels slightly raised.

### 13. `prayascitta-arghyam` (optional in the app)
- **A.**
  - The step itself: ✔ in S1 p8, S2 p.14–15, R7 item 11 and V (all three kālas), as a **routine step**. Recommend not hiding it by default.
  - The **turīya** name: ✘ in S1, S2 and R7. SR says "turiya arghya"; Ki says "turīya arghyapradānaṃ".
  - "turīya arghyapradāna mantrasya **sāndīpanī ṛṣiḥ**": Ki only.
  - The mantra: S1 uses the plain Gāyatrī with vyāhṛtis, the same as the main arghya ("om bhūrbhuvaha suvaha | oM tatsavitur…"). R7: "Do one arghyam as in 9". The app's item uses the long prāṇāyāma-style mantra (all seven vyāhṛtis + Gāyatrī + vyāhṛtis again). That form is from Ch ("Offer only one arghyam: Om Bhu … Om Satyam || ") and is not in S1 or R7. S2 p.15 says "Repeat arghya pradanam once", i.e. the same as the main arghya.
- **B.**
  - The app's "Do this step only if you are doing the sandhyā late" is supported only by SR. S1, S2, R7 and V do it always.
  - The app's noon line "only some families" is not supported: S1 gives noon facing, and V does it at noon (2039–2061 s).
  - Prāṇāyāma before it is supported (S1 p7–8, S2, R7 item 10, V 790 s).
- **C.** "Atone for any delay in the offering, since the arghya belongs to the exact junction of day and night." S2: "Offering of water for belated oblation". R7: arghya should be offered "before sunrise … before crossing the zenith … before sunset".
- **D.** As in the main arghya.

### 14. `brahma-bhavanam` (ātma-pradakṣiṇam + asāvādityo)
- **A.** Core (S1 p8, R7 items 12–13, V about 836–841 s; S2 p.15 in part).
- **B.**
  - The turning on the spot is supported.
    - S1: "moving yourself on the spot clockwise one round … with few drops of water in your palm and pour it".
    - R7: "throw it round the head in a clockwise direction … and simultaneously turn around oneself".
    - S2 has only water circled round the head, with no body turn.
  - **Hands for the meditation.**
    - The app has you face the sun with palms joined in añjali.
    - R7: "Touch the chest with all the 10 fingers of both hands … Do not rush up! Spend a minute or two on this meditation with closed eyes".
    - S2's drawing shows both hands at the chest, fingers turned toward the body.
    - Proposed: "Place the fingertips of both hands on your chest, close your eyes and meditate."
  - **Evening facing.** S1 says north for dhyānam ("NorthsAyam").
- **C.** "Realise that the light in the Sun and the Self within are one."
  - R7: "Meditation on the identity of the Individual Self and the Supreme Self".
  - S1: "meditate for a while that you and Brahma are the same".
- **D.**
  - Standing. The right palm holds a little water and circles clockwise over the head while the body turns once clockwise on the spot; drops fall around.
  - Then stand or sit still, facing east, with the fingertips of both hands on the chest and eyes closed.

### 15. `acamanam-2`
- **A.** Core (S1 p9, S2 p.15, R7 item 14, V 845 s).
- **B.** Same posture and hand fixes as step 2.
- **C.** "Re-purify before the offerings to the deities." [own]
- **D.** As in step 2.

### 16. `tarpanam`
- **A.** Core (S1 p9–10, S2 p.16–18, R7 item 15, V 861–903 s).
  - Smārta: navagraha + 12 Keśavādi in all four.
  - The app's Śrī-Vaiṣṇava "12 names only" comes from Ki.
  - "oṃ tat sat brahmārpaṇam astu" after tarpaṇam: S2 p.18 ends part 1 with "mayā kṛtam idam sarvam karma oṃ tat sat brahmārpaṇam astu". S1 has it only at the very end (p26). R7 doesn't have it here. Fine as is.
- **B.**
  - (i) The app's "Squat or sit low (kukkuṭāsana)": S1, S2 and R7 don't state a posture. The S2 drawing shows it done from the same low posture.
  - (v) **Hands.**
    - App: both palms joined, water from both hands' fingertips.
    - S1: "pour water from the palm".
    - S2: "let it flow down through the finger tips of right palm"; the drawing shows the left hand pouring from the spoon into the right palm, fingers down over the plate.
    - R7: "use as much water as possible".
    - Ch (filler) uses both palms.
    - Proposed: "For each name, pour a spoonful into your right palm (or both joined palms) and let it run off the fingertips onto the plate."
  - **"Twelve names are forms of Viṣṇu, one for each month."** Supported by S2: "the twelve months commencing from Margasheersha" (p.18).
- **C.** "Satisfy and thank the planets and the Lord's twelve forms, who govern time." Ch: "Thanks for benefits received". R7: "Offering of water to please the devas". The "who govern time" part is [own].
- **D.** Squatting or seated.
  - Left hand pours a spoonful from the uddharaṇi into the right palm.
  - Right hand tilted fingers-down over the plate, water running off the four fingertips.
  - Tumbler beside the plate. Eyes on the hand.

### 17. `asanam` (japasthala prokṣaṇam + āsana mantra)
- **A.**
  - Prokṣaṇa of the japa place: R7 item 17 ✔ (mantra unreadable). ✘ in S1 (Part II starts with Gaṇapati dhyānam). ✘ in S2 (āsanam only). Not heard in V (morning 903–960 s).
  - Āsana mantra "pṛthvi tvayā dhṛtā": ✔ in S2 p.21–22 (with the merupṛṣṭha ṛṣi line). ✘ in S1 and R7 (unreadable if present). Not heard in V.
  - "apasarpantu" prayer: ✔ in S2 p.20–21, as a Śiva prārthanā before japa. ✘ in S1 and R7. Optional is right.
  - Verdict: **only S2 has it** among the main sources, so it is a candidate for optional.
- **B.**
  - The app's "Stand on the sprinkled spot" is contradicted by S2: "Sit down to start the japa" (p.21).
  - S2 adds: "With the ring finger first touch the floor (ground) then the forehead in the middle area of the eyebrows" while saying pṛthvi tvayā.
  - Proposed: "Sit on the sprinkled spot. Touch the floor with the right ring finger, then the point between your eyebrows, while saying pṛthvi tvayā."
- **C.** "Sanctify and steady your seat, asking the Earth that bears all to bear you through the japa." This paraphrases the mantra; [own].
- **D.** Seated cross-legged on the mat. The right ring finger touches the mat, then the brow. Eyes lowered.

### 18. `uttaranga-acamanam` (optional)
- **A.**
  - Ācamanam at this point: V has an ācamanam at 903 s, right after tarpaṇam, then Gaṇapati at 930 s. S1, S2 and R7 also put the ācamanam right after tarpaṇam, i.e. end of Part I. The app already does an ācamanam after tarpaṇam (note in `tarpanam`), so this optional repeat is redundant.
  - **Gaṇapati dhyānam at the start of the japa part is core:** S1 p12 (Part II opens with it), S2 p.22, R7 item 18, V 930 s.
  - Recommend: drop the optional ācamanam, and make the Gaṇapati verse a non-optional item at the start of `japa-sankalpam`.
- **B.** As above.
- **C.** "Begin the second, inner part of the rite free of obstacles." [own]
- **D.** As in steps 2 and 4.

### 19. `japa-sankalpam`
- **A.** Core (S1 p12–13, S2 p.23–24, R7 items 19–20, V 940–970 s).
- **B.**
  - The app's "Do prāṇāyāma three times" contradicts S1 p12, which has a single prāṇāyāma before this saṅkalpa (as does R7 item 19). The count is unspecified in S2. Proposed: "Do prāṇāyāma once."
  - **Counts.** S1 p16, S2 p.30 and R7 item 23 all give 108/32/64 (see summary). The app's 28/10 options come from SR.
  - **Evening facing.** S1 p13 says "West for sāyam" for this saṅkalpa.
- **C.** "Resolve to do the Gāyatrī japa, and say how many times." Gloss as in saṅkalpa.
- **D.** As in saṅkalpa.

### 20. `pranayama-nyasam`
- **A.** Item by item:

  | Item | S1 | S2 | R7 | V | Fillers |
  |---|---|---|---|---|---|
  | Praṇava ṛṣi / chandas / devatā | ✔ p13–14 | ✔ p.24 | ✔ item 21 | ✔ about 977 s | |
  | Vyāhṛti ṛṣis / chandas / devatās | ✔ | ✔ | ✔ | ✔ 984–1012 s | |
  | Gāyatrī nyāsa here (sāvitryā / viśvāmitra) | ✘ here (it comes after āvāhana, p15–16) | ✘ here (p.28, after āvāhana) | ✔ but "not widely practiced … one may choose not to chant these" | ✘ here (heard at 1073 s, after āvāhana) | |
  | Gāyatrī-śiras ṛṣi line | ✘ | ✘ | Same R7 caveat | ✘ | **optional** |
  | "sarveṣāṃ prāṇāyāme viniyogaḥ" | ✘ | | R7 "prāṇāyāme viniyogaḥ" ✔ | | |
  | muktāvidruma dhyāna | ✘ | ✔ p.28, after āvāhana and Gāyatrī nyāsa | ✘ | not heard | |
  | "oṃ āpo jyotī" body touch | ✘ | ✘ | ✘ | | |
  | arkamaṇḍala verse | ✘ | ✘ | ✘ | | Filler/other only → **optional** |
  | Prāṇāyāma after nyāsa | once (S1 p14) | "three … nine times" (p.25) | "10 times" | once (1012 s) | |
- **B.**
  - **Touch points.**
    - App: "top of your head / tip of nose / heart".
    - S1: "Keep the fingers at the forehead … at the nose … below the heart at the centre".
    - S2: head / nostrils / chest.
    - R7: head / "upper lip/nose" / "Touch the chest with both hands".
    - Ch: "four fingers … placed at the top of the head".
    - Fine. Optionally note S1's "forehead" and R7's both hands on the chest for the devatā.
  - **Order.** S1, S2 and V place the Gāyatrī ṛṣi line (viśvāmitra) **after** āvāhana, right before japa. The app already repeats it in `gayatri-japam`, so the copy here is the R7 form.
- **C.** "Remember the seer, metre and deity of each mantra before using it."
  - R7: "Mantras are more effective if these are remembered before chanting it. By touching the head you mentally bow to the rishi…".
- **D.** Seated cross-legged. The right fingertips touch the crown (or forehead), then the upper lip or nose tip, then the palm on the centre of the chest (R7: both palms on the chest). Eyes closed.

### 21. `gayatri-avahanam`
- **A.** Core (S1 p15, S2 p.25–27, R7 item 22, V 1038–1068 s, including "āyātv ity anuvākasya vāmadeva ṛṣiḥ").
- **B.**
  - The āvāhana mudrā is supported by S2 ("turn or rotate the palms together inwards", p.26) and R7 ("Show the avahana mudra" × 3).
  - S1 just says namaskāra pose, "both the palms facing and touching each other and placed before the heart".
  - **Evening facing:** S1 says west.
- **C.** "Invite Gāyatrī to take her seat in the lotus of your heart." R7: "Prayer to Gayathri devi to occupy the lotus of the individual's heart".
- **D.** Seated, palms joined at the heart. At each āvāhayāmi, the joined palms open as if looking into them, then rotate inward toward the chest (S2 p.27 three-panel hand diagram).

### 22. `kala-dhyanam`
- **A.**
  - The kāla-specific verses ("prātar dhyāyāmi gāyatrīm…" etc.): ✘ in S1, S2 and R7. Not identifiable in V's captions between 1073 s and 1080 s, so no dhyāna is audible there.
  - S2 has one dhyāna for all kālas (muktāvidruma + "yo devaḥ savitā…", p.28–29).
  - Fillers SR and Ch have the kāla verses.
  - **Candidate optional.** If kept, the "yo devas savitā" verse has S2 support.
- **B.** Nothing contradicts; mostly unsupported.
- **C.** "Hold the form of the Goddess in the solar disc before the japa." S2: "contemplate on a single object of worship, the supreme Soul present in the Solar orb".
- **D.** Seated, palms joined, eyes closed.

### 23. `gayatri-japam`
- **A.** Core (S1 p16, S2 p.30–31, R7 item 23, V 1073–1140 s, starting with the "sāvitryā ṛṣir viśvāmitraḥ" nyāsa). The kara/aṅga-nyāsa block: ✘ in S1, S2, R7 and V. Optional is right.
- **B.**
  - **Count.** See summary: 108/32/64 in S1, S2 and R7.
  - **Nyāsa text.** S1 and R7 say "nicṛd gāyatrī chandaḥ". The app's nyāsa line says "devī gāyatrī chandaḥ". Text is out of scope, but this differs. R7's notes discuss both.
  - (iv) **Standing or sitting.**
    - App: morning and noon standing, evening seated.
    - R7: "Morning: Stand facing the east, the palms joined and held in front of your face … Noon: Stand or sit facing east … chest … Evening: Sit facing west … naval". The app matches R7.
    - S2: "Sit down to start the japa" (p.21).
    - S1 is silent.
    - Suggest: "Noon: standing or seated".
  - **Evening facing.** S2: "Evening … facing west before Sun set & east after Sun set" (p.30). Not in the app; add it as a note.
  - **Covered hands.** Supported by R7: "count using only hands covered with angavastram". S1 and S2 don't say.
  - **Counting.** The app has one hand for units and the other for tens. S2 describes counting on the right hand's finger lines: start at the middle line of the ring finger, go clockwise for 10 and anticlockwise back (p.30). Different; offer both.
  - **"Never aloud", mental.** R7: "Chant the mantra mentally". Supported.
  - **"Five pauses".** R7: "Japa should be performed with five pauses". The app's note says four sections. Check against R7.
  - **After japa.** S2: "After the Gayatree japa do pranayama once" (p.31). R7 item 24 and S1 p16 also have one prāṇāyāma.
- **C.** "The heart of the rite: meditate on the light that awakens the intellect, with mind and body already purified."
  - R7: "Central theme of the Sandhya Worship … purification of both the mind and the body as a precondition to do the Japa".
- **D.** Standing facing east (morning).
  - The upper cloth is draped over both hands, which are joined palms-toward-face in front of the face (morning), chest (noon) or navel (evening, seated).
  - The thumb counts on the finger-line joints under the cloth.
  - Eyes closed or half-closed.
  - The S2 counting-hand diagram is on p.30.

### 24. `ashtakshara-japam` (Śrī Vaiṣṇava, optional)
- **A.** ✘ in S1, S2, R7 and V (Smārta sources). Ki only. Already gated; keep it.
- **C.** "Repeat the eight-syllable mantra of surrender received from your teacher." [own]
- **D.** As in japa.

### 25. `gayatri-upasthanam` (udvāsanam)
- **A.** Core (S1 p17, S2 p.31–32, R7 item 25, V 1145–1180 s).
  - The "uttama ity anuvākasya vāmadeva ṛṣiḥ" nyāsa: ✘ in S1, S2 and R7. Not heard in V (the saṅkalpa at about 1166 s goes straight to "uttame śikhare" at 1174 s). Make it optional.
- **B.**
  - "Do prāṇāyāma three times" contradicts S1 (one), S2 ("do pranayama once", p.31) and R7 (item 24, one). Proposed: once.
  - **Standing up.** The app says "Stand up and do the nyāsa".
    - S1: "Uttering the following mantras get up with right ring finger touching the floor and after completion of mantra stand erect releasing the ring finger".
    - S2: "With the ring finger first touch the floor … then the forehead in the middle area of the eyebrows".
    - R7: "Stand up and chant with folded hands".
    - Proposed: "Touch the floor with your right ring finger and rise as you recite, then touch the ring finger to the point between your eyebrows and stand upright."
  - **The udvāsana gesture.** The app has you open the palms outward. S2 describes something different: "Twisting (locking) both the hands … rotate the clasped palms from inside … and release" (p.31). Not in S1 or R7.
- **C.** "Respectfully send Gāyatrī back to her abode." R7: "Request Gayathri devi to return to Her abode". S2: "Prayer to Gayatri to return to her seat".
- **D.** Rising from the seat: bent forward, right ring finger touching the mat; then standing, ring finger touching between the eyebrows; then palms joined. The S2 p.32 drawing shows a man standing and bending forward to touch the mat.

### 26. `surya-upasthanam`
- **A.** Core (S1 p17–21, S2 p.33–38, R7 item 26, V morning 1185 s, noon about 2411 s, evening about 3660 s).
  - The per-kāla ṛṣi/chandas/devatā lines ("mitrasyeti … viśvāmitra ṛṣiḥ" etc.): ✘ in S1, S2 and R7. Not heard in V. Fillers only → optional.
  - Morning upasthānam saṅkalpa: S1 p17 has "prātaḥ sandhyopasthānaṃ kariṣye" before uttame. The app has this in step 25. OK.
- **B.**
  - (iv) **Standing.** R7: "Stand up and recite with folded hands" (all three). S1: "Keep the hands folded in the pose of saying Namaskaram". OK.
  - **Noon facing.** S1 and R7 say east; S2 says "(Facing North)". The app says east. Add the S2 variant as a note.
  - **Noon mudrā.**
    - R7: "Recite the following looking at the sun using Galini mudra" (paśyema …).
    - S2: "see the sun through the gap created by locking up both the hands" (drawing: hands interlocked above the forehead).
    - S1: "See the sun and say" (placed before ya udagān).
    - The app's finger-by-finger vyoma/gālinī recipe: the source of that detail is not in S1, S2 or R7 (likely Ki or Ch).
  - **Evening facing.** West in S1, S2 and R7. OK.
- **C.** "Stand before the Sun as witness of all our deeds and pray for a long, clear-sighted life; at evening, ask Varuṇa's forgiveness."
  - R7: "The Sun guides all and He watches every one of our actions". Noon: "let us see Him for hundred years". Evening: "I have left doing the vedic karma … please don't get angry".
- **D.**
  - Standing, facing the sun, palms joined at the chest.
  - Noon only: hands raised above the forehead with fingers interlocked to leave a slit, eyes looking at the sun through it (S2 p.35 drawing).

### 27. `sandhyadi-devata-vandanam` (samaṣṭi-abhivādanam)
- **A.** Core (S1 p18–21, S2 p.38–39, R7 item 27, V 1219 s).
- **B.**
  - **Evening start.** The sources conflict:
    - App: begin facing west.
    - S2: "Evening: W, N, E, S, W".
    - R7: "Evening start from west".
    - S1 p21 for sāyam: "Facing east say sandhyāyai … south … west … north", then "Face West and utter: sarvābhyo devatābhyo".
    - The app follows S2 and R7. Add the S1 variant as a note.
  - R7: "worship with anjali mudra". Supported.
- **C.** "Bow to the goddess of the junctures in her forms and to all deities, asking pardon for what desire and anger made us do." R7: "Sins committed out of ignorance under the compulsion of desire or anger may please be forgiven".
- **D.** Standing, palms joined. A quarter-turn clockwise at each name, ending back at the start.

### 28. `abhivadanam`
- **A.** Core (S1 p21, S2 p.39–40, R7 items 28–29, V 1236–1251 s).
- **B.**
  - **Noon facing.** S1: "Face East for prāta sandhyāvandanam, north for madhyahnikam and West for sāyam" (p21, repeated p24). The app says east at noon. Proposed: noon north (S1), or note the variant.
  - (v) **Hands.**
    - The app has you cross your forearms, right over left, and touch your ears, bent forward.
    - S2: "Cover both ears with the hands and at the end of the mantra touch the floor" (drawing: standing, bending forward, hands over the ears, then floor, then prostration).
    - The crossing of the arms is not found in S1, S2 or R7.
    - R7 lists "Namaskaram" (item 28) before abhivādanam.
- **C.** "Present yourself to the deities by lineage and name, as one who has been taught." [own]
- **D.** Standing, bent forward from the waist, both palms covering the ears (S2). At the end, bend to touch the floor.

### 29. `dik-vandanam`
- **A.** Core (S1 p21–22, S2 p.40–41, R7 item 30, V 1259–1278 s).
- **B.**
  - S1 p22: "keep the palms together and fingers pointing away from you. Direct the fingers to top … to floor …". The app matches.
  - **List.**
    - S1 and S2 end with viṣṇave.
    - R7 and V add **mṛtyave namaḥ** (V about 1273–1278 s). R7's note says "rudrāya namaḥ" is only in Kadalangudi's book.
    - The app's optional "rudrāya / yamāya" items: rudrāya has R7-note support only; yamāya is not found as a dig item. Suggest replacing them with an optional "mṛtyave namaḥ" (R7, V).
  - **Evening.** S1: "for sāyam sandhyā start from west and finish with south". The app matches. R7 and S2 give only the east start.
- **C.** "Salute every direction, above and below — the whole space in which the Lord dwells." R7: "Salutations to directions". The rest is [own].
- **D.** Standing, palms joined, fingers pointing forward. Quarter-turns, then the joined fingertips tilt up and down alternately while facing the start direction.

### 30. `yama-vandanam` (Smārta)
- **A.** Core (S1 p22–23, S2 p.41–42, R7 item 31, V 1278–1297 s).
- **B.** South in all. The app matches. R7: "anjali Mudra".
- **C.** "Bow to Yama, lord of dharma and of time, and to Citragupta, who keeps the record of deeds." R7: "Prayer to Yama and Chitragupta". The rest is [own].
- **D.** Standing, facing south, palms joined.

### 31. `siva-prarthana` (Smārta)
- **A.** Core (S1 p23 "Viśvarūpa prārthanā", S2 p.42 "Harihara vandanam", R7 item 32, V 1333–1341 s).
- **B.** **Facing.** S1 and S2 say north (the app matches). R7 says "Turn to West", while noting that "In patasalas they seem to chant this facing North".
- **C.** "Salute the one Supreme, Hari and Hara together, of every form."
  - S2: "blend of the greyish dark body of Vishnu with the red body of Shiva".
  - R7: "Hari-hara/Ardhanari/Parabrahma Vandhanam".
- **D.** Standing, facing north, palms joined.

### 32. `narmada-vandanam` (optional in the app)
- **A.** ✔ in S2 p.43, R7 item 33 ("Sarpa Raksha Mantram") and V (1301–1330 s, including the Āstīka verses). ✘ in S1 only. **Recommend non-optional for Smārta.**
- **B.** **Facing.**
  - The app gives east for morning and noon, and nothing for evening.
  - S2: "Facing East in the morning and West in the evening".
  - R7: "Turn towards the direction of Narmada river – for those living in South India it is North direction".
  - Proposed: add evening west (S2), with a note on R7's "toward the Narmadā".
- **C.** "Pray to the river Narmadā and the sage Āstīka for protection from snakes." R7 tells the Āstīka story: snakes "will not do harm to anyone who recite the following prayer".
- **D.** Standing, palms joined, facing as above.

### 33. `surya-narayana-vandanam`
- **A.** Core (S1 p23–24, S2 p.44–45, R7 item 34, V 1341–1391 s). "namo brahmaṇya devāya": ✘ here in S1, R7 and V. S2 has it earlier, at the start of the japa part (p.20). Optional is right.
- **B.** OK. "Keep folded hands in Namaskaram pose" (S1).
- **C.** "Surrender to Nārāyaṇa in the Sun's disc, to whom every salutation finally goes."
  - R7: "a highest sense of total surrender". On ākāśāt: "Namaskara performed to any deity ultimately reaches Lord Narayana".
- **D.** Standing, facing the sun, palms joined at the chest, eyes on the sun or closed.

### 34. `abhivadanam-2`
- **A.** Core (S1 p24, S2 p.45, R7 items 35–36, V 1391–1410 s).
- **B.** **Order.** The app's "Then sit and do the ācamanam" here conflicts with S1, S2, R7 and V, which all do samarpaṇam first, then ācamanam:
  - S1 p24–26: abhivādanam → samarpaṇam → ācamanam → japasthāna prokṣaṇam → brahmārpaṇam.
  - R7: 36 abhivādanam → 37 samarpaṇam → 38 ācamanam → 39 rakṣā.
  - V: abhivādana 1391 s → kāyena 1418 s → ācamanam 1433 s → closing mantra about 1458 s.
  - Proposed: move the ācamanam to after `samarpanam`.
  - S2 also has a full prostration with the second abhivādana (p.45).
- **C.** As in step 28.
- **D.** As in step 28.

### 35. `samarpanam`
- **A.** Core (S1 p24–25, S2 p.45–46, R7 item 37, V 1418–1429 s). The mantrahīnaṃ and prāyaścittāni verses: S2 p.46 ✔; ✘ in S1 and R7. Optional is right.
- **B.**
  - S1: "sit down and take a few drops of water in the right palm". R7: "put it on the ground through deva thirtha". The app matches.
  - **Evening facing.** S1 says North for sāyam; R7's general note says items 37–38 face north. The app says west.
- **C.** "Offer everything done by body, speech, mind and nature to Nārāyaṇa." This paraphrases the mantra and S1.
- **D.** Seated. A little water in the right palm, poured off the fingertips onto the plate at the end of the verse.

### 36. `samapti`
- **A.** Core (S1 p26, S2 p.47, R7 item 39, V about 1450–1466 s).
- **B.**
  - S1: "sprinkle it … on the area where you were seated … Touch the sprinkled water on the floor with the right ring finger and put the water mark on your forehead". The app matches.
  - Brahmārpaṇam: S1 "Pour some water"; S2 ✔. The app matches.
  - The app's final ācamanam + sāṣṭāṅga namaskāra: the ācamanam belongs **before** this step (S1, R7), not after. A prostration is not found in S1 or R7; S2 puts it in the kṣamā-prārthanā/abhivādana.
- **C.** "Seal the rite: bless the place, ask for protection and freedom from bad dreams, and hand the act over to Brahman."
  - R7: "Raksha … please remove any effect of our bad dreams! Bestow on us what is good". S2: "Raksha – Protection".
- **D.** Seated. The right hand sprinkles drops on the floor where you sat; the ring finger touches the wet spot, then the forehead between the eyebrows.

---

## D. Props

| Prop | Named or shown in | Notes |
|---|---|---|
| Pañcapātra (or tumbler) | S1 p1 ("Panchapatram (or tumbler) in front, full of water"); R7; V about 103 s ("silver, copper or brass"); S2 names it only in an appendix but its drawings show a tumbler | |
| Uddharaṇi (spoon) | S1 p1; S2 p.1 ("uddharani (spoon type)"); R7 items 1 and 5; V about 111 s | |
| Plate | S2 p.18 ("pour it down on the plate"), drawings; V about 121 s (Tamil/Malayalam word, ASR "tāmbā … plate"); filler Ki | Catches water from arghya, tarpaṇa and samarpaṇa |
| Extra water pot | R7 general note 3; V about 130–157 s ("for keeping extra water", ASR) | **Missing from app** |
| Plank / āsana / mat | S1 "Sit on a plank"; R7 "separate panchapatram, asanam"; S2 drawings show a checkered mat | |
| Upper cloth (aṅgavastram / uttarīya) | R7 item 23 ("hands covered with angavastram") and note 4 ("two vastrams"); V about 210–235 s | S2 figures are bare-chested (not named) |
| Dhoti | V about 210 s (ASR: about 4 m); SR | |
| Yajñopavīta | V about 159–200 s; S2 drawings and appendix | Japa: "Hold the sacred thread between your thumbs" (app, Smārta). Not found in S1, S2 or R7 for japa. |
| Tilaka | Water tilak only in S1, S2 and R7 | Vibhūti or ūrdhva-puṇḍra not named. S2 drawings show horizontal stripes on forehead and arms; that this is vibhūti is my inference. |
| Kuśa / pavitram | not found in S1, S2 or R7 | |
| Japa mālā | S2 drawings show a bead mala worn on the neck; counting is on the fingers in S2 and R7 | |
| Sandhyāvandanam book | V about 245 s | |

**Illustrator baseline [from S2 drawings + S1 text]:**
- A bare-chested man in a white dhoti with the sacred thread over the left shoulder; a short upper cloth for the japa scenes (R7).
- A small mat or low plank; a tumbler/pañcapātra with a spoon and a shallow plate on the floor in front, a little to the right.
- Facing east (the sun ahead) for morning and noon. In the evening, facing north for the early steps and west for arghya, japa and upasthāna.

**Where the sources differ (for the illustrator):**
- Ācamanam: squat (S2 drawing, SR, R7 "hands between knees") versus sitting on a plank (S1, S2 text).
- Evening arghya: sitting (S2, R7) versus standing (app).
- Noon facing: north (S2) versus east (S1, R7).
- Japa: standing in the morning (R7) versus seated (S2).

---

## E. Video timestamps (seconds, start of the step)

Source: Hindi ASR captions. Times are where the step's mantra first becomes recognisable, usually within ±5 s. "—" means not heard. The noon and evening columns are coarser (I scanned them in 30 s buckets), ±15 s.

| App step | Narration | Morning | Noon | Evening |
|---|---|---|---|---|
| before-you-begin | 90 (props) | — | — | — |
| acamanam | 288 | 573 | about 1830 | 3036 |
| anga-nyasam | 308 | 590 | 1832 | 3045 |
| vighna-apaharanam | 366 | 600 | 1848 | 3090 |
| pranayamam | 383 | 615 | 1857 | about 3100 |
| sankalpam | 462 | 634 | 1883 | about 3120 |
| satvika-tyagam | — | — | — | — |
| tilakam | — | 649 | about 1892 | about 3135 |
| prokshanam | — | 651 | 1897 | about 3140 |
| prasanam | — | 679 | about 1920 | about 3165 |
| punar-marjanam | — | about 730 | about 1950 | 3210 |
| arghya-pradanam | — | 760 (×3) | 1994 (×2) | 3236 (×3) |
| prayascitta-arghyam | — | 790 (prāṇāyāma), 814 (saṅkalpa), 827 | 2014, 2039, 2049 | 3266, 3290, 3304 |
| brahma-bhavanam | — | 836 | 2061 | 3313 |
| acamanam-2 | — | 845 | 2071 | about 3320 |
| tarpanam | — | 861 | about 2095 | 3330 |
| asanam | — | — | — | — |
| uttaranga-acamanam | — | 903 (ācamanam), 930 (Gaṇapati) | 2130 | 3390 |
| japa-sankalpam | — | 940 (prāṇāyāma), 962 | 2160, 2190 | 3420, 3450 |
| pranayama-nyasam | — | 977 | about 2215 | about 3460 |
| gayatri-avahanam | — | 1038 | 2265 | 3510 |
| kala-dhyanam | — | — | — | — |
| gayatri-japam | — | 1073 (nyāsa), 1080 | about 2300 | about 3545 |
| ashtakshara-japam | — | — | — | — |
| gayatri-upasthanam | — | 1145 (prāṇāyāma), 1174 | 2370, 2401 | 3630, about 3650 |
| surya-upasthanam | — | 1185 | about 2411 | 3660 |
| sandhyadi-devata-vandanam | — | 1219 | about 2490 | about 3700 |
| abhivadanam | — | 1236 | 2495 | 3720 |
| dik-vandanam | — | 1259 | 2520 | 3745 |
| yama-vandanam | — | 1278 | about 2540 | about 3765 |
| narmada-vandanam | — | 1301 | about 2565 | about 3790 |
| siva-prarthana | — | 1333 | about 2595 | about 3820 |
| surya-narayana-vandanam | — | 1341 | about 2610 | about 3835 |
| abhivadanam-2 | — | 1391 | about 2655 | about 3880 |
| samarpanam | — | 1418 | 2670 | about 3900 |
| samapti | — | 1433 (ācamanam), about 1458 | — | — |

V's order differs from the app in one place: Narmadā (1301 s) comes **before** ṛtaṃ satyam (1333 s). The app has śiva → narmadā.

What the captions don't let me verify: anything about posture, hands or facing in the performed sections, and the exact japa count (only about 6–8 audible repetitions per kāla; the video likely shortens the japa).

---

## What was not checked
- The book pages missing from the S2 scan: pp 1–14 (likely its preparation section) and 81–94.
- The Sanskrit in R7: the garbled font hides its japa-sthala-prokṣaṇa mantra.
- Video visuals. Only captions were used; no frames were viewed.
- The kara-nyāsa block and the Śrī-Vaiṣṇava-only steps beyond noting that they are absent from the Smārta main sources.
