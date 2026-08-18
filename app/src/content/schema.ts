import { z } from 'zod'
import { KALAS, SCRIPTS, TRADITIONS, type Kala, type Tradition } from '../config.ts'

// Mantra text: `iast` is authored (canonical, with Vedic svara combining marks);
// other scripts are optional pre-rendered forms. Missing scripts are transliterated at runtime.
export const Text = z.object({ iast: z.string() }).catchall(z.string())
export type Text = z.infer<typeof Text> & Partial<Record<(typeof SCRIPTS)[number], string>>

const Applicability = {
  kala: z.array(z.enum(KALAS)).optional(), // default: all three
  tradition: z.array(z.enum(TRADITIONS)).optional(), // default: both
  optional: z.boolean().optional(),
}

export const MantraItem = z.object({
  kind: z.literal('mantra'),
  id: z.string().optional(),
  text: Text,
  meaning: z.string().optional(), // English, markdown-lite
  action: z.string().optional(), // what to do while reciting
  repeat: z.union([z.number(), z.partialRecord(z.enum(KALAS), z.number())]).optional(),
  audio: z.string().optional(), // reserved: path/URL to chant audio
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

export const Step = z.object({
  id: z.string(),
  title: z.object({ sa: z.string(), en: z.string() }),
  section: z.enum(['purvanga', 'uttaranga']),
  intro: z.string().optional(), // instructions before the mantras (markdown-lite)
  facing: z.partialRecord(z.enum(KALAS), z.enum(['east', 'north', 'west'])).optional(),
  image: z.string().optional(),
  items: z.array(Item),
  sources: z.array(z.string()).optional(),
  ...Applicability,
})
export type Step = z.infer<typeof Step>
export const Content = z.object({ version: z.string(), steps: z.array(Step) })
export type Content = z.infer<typeof Content>

const applies = (x: { kala?: Kala[]; tradition?: Tradition[] }, kala: Kala, tradition: Tradition) =>
  (!x.kala || x.kala.includes(kala)) && (!x.tradition || x.tradition.includes(tradition))

/** Steps + items filtered for one performance. */
export function stepsFor(content: Content, kala: Kala, tradition: Tradition): Step[] {
  return content.steps
    .filter((s) => applies(s, kala, tradition))
    .map((s) => ({ ...s, items: s.items.filter((i) => applies(i, kala, tradition)) }))
    .filter((s) => s.items.length > 0 || s.intro)
}

export function repeatFor(item: MantraItem, kala: Kala): number | undefined {
  return typeof item.repeat === 'number' ? item.repeat : item.repeat?.[kala]
}
