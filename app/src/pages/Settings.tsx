import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SCRIPTS, SCRIPT_LABEL, TRADITIONS, TRADITION_LABEL } from '../config'
import gotrasJson from '../content/gotras.json'
import { exportSettings, importSettings, useSettings, type Settings as S } from '../lib/settings'
import { xlit } from '../lib/text'

const GOTRAS = gotrasJson.gotras
const ARSHEYA: Record<number, string> = { 1: 'ekārṣeya', 3: 'trayārṣeya', 5: 'pañcārṣeya' }

/** Settings doubles as onboarding (first run shows the same form with a "Begin" button). */
export function Settings({ onboarding = false }: { onboarding?: boolean }) {
  const s = useSettings()
  const nav = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const set = (patch: Partial<S>) => s.set(patch)

  const onGotra = (g: string) => {
    const row = GOTRAS.find((r) => r.gotra === g)
    set({ gotra: g, pravara: row?.pravara ?? s.pravara, arsheya: row ? (row.arsheya as 1 | 3 | 5) : s.arsheya })
  }
  const preview = xlit(s.name || 'rāma', s.script === 'iast' ? 'devanagari' : s.script)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 font-sans">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-3xl font-serif font-bold" style={{ color: 'var(--accent)' }}>{onboarding ? 'Welcome · set up' : 'Settings'}</h1>
        {!onboarding && <Link to="/" className="underline text-sm">← Home</Link>}
      </div>

      <Section title="You (used in abhivādanam & saṅkalpam)">
        <Field label="Name (IAST, e.g. lakṣmīnārāyaṇa)"><input className="input" value={s.name} onChange={(e) => set({ name: e.target.value })} placeholder="rāmakṛṣṇa" /></Field>
        <p className="text-sm -mt-2 mb-3" style={{ color: 'var(--fg-muted)' }}>Preview: <span className="mantra text-lg">{preview}</span> — type with diacritics (ā ī ū ṛ ṅ ñ ṭ ḍ ṇ ś ṣ) for correct rendering.</p>
        <Field label="Gotra">
          <input className="input" list="gotras" value={s.gotra} onChange={(e) => onGotra(e.target.value)} placeholder="bhāradvāja" />
          <datalist id="gotras">{GOTRAS.map((g) => <option key={g.gotra} value={g.gotra} />)}</datalist>
        </Field>
        <Field label="Pravara ṛṣis (auto-filled from gotra; edit if your family differs)"><input className="input" value={s.pravara} onChange={(e) => set({ pravara: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ārṣeya"><select className="input" value={s.arsheya} onChange={(e) => set({ arsheya: Number(e.target.value) as 1 | 3 | 5 })}>{[1, 3, 5].map((n) => <option key={n} value={n}>{ARSHEYA[n]}</option>)}</select></Field>
          <Field label="Sūtra"><select className="input" value={s.sutra} onChange={(e) => set({ sutra: e.target.value as S['sutra'] })}><option value="āpastamba">Āpastamba</option><option value="bodhāyana">Bodhāyana</option><option value="other">Other</option></select></Field>
        </div>
        <Field label="Janma nakṣatra (optional, IAST)"><input className="input" value={s.nakshatra} onChange={(e) => set({ nakshatra: e.target.value })} placeholder="rohiṇī" /></Field>
      </Section>

      <Section title="Tradition">
        <div className="flex flex-wrap gap-2">
          {TRADITIONS.map((t) => (
            <button key={t} className={`btn ${s.tradition === t ? 'btn-primary' : 'btn-ghost'}`} onClick={() => set({ tradition: t })}>{TRADITION_LABEL[t]}</button>
          ))}
        </div>
        <Field label="Gāyatrī japa count"><select className="input w-auto" value={s.japaCount} onChange={(e) => set({ japaCount: Number(e.target.value) as S['japaCount'] })}>{[108, 28, 10].map((n) => <option key={n} value={n}>{n}</option>)}</select></Field>
      </Section>

      <Section title="Display">
        <Field label="Mantra script">
          <div className="flex flex-wrap gap-2">
            {SCRIPTS.map((sc) => <button key={sc} className={`btn ${s.script === sc ? 'btn-primary' : 'btn-ghost'}`} onClick={() => set({ script: sc })}>{SCRIPT_LABEL[sc]}</button>)}
          </div>
        </Field>
        <Toggle label="Show Roman transliteration under the mantra" v={s.showTransliteration} on={(v) => set({ showTransliteration: v })} />
        <Toggle label="Show meaning (English)" v={s.showMeaning} on={(v) => set({ showMeaning: v })} />
        <Toggle label="Show action hints (what to do while reciting)" v={s.showActions} on={(v) => set({ showActions: v })} />
        <Field label={`Text size · ${Math.round(s.fontScale * 100)}%`}><input type="range" min={0.85} max={1.6} step={0.05} value={s.fontScale} onChange={(e) => set({ fontScale: Number(e.target.value) })} className="w-full" /></Field>
        <Field label="Theme"><select className="input w-auto" value={s.theme} onChange={(e) => set({ theme: e.target.value as S['theme'] })}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></Field>
      </Section>

      {onboarding ? (
        <button className="btn btn-primary w-full text-lg" onClick={() => { set({ onboarded: true }); nav('/') }}>Begin</button>
      ) : (
        <Section title="Backup">
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-ghost" onClick={() => download('sandhya-settings.json', exportSettings())}>Export settings</button>
            <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>Import settings</button>
            <input ref={fileRef} type="file" accept="application/json" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) importSettings(await f.text()) }} />
            <button className="btn btn-ghost" onClick={() => confirm('Reset all settings?') && s.reset()}>Reset</button>
          </div>
        </Section>
      )}
    </div>
  )
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="card p-5 mb-5"><h2 className="font-serif text-xl font-bold mb-3">{title}</h2>{children}</section>
)
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-3"><label className="label">{label}</label>{children}</div>
)
const Toggle = ({ label, v, on }: { label: string; v: boolean; on: (v: boolean) => void }) => (
  <label className="flex items-center gap-2 mb-2 cursor-pointer"><input type="checkbox" checked={v} onChange={(e) => on(e.target.checked)} className="size-4" />{label}</label>
)
function download(name: string, text: string) {
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([text], { type: 'application/json' })), download: name })
  a.click()
  URL.revokeObjectURL(a.href)
}
