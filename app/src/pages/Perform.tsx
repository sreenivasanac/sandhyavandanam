import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { DisplaySheet, StepListSheet } from '../components/Sheets'
import { StepView } from '../components/StepView'
import { KALAS, KALA_LABEL, PHASES, phasesFor, type Kala, japaTarget } from '../config'
import { content, KALA_VARS } from '../content'
import { stepsFor } from '../content/schema'
import { useWakeLock } from '../lib/hooks'
import { useProgress } from '../lib/progress'
import { dismiss, useNudgeDue } from '../lib/nudge'
import { needsSetup, useSettings } from '../lib/settings'
import { varsFrom } from '../lib/text'
import { track } from '../lib/track'
import { useSwipe } from '../lib/useSwipe'

/**
 * Guided mode: one step per screen. Move with the bottom bar, a swipe, or the arrow keys; the screen stays awake.
 * The step index lives in ?s= so refresh and back work; the position is also remembered so Home can offer to continue.
 */
export function Perform() {
  const { kala: k } = useParams()
  const kala = (KALAS as readonly string[]).includes(k ?? '') ? (k as Kala) : 'pratah'
  const s = useSettings()
  const steps = useMemo(() => stepsFor(content, kala, s.tradition, s.showOptional), [kala, s.tradition, s.showOptional])
  const phases = useMemo(() => phasesFor(steps.map((x) => x.id)), [steps])
  const [sp, setSp] = useSearchParams()
  // ?step=<id> (set when returning from set-up, which may change the tradition and so the list) wins over the ?s= index
  const byId = steps.findIndex((x) => x.id === sp.get('step'))
  const i = byId >= 0 ? byId : Math.min(Math.max(Number(sp.get('s') ?? 0), 0), steps.length - 1)
  const nav = useNavigate()
  const vars = varsFrom(s, { ...KALA_VARS[kala], japaCount: String(japaTarget(s.japaCount, kala)) })
  const { setResume, markDone } = useProgress()
  const [list, setList] = useState(false)
  const [display, setDisplay] = useState(false)
  // Direction of the last pointer-initiated move; keyboard moves don't animate (they repeat too often to wait on).
  const [dir, setDir] = useState<'next' | 'prev' | null>(null)
  const page = useRef<HTMLDivElement>(null)
  useWakeLock(true)
  const nudge = useNudgeDue(needsSetup(s) && !list && !display)
  const here = `/perform/${kala}?s=${i}&step=${steps[i]?.id ?? ''}`

  const go = useCallback((n: number, animate = true) => {
    const to = Math.min(Math.max(n, 0), steps.length - 1)
    if (to === i) return
    setDir(animate ? (to > i ? 'next' : 'prev') : null)
    setSp({ s: String(to) }, { replace: true })
  }, [i, steps.length, setSp])
  const next = useCallback(() => go(i + 1), [go, i])
  const prev = useCallback(() => go(i - 1), [go, i])
  const finish = () => { markDone(kala); track('complete', { kala, tradition: s.tradition }); nav('/', { state: { completed: kala } }) }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // A sheet handles its own keys (Escape closes it). It may already have closed by the time this runs, so also honour defaultPrevented.
      if (e.defaultPrevented || list || display || document.querySelector('[role="dialog"]')) return
      if (['SELECT', 'INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return
      if (e.key === ' ' && (e.target as HTMLElement).closest('button, a')) return // Space presses the focused control
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go(i + 1, false) }
      if (e.key === 'ArrowLeft') go(i - 1, false)
      if (e.key === 'Escape') nav('/')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, i, nav, list, display])

  const step = steps[i]
  // Analytics: one "begin" per visit to this screen, and one "phase" each time a new phase is reached (how far people get).
  useEffect(() => { track('begin', { kala, tradition: s.tradition, script: s.script }) }, [kala]) // eslint-disable-line react-hooks/exhaustive-deps
  const phaseId = phases[i]?.id
  useEffect(() => { if (phaseId) track('phase', { kala, phase: phaseId }) }, [kala, phaseId])
  useEffect(() => {
    window.scrollTo({ top: 0 }) // braces matter: scrollTo returns a Promise in newer Chrome, which React would treat as a cleanup
    if (step) setResume(kala, step.id)
  }, [i, kala, step, setResume])
  useSwipe(page, next, prev, i < steps.length - 1, i > 0)

  if (!step) return <p className="p-8">No steps for this selection yet.</p>
  const last = i === steps.length - 1
  return (
    <div data-kala={kala} className="mx-auto min-h-dvh max-w-2xl">
      <header className="sticky top-0 z-10 px-2 pt-[env(safe-area-inset-top)]" style={{ background: 'color-mix(in srgb, var(--paper) 92%, transparent)', backdropFilter: 'blur(10px)' }}>
        <div className="flex h-13 items-center">
          <Link to="/" className="icon-btn" aria-label="Leave and go home"><Icon name="left" /></Link>
          <button className="mx-auto rounded-lg px-3 py-1 text-center leading-tight" onClick={() => setList(true)} aria-label={`${KALA_LABEL[kala].sa} sandhyā, step ${i + 1} of ${steps.length}. Show all steps`}>
            <span className="font-serif text-[1.05rem]">{KALA_LABEL[kala].sa} sandhyā</span>
            <span className="muted block text-sm tabular-nums">Step {i + 1} of {steps.length}</span>
          </button>
          <button className="icon-btn" onClick={() => setDisplay(true)} aria-label="Display options"><Icon name="sliders" /></button>
        </div>
        <div className="flex gap-1 px-2 pb-2" aria-hidden>
          {PHASES.map((ph) => {
            const idx = steps.map((_, n) => n).filter((n) => phases[n] === ph)
            const done = idx.filter((n) => n <= i).length
            return (
              <div key={ph.id} className="h-[3px] overflow-hidden rounded-full" style={{ flex: idx.length, background: 'var(--line)' }}>
                <div className="h-full rounded-full" style={{ width: `${(done / Math.max(1, idx.length)) * 100}%`, background: 'var(--turmeric)', transition: 'width 300ms var(--ease-out)' }} />
              </div>
            )
          })}
        </div>
      </header>

      <main ref={page} className="px-5 pb-36 pt-5" style={{ touchAction: 'pan-y' }}>
        <div key={step.id} className={dir ? `step-${dir}` : undefined}>
          <StepView step={step} kala={kala} vars={vars} />
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10" style={{ background: 'linear-gradient(to top, var(--paper) 72%, transparent)' }}>
        {nudge && (
          // Not a dialog: it sits above the step buttons, so the ritual can carry on with it showing.
          <aside className="nudge mx-auto max-w-2xl px-4" aria-label="Set up">
            <div className="nudge-card">
              <p className="min-w-0 flex-1 text-[0.95rem] leading-snug">Make the saṅkalpa yours: your tradition, script, gotra and name.</p>
              <Link to={`/setup?back=${encodeURIComponent(here)}`} className="btn btn-quiet !min-h-10 !px-3 text-sm">Set up</Link>
              <button className="btn btn-plain !min-h-10 !px-2 text-sm" onClick={dismiss}>Later</button>
            </div>
          </aside>
        )}
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 pt-6" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.9rem)' }}>
          <button className="btn btn-quiet btn-lg w-14 !px-0" onClick={prev} disabled={i === 0} aria-label="Previous step"><Icon name="left" /></button>
          {last ? (
            <button className="btn btn-primary btn-lg flex-1" onClick={finish}><Icon name="check" />Complete sandhyā</button>
          ) : (
            <button className="btn btn-primary btn-lg min-w-0 flex-1 !justify-between !px-5" onClick={next}>
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-xs font-medium opacity-75">Next</span>
                <span className="block truncate font-serif text-[1.15rem] font-normal">{steps[i + 1].title.sa}</span>
              </span>
              <Icon name="right" />
            </button>
          )}
        </div>
      </nav>

      <StepListSheet open={list} onOpenChange={setList} steps={steps} phases={phases} current={i} onPick={(n) => go(n)} />
      <DisplaySheet open={display} onOpenChange={setDisplay} />
    </div>
  )
}
