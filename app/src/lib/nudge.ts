import { useEffect, useState } from 'react'

/**
 * "Make it yours" nudge for people who haven't been through set-up. Counts step/page views and visible seconds of
 * use (in localStorage, not the settings store, so the timer doesn't re-render the app).
 * Shows when BOTH thresholds of the current stage are met; each "Later" moves to the next stage:
 *   stage 0: 4 views & 20 s · 1: 8 & 40 · 2: 16 & 80 · 3: once on a later visit, after 20 s of it · 4: never again.
 * A late "Later" never re-triggers at once: the next stage also needs the same increase again past the dismissal point.
 */
const KEY = 'sandhya.nudge'
const STAGES = [[4, 20], [8, 40], [16, 80]] as const
const NEXT_VISIT = 3
const DONE = 4
const TICK = 5 // seconds

type State = { views: number; secs: number; stage: number; base: [number, number]; visit: string; visitSecs: number; laterVisit?: string }

// A visit = one tab or app session: sessionStorage survives reloads, not a fresh launch.
const visit = (() => {
  try {
    let v = sessionStorage.getItem(KEY)
    if (!v) sessionStorage.setItem(KEY, (v = String(Date.now())))
    return v
  } catch { return 'x' }
})()

let st: State = (() => {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? '') as State
    if (typeof s.stage === 'number') return { ...s, visit, visitSecs: s.visit === visit ? s.visitSecs : 0 }
  } catch { /* first run or blocked storage */ }
  return { views: 0, secs: 0, stage: 0, base: [0, 0], visit, visitSecs: 0 }
})()
const subs = new Set<() => void>()
function save(patch: Partial<State>) {
  const was = due()
  st = { ...st, ...patch }
  try { localStorage.setItem(KEY, JSON.stringify(st)) } catch { /* the nudge just won't persist */ }
  if (due() !== was) subs.forEach((f) => f()) // re-render only when the answer changes, not every tick
}

export function due(s: State = st): boolean {
  if (s.stage >= DONE) return false
  if (s.stage === NEXT_VISIT) return s.visit !== s.laterVisit && s.visitSecs >= STAGES[0][1]
  const [v, t] = STAGES[s.stage]
  const [pv, pt] = s.stage ? STAGES[s.stage - 1] : [0, 0]
  return s.views >= Math.max(v, s.base[0] + v - pv) && s.secs >= Math.max(t, s.base[1] + t - pt)
}

/** Count one step or page view. */
export const countView = () => { if (st.stage < DONE) save({ views: st.views + 1 }) }

/** "Later": on to the next stage, remembering where (and in which visit) it was dismissed. */
export const dismiss = () => save({ stage: st.stage + 1, base: [st.views, st.secs], laterVisit: visit })

if (typeof window !== 'undefined') {
  setInterval(() => {
    if (document.visibilityState === 'visible' && st.stage < DONE) save({ secs: st.secs + TICK, visitSecs: st.visitSecs + TICK })
  }, TICK * 1000)
}

/** True while the panel should be offered; the caller decides where (step screens only). */
export function useNudgeDue(enabled: boolean): boolean {
  const [, tick] = useState(0)
  useEffect(() => { const f = () => tick((n) => n + 1); subs.add(f); return () => { subs.delete(f) } }, [])
  return enabled && due()
}
