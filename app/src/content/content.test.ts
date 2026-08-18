// Validates the merged content: schema, unique step ids, known placeholders, no unrendered scripts.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { Content, stepsFor } from './schema.ts'
import { KALAS, SCRIPTS, TRADITIONS } from '../config.ts'

const raw = JSON.parse(readFileSync(new URL('./sandhya.json', import.meta.url), 'utf8'))
const ALLOWED = new Set(['name', 'gotra', 'pravara', 'arsheya', 'sutra', 'kala', 'kalaEn', 'panchanga', 'japaCount'])

test('content matches schema', () => {
  const r = Content.safeParse(raw)
  assert.ok(r.success, r.success ? '' : JSON.stringify(r.error.issues.slice(0, 5), null, 2))
})
test('step ids unique; placeholders known; every mantra has all scripts', () => {
  const c = Content.parse(raw)
  const ids = c.steps.map((s) => s.id)
  assert.equal(new Set(ids).size, ids.length, 'duplicate step id: ' + ids.filter((x, i) => ids.indexOf(x) !== i))
  for (const s of c.steps) for (const it of s.items) {
    const texts = it.kind === 'mantra' ? [it.text.iast, it.meaning ?? '', it.action ?? ''] : [it.text]
    for (const t of texts) for (const m of t.matchAll(/\{(\w+)\}/g)) assert.ok(ALLOWED.has(m[1]), `unknown placeholder {${m[1]}} in ${s.id}`)
    if (it.kind === 'mantra') for (const sc of SCRIPTS) assert.ok(it.text[sc], `${s.id}: missing ${sc} — run pnpm xlit`)
  }
})
test('every kāla × tradition yields a non-trivial ritual', () => {
  const c = Content.parse(raw)
  for (const k of KALAS) for (const t of TRADITIONS) assert.ok(stepsFor(c, k, t).length >= 10, `${k}/${t} too few steps`)
})
