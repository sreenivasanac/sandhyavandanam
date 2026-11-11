// Central branding/config — edit here, not in components.
export const APP = {
  name: 'Sandhyāvandanam',
  shortName: 'Sandhyā',
  description: 'Guided Sandhyāvandanam: steps, mantras in your script, and meanings.',
  themeColor: '#b3411b', // deep saffron-red
  backgroundColor: '#fdf7ec', // cream
  repo: 'https://github.com/sreenivasanac/sandhyavandanam',
} as const

export const KALAS = ['pratah', 'madhyahnika', 'sayam'] as const
export type Kala = (typeof KALAS)[number]
export const KALA_LABEL: Record<Kala, { en: string; sa: string }> = {
  pratah: { en: 'Morning', sa: 'Prātaḥ' },
  madhyahnika: { en: 'Noon', sa: 'Mādhyāhnika' },
  sayam: { en: 'Evening', sa: 'Sāyaṃ' },
}

export const TRADITIONS = ['smarta', 'srivaishnava'] as const
export type Tradition = (typeof TRADITIONS)[number]
export const TRADITION_LABEL: Record<Tradition, string> = {
  smarta: 'Smārta (Iyer)',
  srivaishnava: 'Śrī Vaiṣṇava (Iyengar)',
}

// Scripts the mantra text can be rendered in. `iast` is the canonical authored form.
export const SCRIPTS = ['devanagari', 'iast', 'tamil', 'kannada', 'telugu', 'malayalam'] as const
export type Script = (typeof SCRIPTS)[number]
export const SCRIPT_LABEL: Record<Script, string> = {
  devanagari: 'देवनागरी',
  iast: 'IAST (Roman)',
  tamil: 'தமிழ்',
  kannada: 'ಕನ್ನಡ',
  telugu: 'తెలుగు',
  malayalam: 'മലയാളം',
}

/** Suggest a kāla from the wall clock. Rough windows; the user can override. */
export function suggestKala(d = new Date()): Kala {
  const h = d.getHours()
  if (h < 10) return 'pratah'
  if (h < 16) return 'madhyahnika'
  return 'sayam'
}

// The ritual in four phases. `from` = id of the first step of the phase (order follows the content).
export const PHASES = [
  { id: 'prep', sa: 'Saṅkalpa', en: 'Preparation & intent', from: 'acamanam' },
  { id: 'arghya', sa: 'Mārjana · Arghya', en: 'Purification & offering to the Sun', from: 'prokshanam' },
  { id: 'japa', sa: 'Gāyatrī japa', en: 'Invocation & japa', from: 'asanam' },
  { id: 'close', sa: 'Upasthāna', en: 'Salutations & conclusion', from: 'surya-upasthanam' },
] as const
export type Phase = (typeof PHASES)[number]

/** Phase of each step in an ordered step list (a step belongs to the latest phase whose `from` has been passed). */
export function phasesFor(stepIds: string[]): Phase[] {
  let cur: Phase = PHASES[0]
  return stepIds.map((id) => (cur = PHASES.find((p) => p.from === id) ?? cur))
}
