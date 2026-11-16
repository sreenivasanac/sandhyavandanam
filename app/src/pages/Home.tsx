import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { SunArc } from '../components/SunArc'
import { APP, KALAS, KALA_LABEL, TRADITION_LABEL, suggestKala, type Kala } from '../config'
import { content } from '../content'
import { stepsFor } from '../content/schema'
import { panchanga } from '../lib/panchanga'
import { dayKey, useProgress } from '../lib/progress'
import { useSettings } from '../lib/settings'

const clock = (d: Date | number) => new Date(d).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
const nominative = (tithi: string) => tithi.replace(/(āyāṃ|yāṃ)$/, (m) => (m === 'āyāṃ' ? 'ā' : 'ī'))

/** Minutes → "in 25 min" / "1 h 10 min ago". */
function relative(ms: number) {
  const m = Math.round(Math.abs(ms) / 60000)
  const txt = m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}`
  return ms >= 0 ? `in ${txt}` : `${txt} ago`
}

export function Home() {
  const s = useSettings()
  const { done, resume, clearResume } = useProgress()
  const completed = (useLocation().state as { completed?: Kala } | null)?.completed
  const now = useMemo(() => new Date(), [])
  const hasPlace = s.lat != null && s.lon != null
  const p = useMemo(() => (hasPlace ? panchanga(now, s.lat!, s.lon!, s.calendar) : null), [hasPlace, now, s.lat, s.lon, s.calendar])
  const today = done[dayKey()] ?? {}

  // Sun position: real sunrise/sunset when a place is saved, otherwise a 6-to-6 day by the clock.
  const rise = p?.sunrise.getTime() ?? new Date(now).setHours(6, 0, 0, 0)
  const set = p?.sunset?.getTime() ?? new Date(now).setHours(18, 0, 0, 0)
  const f = (now.getTime() - rise) / (set - rise)
  const kala = suggestKala(now, p?.sunrise, p?.sunset)
  const times: Record<Kala, number> = { pratah: rise, madhyahnika: (rise + set) / 2, sayam: set }
  const label: Record<Kala, string> = { pratah: 'Sunrise', madhyahnika: 'Midday', sayam: 'Sunset' }

  const steps = useMemo(() => stepsFor(content, kala, s.tradition), [kala, s.tradition])
  const resumeAt = resume && resume.kala === kala && resume.day === dayKey() ? steps.findIndex((x) => x.id === resume.stepId) : -1
  const isDone = !!today[kala]

  return (
    <div data-kala={kala} className="min-h-dvh">
      <div className="sky">
        <div className="mx-auto max-w-xl px-5 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
          <div className="flex items-center justify-between">
            <span className="font-serif text-lg">{APP.name}</span>
            <Link to="/settings" className="icon-btn" aria-label="Settings"><Icon name="sliders" /></Link>
          </div>
          <div className="mt-1"><SunArc f={f} done={today} active={kala} /></div>
        </div>
      </div>

      <main className="mx-auto max-w-xl px-5 pb-16">
        {completed && (
          <p className="rise mb-5 mt-2 flex items-center gap-2 rounded-2xl px-4 py-3" style={{ background: 'var(--wash)' }} role="status">
            <span style={{ color: 'var(--turmeric)' }}><Icon name="check" /></span>{KALA_LABEL[completed].sa} sandhyā complete.
          </p>
        )}

        <section className="rise">
          <h1 className="display text-[2.75rem]">{KALA_LABEL[kala].sa} sandhyā</h1>
          <p className="muted mt-2 text-lg">
            {isDone ? `Completed at ${clock(today[kala]!)}` : hasPlace ? `${label[kala]} ${clock(times[kala])}, ${relative(times[kala] - now.getTime())}` : `${KALA_LABEL[kala].en} sandhyā`}
          </p>
          <div className="mt-6 grid gap-2">
            {resumeAt > 0 ? (
              <>
                <Link to={`/perform/${kala}?s=${resumeAt}`} className="btn btn-primary btn-lg !justify-between !px-5">
                  <span className="text-left"><span className="block text-xs font-medium opacity-75">Continue at step {resumeAt + 1}</span><span className="block font-serif text-[1.15rem] font-normal">{steps[resumeAt].title.sa}</span></span>
                  <Icon name="right" />
                </Link>
                <Link to={`/perform/${kala}`} onClick={clearResume} className="btn btn-plain">Start from the beginning</Link>
              </>
            ) : (
              <Link to={`/perform/${kala}`} className={`btn btn-lg ${isDone ? 'btn-quiet' : 'btn-primary'}`}>{isDone ? 'Perform again' : `Begin ${KALA_LABEL[kala].sa} sandhyā`}</Link>
            )}
          </div>
        </section>

        <section className="mt-10" aria-label="Today's three sandhyās">
          <h2 className="mb-1 font-semibold">Today</h2>
          <ul>
            {KALAS.map((k) => (
              <li key={k} className="flex items-center gap-1 border-t py-1" style={{ borderColor: 'var(--line)' }}>
                <Link to={`/perform/${k}`} className="group flex min-h-14 flex-1 items-center gap-3 rounded-xl py-2 transition-transform active:scale-[0.99]">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full border" style={today[k] ? { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' } : { borderColor: 'var(--ink-3)' }}>
                    {today[k] && <Icon name="check" size={16} />}
                  </span>
                  <span className="flex-1">
                    <span className="font-serif text-xl">{KALA_LABEL[k].sa}</span>
                    <span className="muted block text-sm">
                      {today[k] ? `Done at ${clock(today[k]!)}` : hasPlace ? `${label[k]} ${clock(times[k])}` : KALA_LABEL[k].en}
                    </span>
                  </span>
                </Link>
                <Link to={`/read/${k}`} className="btn btn-plain" aria-label={`Read the ${KALA_LABEL[k].en.toLowerCase()} procedure`}>Read</Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 border-t pt-5" style={{ borderColor: 'var(--line)' }}>
          {p ? (
            <p className="font-serif text-lg leading-relaxed">
              {p.paksha} {nominative(p.tithi)}, {p.nakshatra} nakṣatra, {p.adhika ? 'adhika ' : ''}{p.masa} māsa
              <span className="muted block font-sans text-sm">Computed for your saved location at today's sunrise. Check it against your pañcāṅgam.</span>
            </p>
          ) : (
            <p className="muted">
              <Link to="/settings#place" className="underline" style={{ color: 'var(--kumkum)' }}>Add your location</Link> to see sunrise and sunset times and today's tithi and nakṣatra here.
            </p>
          )}
        </section>

        <footer className="muted mt-12 text-sm leading-relaxed">
          <p>
            {TRADITION_LABEL[s.tradition]}, Kṛṣṇa Yajur Veda (Āpastamba), compiled from the procedure texts of Sunder Kidambi, K. Chakravarthy, Pandit Sri Rama and others. The text is still being reviewed, so where your own teacher or family practice differs, follow them.
          </p>
          <p className="mt-2">
            Chant clips are a synthesised voice (<a className="underline" href="https://prathosh.in/vagdhenu/" target="_blank" rel="noreferrer">Vāgdhenu</a>) for the non-Vedic lines only. <a className="underline" href={APP.repo} target="_blank" rel="noreferrer">Report a correction</a>.
          </p>
        </footer>
      </main>
    </div>
  )
}
