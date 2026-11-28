import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Kala, Script, Tradition } from '../config'

export interface Settings {
  onboarded: boolean
  // personalisation (used in abhivādanam & sankalpam)
  name: string // IAST, e.g. "lakṣmīnārāyaṇa"
  gotra: string // IAST, e.g. "kauśika"
  pravara: string // IAST, e.g. "vaiśvāmitra āghamarṣaṇa kauśika" ; auto-filled from gotra table
  sutra: 'āpastamba' | 'bodhāyana' | 'other'
  arsheya: 1 | 3 | 5 // number of pravara ṛṣis
  nakshatra: string // janma nakṣatra (IAST)
  tradition: Tradition
  japaCount: 108 | 28 | 10
  japaPosture: 'seated' | 'byTime' // Gāyatrī japa: always seated, or as some texts give it (standing in the morning, either at noon, seated in the evening)
  // display
  script: Script
  showTransliteration: boolean
  showMeaning: boolean
  showActions: boolean
  showAudio: boolean // chant clips where available
  showInstructions: boolean // the "what to do" list and illustration of each step
  showOptional: boolean // steps and lines that only some families do; hidden unless switched on
  fontScale: number // 1 = base
  theme: 'system' | 'light' | 'dark'
  // detailed saṅkalpam (panchāṅga) — needs a location
  detailedSankalpam: boolean
  calendar: 'solar' | 'lunar' // solar = Tamil usage (meṣa māse…), lunar = Kannada/Telugu (caitra māse…)
  lat?: number
  lon?: number
  place?: string // a chosen city; without one, the time zone below gives an approximate place
  tz?: string // IANA time zone chosen in Settings; unset = the device's own (no location permission is ever asked)
  // native apps only: daily reminder time ('HH:MM', 24 h) for each sandhyā that has one switched on
  reminders: Partial<Record<Kala, string>>
}

/** Not yet made their own: never finished set-up and no gotra entered in Settings. */
export const needsSetup = (s: Pick<Settings, 'onboarded' | 'gotra'>) => !s.onboarded && !s.gotra.trim()

export const DEFAULTS: Settings = {
  onboarded: false,
  tz: undefined, // listed so Reset and Import clear a chosen zone (the store merges)
  name: '',
  gotra: '',
  pravara: '',
  sutra: 'āpastamba',
  arsheya: 3,
  nakshatra: '',
  tradition: 'smarta',
  japaCount: 108,
  japaPosture: 'seated',
  script: 'devanagari',
  showTransliteration: true,
  showMeaning: true,
  showActions: true,
  showAudio: true,
  showInstructions: true,
  showOptional: false,
  fontScale: 1,
  theme: 'system',
  detailedSankalpam: false,
  calendar: 'solar',
  reminders: {},
}

type Store = Settings & { set: (patch: Partial<Settings>) => void; reset: () => void }

export const useSettings = create<Store>()(
  persist(
    (set) => ({ ...DEFAULTS, set: (patch) => set(patch), reset: () => set(DEFAULTS) }),
    { name: 'sandhya-settings', version: 1 },
  ),
)

/** Export/import for moving settings between devices (no accounts). */
export const exportSettings = (): string => JSON.stringify(useSettings.getState(), (_k, v) => (typeof v === 'function' ? undefined : v), 2)
export function importSettings(json: string): void {
  const parsed = JSON.parse(json) as Partial<Settings>
  useSettings.getState().set({ ...DEFAULTS, ...parsed })
}
