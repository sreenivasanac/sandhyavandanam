# Step illustrations — approach (2026-08-17)

## Options considered
| Option | Verdict |
|---|---|
| **Nano Banana Pro (Gemini image) flat line-art stills, one consistent character** | **Chosen for v1.** ~20 KB WebP each, offline-friendly, consistent via image-conditioning on the first frame. Needs human review of hand/finger accuracy per step. |
| Short generated video clips (Veo etc.), 5–20 s per step | Deferred: MBs per clip hurts the offline PWA, hand accuracy is worse than stills, hard to keep consistent. Revisit for a few complex mudrās only. |
| Photos of a real practitioner | Best accuracy and authority; needs a willing vaidika + consent/licence. Recommended for v2 or to replace any AI frame that reviewers flag. |
| Reuse photos from the Kidambi / Chakravarthy PDFs | No — copyright. |
| Hand-drawn SVG icons | Nice for step index/thumbnails; can be vectorised from the AI stills later. |

## Pipeline
- Prompts: "same character, same flat vector line-art style and warm palette as the reference image" + `input_image_path_1 = docs/images-draft/acamanam.png` (style anchor).
- Sources in `docs/images-draft/*.png` (1200×896). App copies: `cwebp -q 82 -resize 800 0` → `app/public/img/steps/*.webp`; referenced by `steps[].image`.
- Palette: cream #fdf7ec · saffron #e9a23b · rust #b3411b (matches the app theme).

## Open
- The generated character wears an ūrdhva-puṇḍra (Vaiṣṇava) mark; generate a vibhūti/tradition-neutral variant or per-tradition images.
- Steps still to illustrate: prokṣaṇam (sprinkling), prāśanam (sipping), brahmāñjali, tarpaṇam (deva-tīrtha pour), Gāyatrī nyāsa/mudrās, upasthānam (standing añjali), dik-vandanam, sāṣṭāṅga namaskāram.
- Every image needs a knowledgeable human check before release (finger positions).

## Step drawings (2026-11-23)

The eight step figures in `app/public/img/steps/` are black ink line drawings from Nano Banana Pro (treg `piapi.image-gen.gemini-3-pro-image`, about $0.105 each), converted to dark ink on a transparent background so they sit on the page colour and invert in dark mode (`.step-figure`). Each was checked by eye: sacred thread from the left shoulder, right hand doing the action, plain forehead (no tradition mark). The tarpaṇam drawing is mirrored for the thread. A saṅkalpa-posture drawing was tried twice and rejected (hands not on the right thigh).

## Coloured step pictures per tradition (2026-11-25)

The ink drawings above were replaced at the owner's request by the earlier flat-colour style, now with the tradition's marks (vibhūti for Smārta, ūrdhva-puṇḍra for Śrī Vaiṣṇava) and the props (plank, pañcapātra, uddharaṇi, plate). 13 scenes × 2 traditions in `app/public/img/steps/<scene>-s.webp` / `-v.webp`; a step's `image` is `{smarta, srivaishnava}`. Generated with Nano Banana Pro through treg (`piapi.image-gen.gemini-3-pro-image`, $0.105 each, about $5.05 in all including rejects), each using an approved sample as the reference image so the man stays the same.

What worked:
- Describe each hand twice: "his RIGHT hand" and which side of the picture that is.
- To get the other tradition's version of a good picture, edit it ("keep everything, change only the body marks") instead of generating afresh.
- A figure in profile gets the sacred thread on the near shoulder; the arghya pictures are mirrored for that reason.

What failed: the saṅkalpa posture (hands stacked on the RIGHT thigh) came out on the left thigh in every attempt, including edits, so that step has no picture. Poses were briefed from `docs/reference/source-check-2026-11-25.md` section D. The evening arghya is seated in the sources; the picture shows the standing form.

**Saṅkalpam (2026-11-25, later):** solved by colouring the owner's line drawing of the hands as a close-up (closed right hand on the open left palm, on the right thigh). The model would not draw this stacking from words or from a full-figure photo (it always put the crossing left hand on top), but it kept the hands when asked to recolour a drawing that already had them right. The Śrī Vaiṣṇava version is the same picture with the forearm stripes removed and the skin tone matched back by a channel gain.
