import { CHANT_VIDEO, CHANT_VIDEO_AT, KALAS, japaTarget, type Kala } from '../config'
import { isOptional, type Step } from '../content/schema'
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
  const image = typeof step.image === 'string' ? step.image : step.image?.[s.tradition]
  const todo = !s.showInstructions ? []
    : step.todo ? step.todo.map((l) => fill(typeof l === 'string' ? l : l.text, vars))
    : step.intro ? sentences(fill(step.intro, vars)) : []
  const videoAt = CHANT_VIDEO_AT[step.id]?.[KALAS.indexOf(kala)]
  return (
    <article>
      <header className="mb-5">
        <h2 className="display text-[2rem] sm:text-[2.4rem]">
          {number !== undefined && <span className="faint mr-2 tabular-nums">{number}</span>}{step.title.sa}
        </h2>
        <p className="muted mt-1 text-lg">{step.title.en}</p>
        {(facing || isOptional(step, s.tradition)) && (
          <p className="mt-3 flex flex-wrap gap-2 text-[0.95rem]">
            {facing && <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: 'var(--wash)' }}><Icon name="compass" size={17} />{FACING[facing]}</span>}
            {isOptional(step, s.tradition) && <span className="rounded-full px-3 py-1 muted" style={{ background: 'var(--wash)' }}>Optional: skip if it is not your practice</span>}
          </p>
        )}
      </header>
      {s.showInstructions && image && (
        <img src={image} alt="" className="step-figure mx-auto mb-5 max-h-72 w-full object-contain" />
      )}
      {todo.length > 1 ? (
        <ol className="prose-ui mb-4 grid gap-2.5">
          {todo.map((line, i) => (
            <li key={i} className="grid grid-cols-[1.4rem_1fr] gap-1">
              <span className="font-semibold tabular-nums" style={{ color: 'var(--kumkum)' }}>{i + 1}</span>
              <span><Md text={line} /></span>
            </li>
          ))}
        </ol>
      ) : todo.length === 1 && <p className="prose-ui mb-4"><Md text={todo[0]} /></p>}
      {(todo.length > 0 || (s.showInstructions && image)) && step.items.length > 0 && <hr className="rule my-2" />}
      {step.items.map((it, i) => <ItemView key={i} item={it} kala={kala} vars={vars} />)}
      {s.showAudio && videoAt != null && step.items.length > 0 && (
        <p className="muted mt-4 text-sm">
          The chant buttons use a synthesised voice without the Vedic tones. <a className="underline" style={{ color: 'var(--kumkum)' }} href={`${CHANT_VIDEO}&t=${videoAt}s`} target="_blank" rel="noreferrer">Hear this step chanted by T S Ranganathan</a> (opens YouTube).
        </p>
      )}
      {step.id === 'gayatri-japam' && <JapaCounter target={japaTarget(s.japaCount, kala)} />}
    </article>
  )
}
