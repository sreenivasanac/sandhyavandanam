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
  // Night: more than about an hour past sunset or before sunrise — the sky goes dark and the sun is gone.
  const night = now.getTime() > set + 70 * 60e3 || now.getTime() < rise - 70 * 60e3
  const times: Record<Kala, number> = { pratah: rise, madhyahnika: (rise + set) / 2, sayam: set }
  const label: Record<Kala, string> = { pratah: 'Sunrise', madhyahnika: 'Midday', sayam: 'Sunset' }

  const steps = useMemo(() => stepsFor(content, kala, s.tradition), [kala, s.tradition])
  const resumeAt = resume && resume.kala === kala && resume.day === dayKey() ? steps.findIndex((x) => x.id === resume.stepId) : -1
  const isDone = !!today[kala]

  return (
    <div data-kala={kala} data-sky={night ? 'night' : 'day'} className="min-h-dvh">
      {/* the whole top of the screen is the sky at this hour; the action sits in it */}
      <div className="sky">
        <div className="mx-auto max-w-xl px-5 pb-7 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{APP.name}</span>
            <Link to="/settings" className="icon-btn -mr-2" aria-label="Settings"><Icon name="sliders" /></Link>
          </div>
          <div className="mt-4"><SunArc f={f} done={today} active={kala} night={night} /></div>
          <div className="relative mt-2 h-5 text-xs font-semibold tabular-nums opacity-80" aria-hidden>
            {hasPlace && KALAS.map((k, n) => (
              <span key={k} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${[11.25, 50, 88.75][n]}%` }}>{clock(times[k])}</span>
            ))}
          </div>
          <h1 className="display mt-7 text-[3.1rem]">{KALA_LABEL[kala].sa}<br />sandhyā</h1>
          <p className="mt-3 text-lg font-medium opacity-85">
            {isDone ? `Completed at ${clock(today[kala]!)}` : hasPlace ? `${label[kala]} ${clock(times[kala])}, ${relative(times[kala] - now.getTime())}` : `${KALA_LABEL[kala].en} sandhyā`}
          </p>
          <div className="mt-6 grid gap-2">
            {resumeAt > 0 ? (
              <>
                <Link to={`/perform/${kala}?s=${resumeAt}`} className="btn btn-primary btn-lg !justify-between !px-6">
                  <span className="text-left"><span className="block text-xs font-medium opacity-75">Continue at step {resumeAt + 1}</span><span className="block text-[1.1rem]">{steps[resumeAt].title.sa}</span></span>
                  <Icon name="right" />
                </Link>
                <Link to={`/perform/${kala}`} onClick={clearResume} className="btn btn-plain">Start from the beginning</Link>
              </>
            ) : (
              <Link to={`/perform/${kala}`} className={`btn btn-lg ${isDone ? 'btn-quiet' : 'btn-primary'}`}>{isDone ? 'Perform again' : `Begin ${KALA_LABEL[kala].sa} sandhyā`}</Link>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-xl px-5 pb-16">
        {completed && (
          <p className="rise mt-5 flex items-center gap-2 rounded-2xl px-4 py-3 font-medium" style={{ background: 'var(--wash)' }} role="status">
            <Icon name="check" />{KALA_LABEL[completed].sa} sandhyā complete.
          </p>
        )}

        <section className="mt-8" aria-label="Today's three sandhyās">
          <h2 className="mb-3 text-xl font-extrabold tracking-tight">Today</h2>
          <ul className="grid grid-cols-3 gap-2">
            {KALAS.map((k) => (
              <li key={k} data-kala={k} data-sky="day" className="flex min-w-0 flex-col gap-1 text-center">
                <Link to={`/perform/${k}`} className="tile flex aspect-[4/5] min-w-0 flex-col justify-between p-2.5 text-left">
                  <span className="grid size-6 place-items-center rounded-full" style={today[k] ? { background: 'var(--sky-ink)', color: 'var(--sky-a)' } : { border: '1.5px solid var(--sky-ink)', opacity: 0.6 }}>
                    {today[k] && <Icon name="check" size={14} />}
                  </span>
                  <span>
                    <span className="block truncate text-[0.78rem] font-bold leading-tight tracking-tight min-[380px]:text-[0.9rem]">{KALA_LABEL[k].sa}</span>
                    <span className="block text-xs font-medium tabular-nums opacity-80">{today[k] ? `Done ${clock(today[k]!)}` : hasPlace ? clock(times[k]) : KALA_LABEL[k].en}</span>
                  </span>
                </Link>
                <Link to={`/read/${k}`} className="btn btn-plain !min-h-11 text-sm" aria-label={`Read the ${KALA_LABEL[k].en.toLowerCase()} procedure`}>Read</Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-[1.25rem] p-4" style={{ background: 'var(--wash)' }}>
          {p ? (
            <p className="text-lg font-semibold leading-snug">
              {p.paksha} {nominative(p.tithi)}, {p.nakshatra} nakṣatra, {p.adhika ? 'adhika ' : ''}{p.masa} māsa
              <span className="muted mt-1 block text-sm font-normal">Computed for your saved location at today's sunrise. Check it against your pañcāṅgam.</span>
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
            Chant clips are a synthesised voice (<a className="underline" href="https://prathosh.in/vagdhenu/" target="_blank" rel="noreferrer">Vāgdhenu</a>) for the non-Vedic lines only. <a className="underline" href={APP.repo} target="_blank" rel="noreferrer">Report a correction</a>. This site counts visits anonymously, without cookies; nothing you enter here leaves your device.
          </p>
        </footer>
      </main>
    </div>
  )
}
