import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Kala } from '../config'

/** Local-day key (YYYY-MM-DD in the device's zone). */
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

interface Progress {
  /** day → kāla → time completed (ms). Kept for two weeks. */
  done: Record<string, Partial<Record<Kala, number>>>
  /** Where the user stopped, so Home can offer to continue. */
  resume: { kala: Kala; stepId: string; day: string } | null
  markDone: (k: Kala) => void
  setResume: (k: Kala, stepId: string) => void
  clearResume: () => void
}

export const useProgress = create<Progress>()(
  persist(
    (set) => ({
      done: {},
      resume: null,
      markDone: (k) =>
        set((s) => {
          const day = dayKey()
          const keep = Object.fromEntries(Object.entries(s.done).sort().slice(-13))
          return { done: { ...keep, [day]: { ...keep[day], [k]: Date.now() } }, resume: null }
        }),
      setResume: (kala, stepId) => set({ resume: { kala, stepId, day: dayKey() } }),
      clearResume: () => set({ resume: null }),
    }),
    { name: 'sandhya-progress', version: 1 },
  ),
)
