import { z } from 'zod'
import { KALAS, SCRIPTS, TRADITIONS, type Kala, type Tradition } from '../config.ts'

// Mantra text: `iast` is authored (canonical, with Vedic svara combining marks);
// other scripts are optional pre-rendered forms. Missing scripts are transliterated at runtime.
export const Text = z.object({ iast: z.string() }).catchall(z.string())
export type Text = z.infer<typeof Text> & Partial<Record<(typeof SCRIPTS)[number], string>>

const Applicability = {
  kala: z.array(z.enum(KALAS)).optional(), // default: all three
  tradition: z.array(z.enum(TRADITIONS)).optional(), // default: both
  optional: z.union([z.boolean(), z.array(z.enum(TRADITIONS))]).optional(), // true: optional for everyone; a list: optional only for those traditions
}

export const MantraItem = z.object({
  kind: z.literal('mantra'),
  id: z.string().optional(),
  text: Text,
  meaning: z.string().optional(), // English, markdown-lite
  action: z.string().optional(), // what to do while reciting
  repeat: z.union([z.number(), z.partialRecord(z.enum(KALAS), z.number())]).optional(),
  unit: z.enum(['times', 'rounds']).optional(), // how `repeat` is worded: "Say 3 times" (default) or "Do 3 rounds" (prāṇāyāma)
  audio: z.union([z.string(), z.partialRecord(z.enum(KALAS), z.string())]).optional(), // chant clip; one per time of day when the line names it
  verified: z.boolean().optional(),
  ...Applicability,
})
export const NoteItem = z.object({
  kind: z.literal('note'),
  text: z.string(),
  ...Applicability,
})
export const Item = z.discriminatedUnion('kind', [MantraItem, NoteItem])
export type Item = z.infer<typeof Item>
export type MantraItem = z.infer<typeof MantraItem>

// One line of a step's "what to do" list. A plain string applies always; the object form limits it to a kāla or tradition.
export const TodoLine = z.union([z.string(), z.object({ text: z.string(), kala: Applicability.kala, tradition: Applicability.tradition })])
export type TodoLine = z.infer<typeof TodoLine>

const Facing = z.partialRecord(z.enum(KALAS), z.enum(['east', 'north', 'west']))
const ByKala = z.union([z.string(), z.partialRecord(z.enum(KALAS), z.string())])

export const Step = z.object({
  id: z.string(),
  title: z.object({ sa: z.string(), en: z.string() }),
  section: z.enum(['purvanga', 'uttaranga']),
  intro: z.string().optional(), // legacy: one paragraph, split into lines by sentence
  todo: z.array(TodoLine).optional(), // preferred: one short action per line (markdown-lite); replaces `intro` when present
  facing: z.union([Facing, z.record(z.enum(TRADITIONS), Facing)]).optional(), // by time of day; or first by tradition where the traditions differ
  image: z.union([z.string(), z.record(z.enum(TRADITIONS), ByKala)]).optional(), // one picture, or one per tradition (the body marks differ), which may again differ by time of day
  items: z.array(Item),
  sources: z.array(z.string()).optional(),
  ...Applicability,
})
export type Step = z.infer<typeof Step>
export const Content = z.object({ version: z.string(), steps: z.array(Step) })
export type Content = z.infer<typeof Content>

const applies = (x: { kala?: Kala[]; tradition?: Tradition[] }, kala: Kala, tradition: Tradition) =>
  (!x.kala || x.kala.includes(kala)) && (!x.tradition || x.tradition.includes(tradition))

/** Is this step or line optional for this tradition? */
export const isOptional = (x: { optional?: boolean | Tradition[] }, tradition: Tradition) =>
  Array.isArray(x.optional) ? x.optional.includes(tradition) : !!x.optional

/** Steps + items filtered for one performance. Parts marked `optional` are left out unless `withOptional`. */
export function stepsFor(content: Content, kala: Kala, tradition: Tradition, withOptional = true): Step[] {
  return content.steps
    .filter((s) => applies(s, kala, tradition) && (withOptional || !isOptional(s, tradition)))
    .map((s) => ({
      ...s,
      items: s.items.filter((i) => applies(i, kala, tradition) && (withOptional || !isOptional(i, tradition))),
      todo: s.todo?.filter((l) => typeof l === 'string' || applies(l, kala, tradition)),
    }))
    .filter((s) => s.items.length > 0 || s.intro || s.todo?.length)
}

export function repeatFor(item: MantraItem, kala: Kala): number | undefined {
  return typeof item.repeat === 'number' ? item.repeat : item.repeat?.[kala]
}

/** Pick the value for this performance from a field that may be plain, per tradition, per time of day, or both. */
export function pick<T extends string>(v: undefined | T | Partial<Record<string, T | Partial<Record<Kala, T>>>>, kala: Kala, tradition: Tradition): T | undefined {
  if (v === undefined || typeof v === 'string') return v
  const byTradition = tradition in v ? v[tradition] : v // a per-kāla record has no tradition keys
  return typeof byTradition === 'object' ? (byTradition as Partial<Record<Kala, T>>)[kala] : (byTradition as T | undefined)
}
