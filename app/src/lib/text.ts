import Sanscript from '@indic-transliteration/sanscript'
import type { Script } from '../config'
import type { Text } from '../content/schema'
import type { Settings } from './settings'
import { panchanga, panchangaPhrase } from './panchanga.ts'

// IAST combining svara marks (as authored) → Devanagari-block Vedic marks used by all Indic fonts.
// anudātta ̱ (U+0331) → ॒ (U+0952); svarita ̍ (U+030D) → ॑ (U+0951); dīrgha-svarita ̎ (U+030E) → ᳚ (U+1CDA)
const SVARA: Record<string, string> = { '̱': '॒', '̍': '॑', '̎': '᳚' }
const SVARA_RE = /[̱̍̎]/g
// Deva/Knda/Telu/Mlym fonts shape tone marks correctly only AFTER a visarga/anusvāra/candrabindu;
// IAST puts the accent on the vowel (na̍ḥ), so swap: न॑ः → नः॑. (Tamil ஃ is the opposite — leave it.)
const SVARA_BEFORE_SIGN = /([॒॑᳚])([ँ-ःఁ-ఃಁ-ಃംഃ])/g

/** Transliterate IAST → target script. Sanscript passes combining marks through; we remap them. */
export function xlit(iast: string, script: Script): string {
  if (script === 'iast') return iast
  return Sanscript.t(iast, 'iast', script)
    .replace(SVARA_RE, (m) => SVARA[m] ?? m)
    .replace(SVARA_BEFORE_SIGN, '$2$1')
}

/** Strip svara marks (for plain transliteration line / TTS input). */
export const stripSvara = (s: string) => s.replace(SVARA_RE, '')

/** Placeholders like {name} {gotra} inside mantra text, values in IAST. */
export type Vars = Record<string, string>
export function varsFrom(s: Settings, extra: Vars = {}): Vars {
  return {
    name: s.name || '…',
    gotra: s.gotra || '…',
    pravara: s.pravara || '…',
    sutra: s.sutra === 'other' ? '…' : s.sutra,
    japaCount: String(s.japaCount),
    arsheya: { 1: 'ekārṣeya', 3: 'trayārṣeya', 5: 'pañcārṣeya' }[s.arsheya],
    panchanga: s.detailedSankalpam && s.lat != null && s.lon != null ? panchangaPhrase(panchanga(new Date(), s.lat, s.lon, s.calendar)) : '',
    ...extra,
  }
}
export const fill = (s: string, vars: Vars) => s.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? `{${k}}`)

/** Final rendered mantra: pre-rendered script if content ships one, else transliterate; then fill vars. */
export function render(text: Text, script: Script, vars: Vars): string {
  const pre = text[script]
  const base = pre ?? xlit(text.iast, script)
  // vars are IAST; transliterate each value into the target script
  const v = Object.fromEntries(Object.entries(vars).map(([k, val]) => [k, xlit(val, script)]))
  return fill(base, v)
}

/** Markdown-lite for instructions: only *italic* is supported (used for inline mantra names). */
export function md(s: string): (string | { i: string })[] {
  return s.split(/\*([^*]+)\*/g).map((part, n) => (n % 2 ? { i: part } : part)).filter((p) => p !== '')
}
