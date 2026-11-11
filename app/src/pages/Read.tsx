import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { StepView } from '../components/StepView'
import { KALAS, KALA_LABEL, PHASES, phasesFor, type Kala } from '../config'
import { content, KALA_VARS } from '../content'
import { stepsFor } from '../content/schema'
import { useSettings } from '../lib/settings'
import { varsFrom } from '../lib/text'

/** Read mode: the whole sandhyā as one scroll, with a step index. */
export function Read() {
  const { kala: k } = useParams()
  const kala = (KALAS as readonly string[]).includes(k ?? '') ? (k as Kala) : 'pratah'
  const s = useSettings()
  const steps = useMemo(() => stepsFor(content, kala, s.tradition), [kala, s.tradition])
  const vars = varsFrom(s, KALA_VARS[kala])
  const phases = useMemo(() => phasesFor(steps.map((x) => x.id)), [steps])
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between font-sans text-sm mb-4" style={{ color: 'var(--fg-muted)' }}>
        <Link to="/" className="underline">← Home</Link>
        <span>{KALA_LABEL[kala].sa} sandhyā · read</span>
        <Link to="/settings" className="underline">Settings</Link>
      </div>
      <details className="card p-4 mb-6 font-sans">
        <summary className="cursor-pointer">Contents ({steps.length} steps)</summary>
        <div className="mt-2 grid gap-3 sm:grid-cols-2 text-sm">
          {PHASES.map((ph) => (
            <div key={ph.id}>
              <p className="font-semibold" style={{ color: 'var(--accent)' }}>{ph.en}</p>
              <ol className="list-none">
                {steps.map((st, n) => phases[n] === ph && <li key={st.id}>{n + 1}. <a href={`#${st.id}`} className="underline">{st.title.sa}</a></li>)}
              </ol>
            </div>
          ))}
        </div>
      </details>
      <div className="grid gap-6">
        {steps.map((st, i) => <div key={st.id} id={st.id}><StepView step={st} kala={kala} vars={vars} index={i} total={steps.length} phase={phases[i]} /></div>)}
      </div>
    </div>
  )
}
