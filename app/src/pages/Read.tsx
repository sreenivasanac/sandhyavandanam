import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { DisplaySheet } from '../components/Sheets'
import { StepView } from '../components/StepView'
import { KALAS, KALA_LABEL, PHASES, phasesFor, type Kala } from '../config'
import { content, KALA_VARS } from '../content'
import { stepsFor } from '../content/schema'
import { useSettings } from '../lib/settings'
import { varsFrom } from '../lib/text'

/** Read mode: the whole sandhyā as one page for study, with contents by phase. */
export function Read() {
  const { kala: k } = useParams()
  const kala = (KALAS as readonly string[]).includes(k ?? '') ? (k as Kala) : 'pratah'
  // Each read page is its own search result: give it its own title and canonical address, and put the home ones back on leaving.
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel=canonical]')
    const before = { title: document.title, href: link?.href }
    document.title = `${KALA_LABEL[kala].sa} sandhyā: the full ${KALA_LABEL[kala].en.toLowerCase()} procedure`
    if (link) link.href = `${location.origin}/read/${kala}`
    return () => { document.title = before.title; if (link && before.href) link.href = before.href }
  }, [kala])
  const s = useSettings()
  const steps = useMemo(() => stepsFor(content, kala, s.tradition), [kala, s.tradition])
  const phases = useMemo(() => phasesFor(steps.map((x) => x.id)), [steps])
  const vars = varsFrom(s, KALA_VARS[kala])
  const [display, setDisplay] = useState(false)
  return (
    <div data-kala={kala} className="mx-auto max-w-2xl px-5 pb-24">
      <header className="sticky top-0 z-10 -mx-3 flex h-13 items-center" style={{ background: 'color-mix(in srgb, var(--paper) 92%, transparent)', backdropFilter: 'blur(10px)' }}>
        <Link to="/" className="icon-btn" aria-label="Home"><Icon name="left" /></Link>
        <span className="mx-auto font-serif text-[1.05rem]">{KALA_LABEL[kala].sa} sandhyā</span>
        <button className="icon-btn" onClick={() => setDisplay(true)} aria-label="Display options"><Icon name="sliders" /></button>
      </header>

      <h1 className="display mt-6 text-4xl">{KALA_LABEL[kala].sa} sandhyā</h1>
      <p className="muted mt-2">The full {KALA_LABEL[kala].en.toLowerCase()} procedure, {steps.length} steps. <Link className="underline" to={`/perform/${kala}`}>Perform it step by step</Link> when you are ready.</p>

      <nav aria-label="Contents" className="mt-8 grid gap-6 sm:grid-cols-2">
        {PHASES.map((ph) => (
          <div key={ph.id}>
            <h2 className="mb-1 font-semibold">{ph.en}</h2>
            <ol>
              {steps.map((st, n) => phases[n] === ph && (
                <li key={st.id}><a href={`#${st.id}`} className="grid min-h-11 grid-cols-[1.8rem_1fr] items-center py-1 hover:underline"><span className="faint tabular-nums">{n + 1}</span><span className="font-serif">{st.title.sa}</span></a></li>
              ))}
            </ol>
          </div>
        ))}
      </nav>

      {steps.map((st, i) => (
        <section key={st.id} id={st.id} className="scroll-mt-16">
          {phases[i] !== phases[i - 1] && <p className="mt-14 text-sm font-semibold" style={{ color: 'var(--kumkum)' }}>{phases[i].en}</p>}
          <hr className="rule mb-8 mt-3" />
          <StepView step={st} kala={kala} vars={vars} number={i + 1} />
        </section>
      ))}
      <DisplaySheet open={display} onOpenChange={setDisplay} />
    </div>
  )
}
