import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Drawer } from 'vaul'
import { PHASES, SCRIPTS, SCRIPT_LABEL, type Phase } from '../config'
import type { Step } from '../content/schema'
import { useSettings } from '../lib/settings'
import { Icon } from './Icon'

function Sheet({ open, onOpenChange, title, children }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; children: React.ReactNode }) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="sheet-overlay" />
        <Drawer.Content className="sheet" aria-describedby={undefined}>
          <div className="sheet-handle" />
          <div className="flex items-center justify-between px-5 pb-2 pt-1">
            <Drawer.Title className="display text-2xl">{title}</Drawer.Title>
            <button className="icon-btn" onClick={() => onOpenChange(false)} aria-label="Close"><Icon name="close" /></button>
          </div>
          <div className="overflow-y-auto overscroll-contain px-5 pb-6">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

/** All steps grouped by phase; the current one is marked and scrolled into view. */
export function StepListSheet({ open, onOpenChange, steps, phases, current, onPick }: { open: boolean; onOpenChange: (o: boolean) => void; steps: Step[]; phases: Phase[]; current: number; onPick: (i: number) => void }) {
  const cur = useRef<HTMLButtonElement>(null)
  useEffect(() => { if (open) setTimeout(() => cur.current?.scrollIntoView({ block: 'center' }), 60) }, [open])
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Steps">
      {PHASES.map((ph) => (
        <section key={ph.id} className="mb-4">
          <h3 className="muted sticky top-0 py-1.5 text-sm font-semibold" style={{ background: 'var(--paper)' }}>{ph.en}</h3>
          {steps.map((st, n) => phases[n] === ph && (
            <button key={st.id} ref={n === current ? cur : undefined} onClick={() => { onPick(n); onOpenChange(false) }} aria-current={n === current ? 'step' : undefined}
              className="grid w-full grid-cols-[2rem_1fr_auto] items-baseline gap-1 rounded-xl px-2 py-2.5 text-left transition-colors active:scale-[0.99]"
              style={n === current ? { background: 'var(--wash)' } : undefined}>
              <span className="faint tabular-nums">{n + 1}</span>
              <span>
                <span className="font-serif text-[1.15rem]" style={n === current ? { color: 'var(--kumkum)' } : undefined}>{st.title.sa}</span>
                <span className="muted block text-sm">{st.title.en}</span>
              </span>
              {n < current && <span style={{ color: 'var(--turmeric)' }}><Icon name="check" size={18} /></span>}
            </button>
          ))}
        </section>
      ))}
    </Sheet>
  )
}

const Row = ({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <label className="flex cursor-pointer items-center justify-between gap-4 border-b py-2.5" style={{ borderColor: 'var(--line)' }}>
    <span>{label}{hint && <span className="muted block text-sm">{hint}</span>}</span>
    <input type="checkbox" role="switch" className="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
  </label>
)

/** Reading controls reachable mid-ritual: how much to show, script, size, theme. */
export function DisplaySheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const s = useSettings()
  const all = (v: boolean) => s.set({ showInstructions: v, showActions: v, showMeaning: v, showTransliteration: v })
  const learning = s.showInstructions && s.showActions && s.showMeaning
  const reciting = !s.showInstructions && !s.showActions && !s.showMeaning && !s.showTransliteration
  const here = useLocation()
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Display">
      <div className="grid grid-cols-2 gap-2">
        <button className="chip choice" aria-pressed={learning} onClick={() => all(true)}>
          <b>Learning</b><span className="text-sm font-normal opacity-80">Instructions, meanings and transliteration</span>
        </button>
        <button className="chip choice" aria-pressed={reciting} onClick={() => all(false)}>
          <b>Reciting</b><span className="text-sm font-normal opacity-80">Only the text to recite</span>
        </button>
      </div>
      <div className="mt-3">
        <Row label="Step instructions" hint="What to do, with pictures and notes" checked={s.showInstructions} onChange={(v) => s.set({ showInstructions: v })} />
        <Row label="Optional parts" hint="Extra steps and lines that only some families do" checked={s.showOptional} onChange={(v) => s.set({ showOptional: v })} />
        <Row label="Hints on each line" hint="Where to touch, when to pour" checked={s.showActions} onChange={(v) => s.set({ showActions: v })} />
        <Row label="Meaning" checked={s.showMeaning} onChange={(v) => s.set({ showMeaning: v })} />
        <Row label="Roman transliteration" checked={s.showTransliteration} onChange={(v) => s.set({ showTransliteration: v })} />
        <Row label="Chant buttons" hint="Synthesised voice. Vedic mantras are in a flat tone, without svaras" checked={s.showAudio} onChange={(v) => s.set({ showAudio: v })} />
      </div>
      <h3 className="muted mb-2 mt-5 text-sm font-semibold">Script</h3>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Script">
        {SCRIPTS.map((sc) => <button key={sc} role="radio" aria-checked={s.script === sc} className="chip" onClick={() => s.set({ script: sc })}>{SCRIPT_LABEL[sc]}</button>)}
      </div>
      <h3 className="muted mb-2 mt-5 text-sm font-semibold">Text size</h3>
      <div className="flex items-center gap-3">
        <button className="btn btn-quiet w-14 text-sm" onClick={() => s.set({ fontScale: Math.max(0.85, +(s.fontScale - 0.1).toFixed(2)) })} aria-label="Smaller text">A</button>
        <span className="muted w-14 text-center tabular-nums">{Math.round(s.fontScale * 100)}%</span>
        <button className="btn btn-quiet w-14 text-xl" onClick={() => s.set({ fontScale: Math.min(1.6, +(s.fontScale + 0.1).toFixed(2)) })} aria-label="Larger text">A</button>
      </div>
      <h3 className="muted mb-2 mt-5 text-sm font-semibold">Appearance</h3>
      <div className="flex gap-2" role="radiogroup" aria-label="Appearance">
        {(['system', 'light', 'dark'] as const).map((t) => <button key={t} role="radio" aria-checked={s.theme === t} className="chip capitalize" onClick={() => s.set({ theme: t })}>{t === 'system' ? 'Match device' : t}</button>)}
      </div>
      <Link className="mt-6 inline-flex min-h-11 items-center underline" style={{ color: 'var(--kumkum)' }} to={`/feedback?from=${encodeURIComponent(here.pathname + here.search)}`}>Report a problem with this step</Link>
    </Sheet>
  )
}
