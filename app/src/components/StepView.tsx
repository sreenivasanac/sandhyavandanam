import type { Kala } from '../config'
import type { Step } from '../content/schema'
import { useSettings } from '../lib/settings'
import { fill, sentences, type Vars } from '../lib/text'
import { Icon } from './Icon'
import { JapaCounter } from './JapaCounter'
import { ItemView } from './MantraView'
import { Md } from './Md'

const FACING = { east: 'Face east', north: 'Face north', west: 'Face west' }

/** One step: title, where to face, what to do, then each line to recite. Sits directly on the page (no card). */
export function StepView({ step, kala, vars, number }: { step: Step; kala: Kala; vars: Vars; number?: number }) {
  const s = useSettings()
  const facing = step.facing?.[kala]
  const todo = !s.showInstructions ? []
    : step.todo ? step.todo.map((l) => fill(typeof l === 'string' ? l : l.text, vars))
    : step.intro ? sentences(fill(step.intro, vars)) : []
  return (
    <article>
      <header className="mb-5">
        <h2 className="display text-[2rem] sm:text-[2.4rem]">
          {number !== undefined && <span className="faint mr-2 tabular-nums">{number}</span>}{step.title.sa}
        </h2>
        <p className="muted mt-1 text-lg">{step.title.en}</p>
        {(facing || step.optional) && (
          <p className="mt-3 flex flex-wrap gap-2 text-[0.95rem]">
            {facing && <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: 'var(--wash)' }}><Icon name="compass" size={17} />{FACING[facing]}</span>}
            {step.optional && <span className="rounded-full px-3 py-1 muted" style={{ background: 'var(--wash)' }}>Optional: skip if it is not your practice</span>}
          </p>
        )}
      </header>
      {s.showInstructions && step.image && (
        <img src={step.image} alt="" className="step-figure mx-auto mb-5 max-h-64 object-contain" />
      )}
      {todo.length > 1 ? (
        <ol className="prose-ui mb-4 grid gap-2.5">
          {todo.map((line, i) => (
            <li key={i} className="grid grid-cols-[1.4rem_1fr] gap-1">
              <span className="font-semibold tabular-nums" style={{ color: 'var(--turmeric)' }}>{i + 1}</span>
              <span><Md text={line} /></span>
            </li>
          ))}
        </ol>
      ) : todo.length === 1 && <p className="prose-ui mb-4"><Md text={todo[0]} /></p>}
      {(todo.length > 0 || (s.showInstructions && step.image)) && step.items.length > 0 && <hr className="rule my-2" />}
      {step.items.map((it, i) => <ItemView key={i} item={it} kala={kala} vars={vars} />)}
      {step.id === 'gayatri-japam' && <JapaCounter target={s.japaCount} />}
    </article>
  )
}
