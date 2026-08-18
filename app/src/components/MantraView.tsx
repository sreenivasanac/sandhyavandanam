import type { Kala } from '../config'
import { repeatFor, type Item } from '../content/schema'
import { useSettings } from '../lib/settings'
import { fill, render, stripSvara, type Vars } from '../lib/text'
import { Md } from './Md'
import { Opt } from './StepView'

const LANG: Record<string, string> = {
  devanagari: 'sa-Deva', iast: 'sa-Latn', tamil: 'sa-Taml', kannada: 'sa-Knda', telugu: 'sa-Telu', malayalam: 'sa-Mlym',
}

/** One item of a step: a mantra (script + transliteration + meaning + action) or a note. */
export function ItemView({ item, kala, vars }: { item: Item; kala: Kala; vars: Vars }) {
  const s = useSettings()
  if (item.kind === 'note') return <p className="my-3 font-sans text-[0.95rem]" style={{ color: 'var(--fg-muted)' }}><Md text={fill(item.text, vars)} /></p>

  const main = render(item.text, s.script, vars)
  const roman = s.script !== 'iast' && s.showTransliteration ? stripSvara(render(item.text, 'iast', vars)) : null
  const n = repeatFor(item, kala)
  return (
    <div className="my-4">
      {(item.optional || (s.showActions && item.action)) && (
        <p className="font-sans text-sm mb-1" style={{ color: 'var(--accent)' }}>{s.showActions && item.action ? <>▸ <Md text={fill(item.action, vars)} /></> : null}{item.optional && <Opt />}</p>
      )}
      <p className="mantra" lang={LANG[s.script]}>{main}</p>
      {roman && <p className="font-serif italic opacity-80 mt-1 whitespace-pre-wrap" lang="sa-Latn">{roman}</p>}
      {n && n > 1 && <p className="font-sans text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>× {n}</p>}
      {s.showMeaning && item.meaning && (
        <p className="mt-2 font-sans text-[0.95rem] leading-relaxed" style={{ color: 'var(--fg-muted)' }}><Md text={fill(item.meaning, vars)} /></p>
      )}
      {item.audio && <audio controls preload="none" src={item.audio} className="mt-2 w-full max-w-sm" />}
    </div>
  )
}
