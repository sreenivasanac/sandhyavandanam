import type { Kala } from '../config'
import type { Step } from '../content/schema'
import { fill, type Vars } from '../lib/text'
import { ItemView } from './MantraView'
import { Md } from './Md'

const FACING = { east: 'Face east', north: 'Face north', west: 'Face west' }

export function StepView({ step, kala, vars, index, total }: { step: Step; kala: Kala; vars: Vars; index?: number; total?: number }) {
  const facing = step.facing?.[kala]
  return (
    <article className="card p-5 sm:p-7">
      <header className="mb-3">
        {index !== undefined && (
          <p className="font-sans text-xs uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>
            Step {index + 1}{total ? ` of ${total}` : ''} · {step.section === 'purvanga' ? 'Pūrvāṅgam' : 'Uttarāṅgam'}
          </p>
        )}
        <h2 className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{step.title.sa}{step.optional && <Opt />}</h2>
        <p className="font-sans" style={{ color: 'var(--fg-muted)' }}>{step.title.en}{facing ? ` · ${FACING[facing]}` : ''}</p>
      </header>
      {step.image && <img src={step.image} alt="" className="rounded-xl mb-3 max-h-64 object-contain" />}
      {step.intro && <p className="font-sans leading-relaxed mb-2"><Md text={fill(step.intro, vars)} /></p>}
      {step.items.map((it, i) => <ItemView key={i} item={it} kala={kala} vars={vars} />)}
    </article>
  )
}

export const Opt = () => <span className="ml-2 align-middle rounded-full px-2 py-0.5 font-sans text-xs font-normal" style={{ background: 'var(--accent-soft)', color: 'var(--fg-muted)' }} title="Some families include this; skip if not your practice">optional</span>
