import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { DisplaySheet } from '../components/Sheets'
import { KALAS, KALA_LABEL, PHASES, phasesFor, type Kala } from '../config'
import { content } from '../content'
import { stepsFor } from '../content/schema'
import { useSettings } from '../lib/settings'

/** Index of one sandhyā: every step by phase, each opening the step-by-step view at that step. */
export function Read() {
  const { kala: k } = useParams()
  const kala = (KALAS as readonly string[]).includes(k ?? '') ? (k as Kala) : 'pratah'
  // Each index page is its own search result: give it its own title and canonical address, and put the home ones back on leaving.
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel=canonical]')
    const before = { title: document.title, href: link?.href }
    document.title = `${KALA_LABEL[kala].sa} sandhyā: the steps of the ${KALA_LABEL[kala].en.toLowerCase()} procedure`
    if (link) link.href = `${location.origin}/read/${kala}`
    return () => { document.title = before.title; if (link && before.href) link.href = before.href }
  }, [kala])
  const s = useSettings()
  const steps = useMemo(() => stepsFor(content, kala, s.tradition, s.showOptional), [kala, s.tradition, s.showOptional])
  const phases = useMemo(() => phasesFor(steps.map((x) => x.id)), [steps])
  const [display, setDisplay] = useState(false)
  return (
    <div data-kala={kala} className="mx-auto max-w-2xl px-5 pb-24">
      <header className="sticky top-0 z-10 -mx-3 box-content flex h-13 items-center pt-[env(safe-area-inset-top)]" style={{ background: 'color-mix(in srgb, var(--paper) 92%, transparent)', backdropFilter: 'blur(10px)' }}>
        <Link to="/" className="icon-btn" aria-label="Home"><Icon name="left" /></Link>
        <span className="mx-auto font-serif text-[1.05rem]">{KALA_LABEL[kala].sa} sandhyā</span>
        <button className="icon-btn" onClick={() => setDisplay(true)} aria-label="Display options"><Icon name="sliders" /></button>
      </header>

      <h1 className="display mt-6 text-4xl">{KALA_LABEL[kala].sa} sandhyā</h1>
      <p className="muted mt-2">The {KALA_LABEL[kala].en.toLowerCase()} procedure in {steps.length} steps. Open any step, or start from the first.</p>
      <Link to={`/perform/${kala}`} className="btn btn-primary btn-lg mt-5 w-full">Begin at step 1</Link>

      <nav aria-label="Steps" className="mt-8">
        {PHASES.map((ph) => (
          <section key={ph.id} className="mb-8">
            <h2 className="ornament mono mb-1">{ph.en}</h2>
            <ol>
              {steps.map((st, n) => phases[n] === ph && (
                <li key={st.id} className="border-b" style={{ borderColor: 'var(--line)' }}>
                  <Link to={`/perform/${kala}?s=${n}`} className="grid min-h-14 grid-cols-[2rem_1fr_auto] items-center gap-1 py-2.5 transition-opacity active:opacity-60">
                    <span className="mono muted tabular-nums">{n + 1}</span>
                    <span><span className="block font-serif text-lg leading-snug">{st.title.sa}</span><span className="muted block text-sm">{st.title.en}</span></span>
                    <span className="faint"><Icon name="right" size={18} /></span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </nav>
      <DisplaySheet open={display} onOpenChange={setDisplay} />
    </div>
  )
}
