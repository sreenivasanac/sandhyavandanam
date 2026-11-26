// Central branding/config — edit here, not in components.
export const APP = {
  name: 'Sandhyāvandanam',
  shortName: 'Sandhyā',
  description: 'Guided Sandhyāvandanam: steps, mantras in your script, and meanings.',
  themeColor: '#a52a1e', // kumkum
  backgroundColor: '#faf7f2', // rice paper
  repo: 'https://github.com/sreenivasanac/sandhyavandanam',
  url: 'https://sandhya.pragnyalabs.com',
  support: 'https://github.com/sreenivasanac/sandhyavandanam/issues', // where the Support page sends questions and corrections
  policyDate: '25 November 2026', // date shown on the privacy policy; change it whenever the policy text changes
} as const

// Self-hosted Umami, reached through this site's own /u/ path (nginx proxies it to the Umami container), so the
// tracker is first-party. Empty websiteId switches analytics off.
export const ANALYTICS = {
  host: 'sandhya.pragnyalabs.com',
  script: '/u/p.js',
  websiteId: 'c98f0bcc-e172-4ca5-a26c-9ae13d89112f',
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
export function suggestKala(d = new Date(), sunrise?: Date, sunset?: Date | null): Kala {
  if (sunrise && sunset) {
    // Sandhyā is done around the juncture: morning until ~3 h after sunrise, evening from ~1.5 h before sunset.
    const t = d.getTime()
    if (t < sunrise.getTime() + 3 * 3600e3) return 'pratah'
    if (t < sunset.getTime() - 1.5 * 3600e3) return 'madhyahnika'
    return 'sayam'
  }
  const h = d.getHours()
  if (h < 10) return 'pratah'
  if (h < 16) return 'madhyahnika'
  return 'sayam'
}

// The ritual in four phases. `from` = id of the first step of the phase (order follows the content).
export const PHASES = [
  { id: 'prep', sa: 'Saṅkalpa', en: 'Preparation & intent', from: 'acamanam' },
  { id: 'arghya', sa: 'Mārjana · Arghya', en: 'Purification & offering to the Sun', from: 'prokshanam' },
  { id: 'japa', sa: 'Gāyatrī japa', en: 'Invocation & japa', from: 'asanam', orFrom: 'japa-sankalpam' }, // āsanam is hidden by default for Smārtas; the japa part then starts at the saṅkalpa
  { id: 'close', sa: 'Upasthāna', en: 'Salutations & conclusion', from: 'surya-upasthanam' },
] as const
export type Phase = (typeof PHASES)[number]

/** Phase of each step in an ordered step list (a step belongs to the latest phase whose `from` has been passed). */
export function phasesFor(stepIds: string[]): Phase[] {
  let cur: Phase = PHASES[0]
  return stepIds.map((id) => (cur = PHASES.find((p) => p.from === id || ('orFrom' in p && p.orFrom === id && cur !== p)) ?? cur))
}

// Gāyatrī japa: the full count differs by time of day (108 morning, 32 noon, 64 evening); 28 and 10 are the reduced counts.
export const JAPA_FULL: Record<Kala, number> = { pratah: 108, madhyahnika: 32, sayam: 64 }
/** The count to recite: the setting 108 means "the full count for this time of day". */
export const japaTarget = (setting: 108 | 28 | 10, kala: Kala) => (setting === 108 ? JAPA_FULL[kala] : setting)

// A complete recorded chant with Vedic tones (T S Ranganathan) on YouTube, and where each step starts in it, in seconds:
// [morning, noon, evening]. Found from the video's auto-captions, so a link may land a few seconds early or late.
export const CHANT_VIDEO = 'https://www.youtube.com/watch?v=RkLJ9Lh2Jcs'
export const CHANT_VIDEO_AT: Record<string, (number | null)[]> = {
  'acamanam': [573, 1830, 3036],
  'anga-nyasam': [590, 1832, 3045],
  'vighna-apaharanam': [600, 1848, 3090],
  'pranayamam': [615, 1857, 3100],
  'sankalpam': [634, 1883, 3120],
  'tilakam': [649, 1892, 3135],
  'prokshanam': [651, 1897, 3140],
  'prasanam': [679, 1920, 3165],
  'punar-marjanam': [730, 1950, 3210],
  'arghya-pradanam': [760, 1994, 3236],
  'prayascitta-arghyam': [790, 2014, 3266],
  'brahma-bhavanam': [836, 2061, 3313],
  'acamanam-2': [845, 2071, 3320],
  'tarpanam': [861, 2095, 3330],
  'japa-sankalpam': [930, 2130, 3390],
  'pranayama-nyasam': [977, 2215, 3460],
  'gayatri-avahanam': [1038, 2265, 3510],
  'gayatri-japam': [1073, 2300, 3545],
  'gayatri-upasthanam': [1145, 2370, 3630],
  'surya-upasthanam': [1185, 2411, 3660],
  'sandhyadi-devata-vandanam': [1219, 2490, 3700],
  'abhivadanam': [1236, 2495, 3720],
  'dik-vandanam': [1259, 2520, 3745],
  'yama-vandanam': [1278, 2540, 3765],
  'narmada-vandanam': [1301, 2565, 3790],
  'siva-prarthana': [1333, 2595, 3820],
  'surya-narayana-vandanam': [1341, 2610, 3835],
  'abhivadanam-2': [1391, 2655, 3880],
  'samarpanam': [1418, 2670, 3900],
  'samapti': [1458, null, null],
  'acamanam-3': [1433, null, null],
}
