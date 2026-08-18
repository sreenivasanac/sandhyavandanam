// Run: pnpm test  (node --test with native TS stripping; no framework)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fill, md, stripSvara, xlit } from './text.ts'

test('svara marks map to Devanagari and follow visarga/anusvāra', () => {
  assert.equal(xlit('dhiyo̱ yo na̍ḥ', 'devanagari'), 'धियो॒ यो नः॑')
  assert.equal(xlit('vare̎ṇyaṃ', 'devanagari'), 'वरे᳚ण्यं')
  assert.equal(xlit('suva̍ḥ', 'kannada'), 'ಸುವಃ॑')
  assert.equal(xlit('na̍ḥ', 'tamil'), 'ந॑ஃ') // Tamil: accent stays before āytham
  assert.equal(xlit('oguṃ satyam', 'devanagari'), 'ओगुं सत्यम्')
})
test('iast passthrough, strip, fill, md', () => {
  assert.equal(xlit('na̍ḥ', 'iast'), 'na̍ḥ')
  assert.equal(stripSvara('dhiyo̱ yo na̍ḥ'), 'dhiyo yo naḥ')
  assert.equal(fill('{gotra} gotraḥ {x}', { gotra: 'kauśika' }), 'kauśika gotraḥ {x}')
  assert.deepEqual(md('say *oṃ* now'), ['say ', { i: 'oṃ' }, ' now'])
})
