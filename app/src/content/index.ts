import raw from './sandhya.json'
import { Content } from './schema'
import { KALA_LABEL, type Kala } from '../config'

// Validate once at load (dev + prod: content bugs should fail loudly, not render half a ritual).
export const content = Content.parse(raw)

/** Kāla-dependent placeholder values, in IAST (transliterated with the mantra). */
export const KALA_VARS: Record<Kala, { kala: string; kalaEn: string }> = {
  pratah: { kala: 'prātaḥ', kalaEn: KALA_LABEL.pratah.en.toLowerCase() },
  madhyahnika: { kala: 'mādhyāhnika', kalaEn: KALA_LABEL.madhyahnika.en.toLowerCase() },
  sayam: { kala: 'sāyaṃ', kalaEn: KALA_LABEL.sayam.en.toLowerCase() },
}
