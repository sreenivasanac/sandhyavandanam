import { test } from 'node:test'
import assert from 'node:assert/strict'
import { panchanga } from './panchanga.ts'

const CHENNAI = [13.08, 80.27] as const
const at = (iso: string) => new Date(iso)

test('Diwali 2023-11-12 (Chennai): kṛṣṇa caturdaśī at sunrise, svātī, āśvayuja (amānta)/tulā, śobhakṛt, dakṣiṇāyana, śarad', () => {
  const p = panchanga(at('2023-11-12T10:00:00+05:30'), ...CHENNAI, 'lunar')
  assert.equal(p.paksha, 'kṛṣṇa'); assert.equal(p.tithi, 'caturdaśyāṃ'); assert.equal(p.nakshatra, 'svātī')
  assert.equal(p.masa, 'āśvayuja'); assert.equal(p.samvatsara, 'śobhakṛt'); assert.equal(p.ayana, 'dakṣiṇāyane'); assert.equal(p.vara, 'bhānu')
  const s = panchanga(at('2023-11-12T10:00:00+05:30'), ...CHENNAI, 'solar')
  assert.equal(s.masa, 'tulā'); assert.equal(s.rtu, 'śarad')
})
test('Rāma Navamī 2024-04-17: caitra śukla navamī, krodhi, meṣa (solar), vasanta', () => {
  const p = panchanga(at('2024-04-17T10:00:00+05:30'), ...CHENNAI, 'lunar')
  assert.equal(p.paksha, 'śukla'); assert.equal(p.tithi, 'navamyāṃ'); assert.equal(p.masa, 'caitra'); assert.equal(p.samvatsara, 'krodhi'); assert.equal(p.rtu, 'vasanta')
  const s = panchanga(at('2024-04-17T10:00:00+05:30'), ...CHENNAI, 'solar')
  assert.equal(s.masa, 'meṣa'); assert.equal(s.samvatsara, 'krodhi'); assert.equal(s.vara, 'saumya')
})
test('Adhika māsa 2023 (adhika śrāvaṇa: 18 Jul – 16 Aug 2023)', () => {
  assert.equal(panchanga(at('2023-08-01T10:00:00+05:30'), ...CHENNAI, 'lunar').adhika, true)
  assert.equal(panchanga(at('2023-08-20T10:00:00+05:30'), ...CHENNAI, 'lunar').adhika, false)
})
test('Year boundary: 2024-04-01 is still śobhakṛt (before Meṣa saṅkrānti / before Ugādi 9 Apr)', () => {
  assert.equal(panchanga(at('2024-04-01T10:00:00+05:30'), ...CHENNAI, 'solar').samvatsara, 'śobhakṛt')
  assert.equal(panchanga(at('2024-04-01T10:00:00+05:30'), ...CHENNAI, 'lunar').samvatsara, 'śobhakṛt')
})
