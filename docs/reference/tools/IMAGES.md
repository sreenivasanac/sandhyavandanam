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
