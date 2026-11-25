import type { Kala } from '../config'
import { isOptional, pick, repeatFor, type Item } from '../content/schema'
import { useSettings } from '../lib/settings'
import { fill, isNyasa, render, stripSvara, type Vars } from '../lib/text'
import { Chant } from './Chant'
import { Md } from './Md'

const LANG: Record<string, string> = {
  devanagari: 'sa-Deva', iast: 'sa-Latn', tamil: 'sa-Taml', kannada: 'sa-Knda', telugu: 'sa-Telu', malayalam: 'sa-Mlym',
}

/** One line of a step: what to do, the mantra, its transliteration and meaning — or a plain note. */
export function ItemView({ item, kala, vars }: { item: Item; kala: Kala; vars: Vars }) {
  const s = useSettings()
  if (item.kind === 'note') {
    if (!s.showInstructions) return null
    return <p className="prose-ui my-4 border-l-2 pl-3 text-[0.95rem] muted" style={{ borderColor: 'var(--line)' }}><Md text={fill(item.text, vars)} /></p>
  }
  const main = render(item.text, s.script, vars)
  const roman = s.script !== 'iast' && s.showTransliteration ? stripSvara(render(item.text, 'iast', vars)) : null
  const n = repeatFor(item, kala)
  const hint = s.showActions && item.action
  // the clip of a personal line has pauses where your own words go; with the day's details added the text no longer matches any clip
  const audio = item.text.iast.includes('{panchanga}') && vars.panchanga ? undefined : pick(item.audio, kala, s.tradition)
  return (
    <div className="mantra-item py-4">
      {(hint || isOptional(item, s.tradition)) && (
        <p className="hint mb-1">
          {hint && <Md text={fill(item.action!, vars)} />}
          {isOptional(item, s.tradition) && <span className="faint">{hint ? ' (optional)' : 'Optional'}</span>}
        </p>
      )}
      <div className="flex items-start gap-3">
        <p className={`mantra min-w-0 flex-1 ${isNyasa(item.text.iast) ? 'mantra-quiet' : ''}`} lang={LANG[s.script]}>{main}</p>
        {audio && s.showAudio && <div className="pt-1.5"><Chant src={audio} /></div>}
      </div>
      {roman && <p className="translit mt-0.5" lang="sa-Latn">{roman}</p>}
      {audio && s.showAudio && /\{(?!kala\}|panchanga\})\w+\}/.test(item.text.iast) && <p className="faint mt-1 text-sm">The chant pauses where you say your own words.</p>}
      {n && n > 1 && <p className="mt-1.5 text-sm font-semibold" style={{ color: 'var(--turmeric)' }}>{item.unit === 'rounds' ? `Do ${n} rounds` : `Say ${n} times`}</p>}
      {s.showMeaning && item.meaning && <p className="prose-ui mt-2 text-[0.95rem] muted"><Md text={fill(item.meaning, vars)} /></p>}
    </div>
  )
}
