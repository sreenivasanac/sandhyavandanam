import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Script, Tradition } from '../config'

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
  // display
  script: Script
  showTransliteration: boolean
  showMeaning: boolean
  showActions: boolean
  showAudio: boolean // chant clips where available
  fontScale: number // 1 = base
  theme: 'system' | 'light' | 'dark'
  // detailed saṅkalpam (panchāṅga) — needs a location
  detailedSankalpam: boolean
  calendar: 'solar' | 'lunar' // solar = Tamil usage (meṣa māse…), lunar = Kannada/Telugu (caitra māse…)
  lat?: number
  lon?: number
  place?: string
}

export const DEFAULTS: Settings = {
  onboarded: false,
  name: '',
  gotra: '',
  pravara: '',
  sutra: 'āpastamba',
  arsheya: 3,
  nakshatra: '',
  tradition: 'smarta',
  japaCount: 108,
  script: 'devanagari',
  showTransliteration: true,
  showMeaning: true,
  showActions: true,
  showAudio: true,
  fontScale: 1,
  theme: 'system',
  detailedSankalpam: false,
  calendar: 'solar',
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
