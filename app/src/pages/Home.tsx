import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { SunArc } from '../components/SunArc'
import { APP, KALAS, KALA_LABEL, TRADITION_LABEL, suggestKala, type Kala } from '../config'
import { content, KALA_VARS } from '../content'
import { stepsFor } from '../content/schema'
import { panchanga } from '../lib/panchanga'
import { dayKey, useProgress } from '../lib/progress'
import { useSettings } from '../lib/settings'
import { xlit } from '../lib/text'

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

  const inScript = (iast: string) => xlit(iast, s.script === 'iast' ? 'devanagari' : s.script)
  return (
    <div data-kala={kala} data-sky={night ? 'night' : 'day'} className="min-h-dvh">
      <div className="mx-auto max-w-xl px-6 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
        <div className="flex items-center justify-between">
          <span className="mono muted">{APP.name}</span>
          <Link to="/settings" className="icon-btn -mr-2" aria-label="Settings"><Icon name="sliders" /></Link>
        </div>
        <div className="mt-4"><SunArc f={f} done={today} active={kala} night={night} /></div>
        <div className="mono muted relative mt-3 h-5 tabular-nums" aria-hidden>
          {hasPlace && KALAS.map((k, n) => (
            <span key={k} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${[11.25, 50, 88.75][n]}%` }}>{clock(times[k])}</span>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-xl px-6 pb-16">
        {completed && (
          <p className="rise mb-2 mt-5 border-y py-3 text-center italic" style={{ borderColor: 'var(--line)' }} role="status">
            {KALA_LABEL[completed].sa} sandhyā is complete.
          </p>
        )}

        <section className="mt-8 text-center">
          <p className="mantra !text-[1.5rem] !leading-none" style={{ color: 'var(--kumkum)' }}>{inScript(`${KALA_VARS[kala].kala} sandhyā`)}</p>
          <h1 className="display mt-3 text-[2.6rem]">{KALA_LABEL[kala].sa} sandhyā</h1>
          <p className="muted mt-2 italic">
            {isDone ? `Completed at ${clock(today[kala]!)}` : hasPlace ? `${label[kala]} ${clock(times[kala])}, ${relative(times[kala] - now.getTime())}` : `${KALA_LABEL[kala].en} sandhyā`}
          </p>
          <div className="mt-7 grid gap-2 text-left">
            {resumeAt > 0 ? (
              <>
                <Link to={`/perform/${kala}?s=${resumeAt}`} className="btn btn-primary btn-lg !justify-between !px-5">
                  <span className="text-left"><span className="mono block opacity-80">Continue at step {resumeAt + 1}</span><span className="block font-serif text-[1.15rem] font-normal">{steps[resumeAt].title.sa}</span></span>
                  <Icon name="right" />
                </Link>
                <Link to={`/perform/${kala}`} onClick={clearResume} className="btn btn-plain">Start from the beginning</Link>
              </>
            ) : (
              <Link to={`/perform/${kala}`} className={`btn btn-lg ${isDone ? 'btn-quiet' : 'btn-primary'}`}>{isDone ? 'Perform again' : `Begin ${KALA_LABEL[kala].sa} sandhyā`}</Link>
            )}
          </div>
        </section>

        <section className="mt-12" aria-label="Today's three sandhyās">
          <h2 className="ornament mono mb-2">Today</h2>
          <ul>
            {KALAS.map((k) => (
              <li key={k} className="flex items-baseline gap-2">
                <Link to={`/perform/${k}`} className="flex min-h-13 flex-1 items-baseline gap-2 py-3 transition-opacity active:opacity-60">
                  <span className="font-serif text-xl">{KALA_LABEL[k].sa}</span>
                  <span className="leader" />
                  <span className="mono muted tabular-nums">{today[k] ? `done ${clock(today[k]!)}` : hasPlace ? clock(times[k]) : KALA_LABEL[k].en.toLowerCase()}</span>
                </Link>
                <Link to={`/read/${k}`} className="mono underline underline-offset-4" style={{ color: 'var(--kumkum)' }} aria-label={`Read the ${KALA_LABEL[k].en.toLowerCase()} procedure`}>read</Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 text-center">
          <p className="ornament mb-4" aria-hidden><span className="mantra !text-base !leading-none">॥</span></p>
          {p ? (
            <>
              <p className="font-serif text-lg leading-relaxed">{p.paksha} {nominative(p.tithi)}, {p.nakshatra} nakṣatra, {p.adhika ? 'adhika ' : ''}{p.masa} māsa</p>
              <p className="muted mt-1 text-sm italic">Computed for your saved place at today's sunrise. Check it against your pañcāṅgam.</p>
            </>
          ) : (
            <p className="muted italic">
              <Link to="/settings#place" className="underline" style={{ color: 'var(--kumkum)' }}>Add your place</Link> to see sunrise and sunset times and today's tithi and nakṣatra here.
            </p>
          )}
        </section>

        <footer className="muted mt-12 border-t pt-5 text-sm leading-relaxed" style={{ borderColor: 'var(--line)' }}>
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
