import { Fragment, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { APP, KALAS, KALA_LABEL, SCRIPTS, SCRIPT_LABEL, TRADITIONS, TRADITION_LABEL, type Tradition } from '../config'
import gotrasJson from '../content/gotras.json'
import { panchanga } from '../lib/panchanga'
import { PLACES } from '../lib/places'
import { NATIVE, allowReminders, defaultTime } from '../lib/reminders'
import { exportSettings, importSettings, useSettings, type Settings as S } from '../lib/settings'
import { xlit } from '../lib/text'

const GOTRAS = gotrasJson.gotras
const ARSHEYA: Record<number, string> = { 1: 'ekārṣeya', 3: 'trayārṣeya', 5: 'pañcārṣeya' }
const TRADITION_NOTE: Record<Tradition, string> = {
  smarta: 'Saṅkalpa for Parameśvara’s grace; includes the navagraha tarpaṇam and the Yama and Śiva prayers.',
  srivaishnava: 'Saṅkalpa by the Lord’s command; includes sātvika tyāgam and the aṣṭākṣara japam.',
}
const SAMPLE = 'oṃ bhūr bhuvassuvaḥ'

function useLineage() {
  const s = useSettings()
  const onGotra = (g: string) => {
    const row = GOTRAS.find((r) => r.gotra === g)
    s.set({ gotra: g, pravara: row?.pravara ?? s.pravara, arsheya: row ? (row.arsheya as 1 | 3 | 5) : s.arsheya })
  }
  return { s, onGotra }
}

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <label className="mb-4 block"><span className="label">{label}</span>{children}{hint && <span className="muted mt-1 block text-sm [overflow-wrap:anywhere]">{hint}</span>}</label>
)

function TraditionPicker() {
  const s = useSettings()
  return (
    <div className="grid gap-2" role="radiogroup" aria-label="Tradition">
      {TRADITIONS.map((t) => (
        <button key={t} role="radio" aria-checked={s.tradition === t} onClick={() => s.set({ tradition: t })} className="chip choice">
          <b className="font-serif text-xl font-normal">{TRADITION_LABEL[t]}</b>
          <span className="text-sm font-normal" style={{ color: 'var(--ink-2)' }}>{TRADITION_NOTE[t]}</span>
        </button>
      ))}
    </div>
  )
}

function ScriptPicker() {
  const s = useSettings()
  return (
    <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Script">
      {SCRIPTS.map((sc) => (
        <button key={sc} role="radio" aria-checked={s.script === sc} onClick={() => s.set({ script: sc })} className="chip choice">
          <span className="mantra !text-[1.35rem] !leading-snug" style={{ color: 'var(--ink)' }}>{xlit(SAMPLE, sc)}</span>
          <span className="text-sm font-normal" style={{ color: 'var(--ink-2)' }}>{SCRIPT_LABEL[sc]}</span>
        </button>
      ))}
    </div>
  )
}

function LineageFields() {
  const { s, onGotra } = useLineage()
  return (
    <>
      <Field label="Your name" hint={s.name ? `Will be recited as ${xlit(s.name, s.script === 'iast' ? 'devanagari' : s.script)} śarmā. Add marks (ā ī ū ṛ ś ṣ ṇ) for exact spelling.` : 'As you say it in the abhivādanam, for example rāmakṛṣṇa.'}>
        <input className="input" value={s.name} onChange={(e) => s.set({ name: e.target.value })} autoComplete="given-name" autoCapitalize="none" spellCheck={false} />
      </Field>
      <Field label="Gotra" hint="Pick from the list or type your own.">
        <input className="input" list="gotras" value={s.gotra} onChange={(e) => onGotra(e.target.value)} autoCapitalize="none" spellCheck={false} />
        <datalist id="gotras">{GOTRAS.map((g) => <option key={g.gotra} value={g.gotra} />)}</datalist>
      </Field>
      <Field label="Pravara ṛṣis" hint="Filled in from the gotra. Change it if your family recites it differently.">
        <input className="input" value={s.pravara} onChange={(e) => s.set({ pravara: e.target.value })} autoCapitalize="none" spellCheck={false} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Number of ṛṣis"><select className="input" value={s.arsheya} onChange={(e) => s.set({ arsheya: Number(e.target.value) as 1 | 3 | 5 })}>{[1, 3, 5].map((n) => <option key={n} value={n}>{n} — {ARSHEYA[n]}</option>)}</select></Field>
        <Field label="Sūtra"><select className="input" value={s.sutra} onChange={(e) => s.set({ sutra: e.target.value as S['sutra'] })}><option value="āpastamba">Āpastamba</option><option value="bodhāyana">Bodhāyana</option><option value="other">Other</option></select></Field>
      </div>
    </>
  )
}

/** First run: three short screens instead of one long form. Everything can be changed later in Settings. */
export function Welcome() {
  const s = useSettings()
  const nav = useNavigate()
  const [n, setN] = useState(0)
  const finish = () => { s.set({ onboarded: true }); nav('/') }
  const screens = [
    { title: 'Which tradition do you follow?', body: <TraditionPicker /> },
    { title: 'Which script do you read?', body: <ScriptPicker /> },
    { title: 'Your name and gotra', lead: 'These complete the abhivādanam. You can skip this and add them later.', body: <LineageFields /> },
  ]
  const cur = screens[n]
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-5 pb-6 pt-[calc(env(safe-area-inset-top)+1rem)]">
      <div className="flex items-center gap-2">
        {n > 0 ? <button className="icon-btn -ml-2" onClick={() => setN(n - 1)} aria-label="Back"><Icon name="left" /></button> : <span className="font-serif text-lg">{APP.name}</span>}
        <div className="ml-auto flex gap-1.5" aria-label={`Step ${n + 1} of ${screens.length}`}>
          {screens.map((_, i) => <span key={i} className="h-1.5 w-6 rounded-full" style={{ background: i <= n ? 'var(--kumkum)' : 'var(--line)' }} />)}
        </div>
      </div>
      <div key={n} className="mt-8 flex-1">
        <h1 className="display text-[2.1rem]">{cur.title}</h1>
        {cur.lead && <p className="muted mt-2">{cur.lead}</p>}
        <div className="mt-6">{cur.body}</div>
      </div>
      <div className="sticky bottom-0 mt-6 grid gap-2 pt-3" style={{ background: 'var(--paper)' }}>
        {n < screens.length - 1
          ? <button className="btn btn-primary btn-lg" onClick={() => setN(n + 1)}>Continue</button>
          : <button className="btn btn-primary btn-lg" onClick={finish}>{s.name || s.gotra ? 'Save and begin' : 'Skip for now'}</button>}
      </div>
    </div>
  )
}

const Section = ({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-16 border-t py-7" style={{ borderColor: 'var(--line)' }}>
    <h2 className="display mb-4 text-2xl">{title}</h2>{children}
  </section>
)
const Switch = ({ label, hint, v, on }: { label: string; hint?: string; v: boolean; on: (v: boolean) => void }) => (
  <label className="flex cursor-pointer items-center justify-between gap-4 py-2.5">
    <span>{label}{hint && <span className="muted block text-sm">{hint}</span>}</span>
    <input type="checkbox" role="switch" className="switch" checked={v} onChange={(e) => on(e.target.checked)} />
  </label>
)

export function Settings() {
  const s = useSettings()
  const fileRef = useRef<HTMLInputElement>(null)
  const [locating, setLocating] = useState<'' | 'busy' | 'failed'>('')
  const set = (patch: Partial<S>) => s.set(patch)
  const hasPlace = s.lat != null && s.lon != null
  const locate = () => {
    if (!navigator.geolocation) return setLocating('failed')
    setLocating('busy')
    navigator.geolocation.getCurrentPosition(
      (p) => { set({ lat: +p.coords.latitude.toFixed(2), lon: +p.coords.longitude.toFixed(2), place: 'My location' }); setLocating('') },
      () => setLocating('failed'),
    )
  }
  return (
    <div className="mx-auto max-w-xl px-5 pb-20">
      <header className="sticky top-0 z-10 -mx-3 box-content flex h-13 items-center pt-[env(safe-area-inset-top)]" style={{ background: 'color-mix(in srgb, var(--paper) 92%, transparent)', backdropFilter: 'blur(10px)' }}>
        <Link to="/" className="icon-btn" aria-label="Home"><Icon name="left" /></Link>
      </header>
      <h1 className="display mb-6 mt-4 text-4xl">Settings</h1>

      <Section title="Tradition"><TraditionPicker /></Section>

      <Section title="Name and lineage">
        <LineageFields />
        <Field label="Gāyatrī japa count" hint="The full count is 108 in the morning, 32 at noon and 64 in the evening."><div className="flex gap-2" role="radiogroup" aria-label="Japa count">{([108, 28, 10] as const).map((n) => <button key={n} role="radio" aria-checked={s.japaCount === n} className="chip tabular-nums" onClick={() => set({ japaCount: n })}>{n === 108 ? 'Full' : n}</button>)}</div></Field>
      </Section>

      <Section title="Script"><ScriptPicker /></Section>

      <Section title="What to show">
        <Switch label="Step instructions" hint="What to do, with pictures and notes" v={s.showInstructions} on={(v) => set({ showInstructions: v })} />
        <Switch label="Optional parts" hint="Extra steps and lines that only some families do" v={s.showOptional} on={(v) => set({ showOptional: v })} />
        <Switch label="Hints on each line" hint="Where to touch, when to pour" v={s.showActions} on={(v) => set({ showActions: v })} />
        <Switch label="Meaning in English" v={s.showMeaning} on={(v) => set({ showMeaning: v })} />
        <Switch label="Roman transliteration" v={s.showTransliteration} on={(v) => set({ showTransliteration: v })} />
        <Switch label="Chant buttons" hint="A synthesised voice. Vedic mantras are in a flat tone, without svaras. A pronunciation aid, not a substitute for a teacher." v={s.showAudio} on={(v) => set({ showAudio: v })} />
        <div className="mt-4 flex gap-2" role="radiogroup" aria-label="Appearance">
          {(['system', 'light', 'dark'] as const).map((t) => <button key={t} role="radio" aria-checked={s.theme === t} className="chip capitalize" onClick={() => set({ theme: t })}>{t === 'system' ? 'Match device' : t}</button>)}
        </div>
      </Section>

      <Section id="place" title="Place and pañcāṅga">
        <p className="muted mb-4">Your place sets the sunrise and sunset times on the home screen and the day's tithi and nakṣatra. It stays on this device.</p>
        <div className="flex flex-wrap gap-2">
          <select className="input !w-auto flex-1" aria-label="Choose a city" value={PLACES.find(([, la, lo]) => la === s.lat && lo === s.lon)?.[0] ?? ''} onChange={(e) => { const p = PLACES.find(([n]) => n === e.target.value); if (p) set({ place: p[0], lat: p[1], lon: p[2] }) }}>
            <option value="" disabled>{hasPlace ? s.place || 'Custom location' : 'Choose a city'}</option>
            {PLACES.map(([n]) => <option key={n}>{n}</option>)}
          </select>
          <button className="btn btn-quiet" onClick={locate} disabled={locating === 'busy'}>{locating === 'busy' ? 'Finding…' : 'Use my location'}</button>
        </div>
        {locating === 'failed' && <p className="mt-2 text-sm" style={{ color: 'var(--kumkum)' }} role="alert">Couldn't get your location. Choose a city, or enter the coordinates below.</p>}
        <details className="mt-3">
          <summary className="muted cursor-pointer text-sm">Enter coordinates</summary>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <Field label="Latitude"><input className="input" type="number" inputMode="decimal" step="0.01" value={s.lat ?? ''} onChange={(e) => set({ lat: e.target.value === '' ? undefined : Number(e.target.value), place: '' })} /></Field>
            <Field label="Longitude"><input className="input" type="number" inputMode="decimal" step="0.01" value={s.lon ?? ''} onChange={(e) => set({ lon: e.target.value === '' ? undefined : Number(e.target.value), place: '' })} /></Field>
          </div>
        </details>
        <div className="mt-4 border-t pt-2" style={{ borderColor: 'var(--line)' }}>
          <Switch label="Detailed saṅkalpam" hint="Recite the year, ayana, ṛtu, month, pakṣa, tithi, weekday and nakṣatra in the saṅkalpam. Most nitya sandhyā texts leave these out." v={s.detailedSankalpam} on={(v) => set({ detailedSankalpam: v })} />
          <Field label="Month names">
            <select className="input" value={s.calendar} onChange={(e) => set({ calendar: e.target.value as S['calendar'] })}>
              <option value="solar">Solar, as in Tamil usage (meṣa, vṛṣabha…)</option>
              <option value="lunar">Lunar, as in Kannada and Telugu usage (caitra, vaiśākha…)</option>
            </select>
          </Field>
          {hasPlace && <PanchangaPreview />}
        </div>
      </Section>

      {NATIVE && <Reminders />}

      <Section title="Your data">
        <p className="muted mb-3">{NATIVE ? 'Everything is stored only on this device.' : 'Everything is stored only in this browser. Export it to move to another device.'}</p>
        <div className="flex flex-wrap gap-2">
          {/* the native web view cannot save a file, so moving settings by file is a website feature */}
          {!NATIVE && <button className="btn btn-quiet" onClick={() => download('sandhya-settings.json', exportSettings())}>Export settings</button>}
          {!NATIVE && <button className="btn btn-quiet" onClick={() => fileRef.current?.click()}>Import settings</button>}
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) importSettings(await f.text()) }} />
          <button className="btn btn-plain" onClick={() => confirm('Reset all settings to their defaults?') && s.reset()}>Reset</button>
        </div>
      </Section>
    </div>
  )
}

/** Native apps: a daily notification for each sandhyā, at a time the user sets. */
function Reminders() {
  const s = useSettings()
  const [denied, setDenied] = useState(false)
  const toggle = async (k: (typeof KALAS)[number], on: boolean) => {
    if (on && !(await allowReminders())) return setDenied(true)
    setDenied(false)
    const now = useSettings.getState() // read after the await, so a change made meanwhile is kept
    s.set({ reminders: { ...now.reminders, [k]: on ? defaultTime(k, now) : undefined } })
  }
  return (
    <Section title="Reminders">
      <p className="muted mb-2">A notification each day at the times you set. Sunrise and sunset move through the year, so adjust the times now and then.</p>
      {KALAS.map((k) => (
        <div key={k} className="flex items-center gap-3">
          <div className="flex-1"><Switch label={KALA_LABEL[k].en} hint={KALA_LABEL[k].sa} v={!!s.reminders[k]} on={(v) => toggle(k, v)} /></div>
          {s.reminders[k] && <input type="time" className="input !w-auto tabular-nums" aria-label={`${KALA_LABEL[k].en} reminder time`} value={s.reminders[k]} onChange={(e) => e.target.value && s.set({ reminders: { ...s.reminders, [k]: e.target.value } })} />}
        </div>
      ))}
      {denied && <p className="mt-2 text-sm" style={{ color: 'var(--kumkum)' }} role="alert">Notifications are switched off for this app. Allow them in your phone's Settings, then try again.</p>}
    </Section>
  )
}

/** Today's computed pañcāṅga so the user can check it against their own calendar. */
function PanchangaPreview() {
  const s = useSettings()
  const p = panchanga(new Date(), s.lat!, s.lon!, s.calendar)
  const rows: [string, string][] = [['Saṃvatsara', p.samvatsara], ['Ayana', p.ayana], ['Ṛtu', p.rtu], ['Māsa', (p.adhika ? 'adhika ' : '') + p.masa], ['Pakṣa', p.paksha], ['Tithi', p.tithi], ['Vāra', p.vara], ['Nakṣatra', p.nakshatra]]
  return (
    <div className="mt-2 rounded-2xl p-4" style={{ background: 'var(--wash)' }}>
      <p className="mb-2 text-sm font-semibold">Today at your place</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1">
        {rows.map(([k, v]) => <Fragment key={k}><dt className="muted text-sm">{k}</dt><dd className="font-serif">{v}</dd></Fragment>)}
      </dl>
      <p className="muted mt-3 text-sm">Taken at today's sunrise, Lahiri ayanāṃśa. Check it against your pañcāṅgam once.</p>
    </div>
  )
}

function download(name: string, text: string) {
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([text], { type: 'application/json' })), download: name })
  a.click()
  URL.revokeObjectURL(a.href)
}
