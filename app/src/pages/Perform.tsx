import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { StepView } from '../components/StepView'
import { KALAS, KALA_LABEL, type Kala } from '../config'
import { content, KALA_VARS } from '../content'
import { stepsFor } from '../content/schema'
import { useWakeLock } from '../lib/hooks'
import { useSettings } from '../lib/settings'
import { varsFrom } from '../lib/text'

/** Guided mode: one step per screen, prev/next, keyboard arrows, screen kept awake. Step index lives in ?s= so refresh/back work. */
export function Perform() {
  const { kala: k } = useParams()
  const kala = (KALAS as readonly string[]).includes(k ?? '') ? (k as Kala) : 'pratah'
  const s = useSettings()
  const steps = useMemo(() => stepsFor(content, kala, s.tradition), [kala, s.tradition])
  const [sp, setSp] = useSearchParams()
  const i = Math.min(Math.max(Number(sp.get('s') ?? 0), 0), steps.length - 1)
  const go = (n: number) => setSp({ s: String(Math.min(Math.max(n, 0), steps.length - 1)) }, { replace: true })
  const nav = useNavigate()
  const vars = varsFrom(s, KALA_VARS[kala])
  useWakeLock(true)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['SELECT', 'INPUT', 'TEXTAREA', 'AUDIO'].includes((e.target as HTMLElement).tagName)) return
      if (e.key === 'ArrowRight' || e.key === ' ') go(i + 1)
      if (e.key === 'ArrowLeft') go(i - 1)
      if (e.key === 'Escape') nav('/')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  useEffect(() => {
    window.scrollTo({ top: 0 }) // braces matter: scrollTo returns a Promise in newer Chrome, which React would treat as a cleanup
  }, [i])

  const step = steps[i]
  if (!step) return <p className="p-8 font-sans">No steps for this selection yet.</p>
  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-28">
      <div className="flex items-center justify-between font-sans text-sm mb-3" style={{ color: 'var(--fg-muted)' }}>
        <Link to="/" className="underline">← Home</Link>
        <span>{KALA_LABEL[kala].sa} sandhyā</span>
        <Link to="/settings" className="underline">Settings</Link>
      </div>
      <div className="h-1 rounded-full mb-4" style={{ background: 'var(--border)' }}>
        <div className="h-1 rounded-full" style={{ width: `${((i + 1) / steps.length) * 100}%`, background: 'var(--accent)' }} />
      </div>
      <StepView step={step} kala={kala} vars={vars} index={i} total={steps.length} />
      <nav className="fixed bottom-0 inset-x-0 p-3 flex gap-3 justify-center" style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-ghost flex-1 max-w-48" onClick={() => go(i - 1)} disabled={i === 0}>← Previous</button>
        <select className="input w-auto" value={i} onChange={(e) => go(Number(e.target.value))} aria-label="Jump to step">
          {steps.map((st, n) => <option key={st.id} value={n}>{n + 1}. {st.title.sa}</option>)}
        </select>
        {i < steps.length - 1
          ? <button className="btn btn-primary flex-1 max-w-48" onClick={() => go(i + 1)}>Next →</button>
          : <Link to="/" className="btn btn-primary flex-1 max-w-48">Finish ✓</Link>}
      </nav>
    </div>
  )
}
