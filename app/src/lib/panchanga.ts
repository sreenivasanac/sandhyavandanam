// Panchāṅga fields for the saṅkalpam, computed from first principles with astronomy-engine.
// Conventions: values are taken at local sunrise (the day's prevailing tithi/nakṣatra), Lahiri ayanāṃśa,
// amānta lunar months. `calendar: 'solar'` (Tamil usage: māsa/ṛtu/saṃvatsara from the sidereal sun) or
// `'lunar'` (Kannada/Telugu usage: lunar māsa, ṛtu from month pairs, year from Caitra Ś1).
import * as A from 'astronomy-engine'

export type Calendar = 'solar' | 'lunar'
export interface Panchanga {
  samvatsara: string
  ayana: 'uttarāyaṇe' | 'dakṣiṇāyane'
  rtu: string
  masa: string
  adhika: boolean
  paksha: 'śukla' | 'kṛṣṇa'
  tithi: string
  vara: string
  nakshatra: string
  sunrise: Date
}

const SAMVATSARA = ['prabhava', 'vibhava', 'śukla', 'pramoda', 'prajāpati', 'āṅgīrasa', 'śrīmukha', 'bhāva', 'yuva', 'dhātṛ', 'īśvara', 'bahudhānya', 'pramāthi', 'vikrama', 'vṛṣa', 'citrabhānu', 'subhānu', 'tāraṇa', 'pārthiva', 'vyaya', 'sarvajit', 'sarvadhāri', 'virodhi', 'vikṛti', 'khara', 'nandana', 'vijaya', 'jaya', 'manmatha', 'durmukhi', 'hevilambi', 'vilambi', 'vikāri', 'śārvari', 'plava', 'śubhakṛt', 'śobhakṛt', 'krodhi', 'viśvāvasu', 'parābhava', 'plavaṅga', 'kīlaka', 'saumya', 'sādhāraṇa', 'virodhikṛt', 'paridhāvi', 'pramādīca', 'ānanda', 'rākṣasa', 'nala', 'piṅgala', 'kālayukti', 'siddhārthi', 'raudri', 'durmati', 'dundubhi', 'rudhirodgāri', 'raktākṣi', 'krodhana', 'akṣaya']
const SOLAR_MASA = ['meṣa', 'vṛṣabha', 'mithuna', 'karkaṭaka', 'siṃha', 'kanyā', 'tulā', 'vṛścika', 'dhanur', 'makara', 'kumbha', 'mīna']
const LUNAR_MASA = ['caitra', 'vaiśākha', 'jyeṣṭha', 'āṣāḍha', 'śrāvaṇa', 'bhādrapada', 'āśvayuja', 'kārtika', 'mārgaśīrṣa', 'puṣya', 'māgha', 'phālguna']
const RTU = ['vasanta', 'grīṣma', 'varṣa', 'śarad', 'hemanta', 'śiśira'] // pairs of months starting Meṣa / Caitra
// tithi names in locative (…tithau)
const TITHI = ['prathamāyāṃ', 'dvitīyāyāṃ', 'tṛtīyāyāṃ', 'caturthyāṃ', 'pañcamyāṃ', 'ṣaṣṭhyāṃ', 'saptamyāṃ', 'aṣṭamyāṃ', 'navamyāṃ', 'daśamyāṃ', 'ekādaśyāṃ', 'dvādaśyāṃ', 'trayodaśyāṃ', 'caturdaśyāṃ']
const VARA = ['bhānu', 'indu', 'bhauma', 'saumya', 'guru', 'bhṛgu', 'sthira'] // Sunday..Saturday (…vāsare)
export const NAKSHATRA = ['aśvinī', 'bharaṇī', 'kṛttikā', 'rohiṇī', 'mṛgaśīrṣa', 'ārdrā', 'punarvasu', 'puṣya', 'āśleṣā', 'maghā', 'pūrva phalgunī', 'uttara phalgunī', 'hasta', 'citrā', 'svātī', 'viśākhā', 'anurādhā', 'jyeṣṭhā', 'mūla', 'pūrvāṣāḍhā', 'uttarāṣāḍhā', 'śravaṇa', 'dhaniṣṭhā', 'śatabhiṣak', 'pūrva bhādrapadā', 'uttara bhādrapadā', 'revatī']

const norm = (x: number) => ((x % 360) + 360) % 360
// Lahiri ayanāṃśa: 23.853° at J2000, precessing 50.29″/yr. Accurate to ~1′ for ±100 years — enough for day-level fields.
const ayanamsa = (t: A.AstroTime) => 23.853 + (50.29 / 3600) * (t.tt / 365.25)
const sunSid = (t: A.AstroTime) => norm(A.SunPosition(t).elon - ayanamsa(t))
const moonSid = (t: A.AstroTime) => norm(A.EclipticGeoMoon(t).lon - ayanamsa(t))
const sunRasi = (t: A.AstroTime) => Math.floor(sunSid(t) / 30)

/** Compute the panchāṅga for the civil day containing `date` at the given place. */
export function panchanga(date: Date, lat: number, lon: number, calendar: Calendar = 'solar'): Panchanga {
  const obs = new A.Observer(lat, lon, 0)
  // Work in local *solar* time (UTC + lon/15h) so results don't depend on the device's timezone.
  const off = (lon / 15) * 3600e3
  const local = (d: Date) => new Date(d.getTime() + off)
  const dayStart = new Date(local(date).setUTCHours(0, 0, 0, 0) - off)
  const rise = A.SearchRiseSet(A.Body.Sun, obs, +1, A.MakeTime(dayStart), 1)
  const t = rise ?? A.MakeTime(new Date(dayStart.getTime() + 6 * 3600e3)) // polar fallback: 06:00
  const sunrise = t.date
  const L = local(sunrise)

  const elong = norm(A.EclipticGeoMoon(t).lon - A.SunPosition(t).elon)
  const ti = Math.floor(elong / 12) // 0..29
  const paksha = ti < 15 ? 'śukla' : 'kṛṣṇa'
  const tithi = ti % 15 === 14 ? (ti === 14 ? 'paurṇamāsyāṃ' : 'amāvāsyāyāṃ') : TITHI[ti % 15]
  const nakshatra = NAKSHATRA[Math.floor(moonSid(t) / (360 / 27))]
  const vara = VARA[L.getUTCDay()]

  const rasi = sunRasi(t)
  const ayana = rasi >= 9 || rasi < 3 ? 'uttarāyaṇe' : 'dakṣiṇāyane' // Makara..Mithuna

  // amānta lunar month = named after the rāśi of the sun at the preceding new moon (+1). Adhika if the next new moon is in the same rāśi.
  const prevNew = A.SearchMoonPhase(0, t, -35)!
  const nextNew = A.SearchMoonPhase(0, prevNew.AddDays(1), 35)!
  const r0 = sunRasi(prevNew)
  const adhika = r0 === sunRasi(nextNew)
  const lunarIdx = (r0 + 1) % 12

  // Year of the 60-year cycle: 1987-88 = prabhava. Solar: year turns at Meṣa saṅkrānti; lunar: at Caitra Ś1 (≈ prevNew when month is caitra).
  const y = L.getUTCFullYear()
  const m = L.getUTCMonth() // 0-based
  const solarYear = m < 3 || (m === 3 && rasi === 11) ? y - 1 : y // before Meṣa saṅkrānti (mid-April)
  const lunarYear = m <= 4 && lunarIdx >= 9 ? y - 1 : y // puṣya/māgha/phālguna of the previous year
  const samvatsara = SAMVATSARA[(((calendar === 'solar' ? solarYear : lunarYear) - 1987) % 60 + 60) % 60]

  const masa = calendar === 'solar' ? SOLAR_MASA[rasi] : LUNAR_MASA[lunarIdx]
  const rtu = RTU[Math.floor((calendar === 'solar' ? rasi : lunarIdx) / 2)]
  return { samvatsara, ayana, rtu, masa, adhika: calendar === 'lunar' && adhika, paksha, tithi, vara, nakshatra, sunrise }
}

/** IAST placeholders for the detailed saṅkalpam. */
export function panchangaVars(p: Panchanga): Record<string, string> {
  return {
    samvatsara: p.samvatsara,
    ayana: p.ayana,
    rtu: p.rtu,
    masa: (p.adhika ? 'adhika ' : '') + p.masa,
    paksha: p.paksha,
    tithi: p.tithi,
    vara: p.vara,
    nakshatra: p.nakshatra,
  }
}

/** The saṅkalpam phrase (IAST) inserted before "{kala} sandhyām…" when detailed saṅkalpam is on. */
export function panchangaPhrase(p: Panchanga): string {
  return `śrī ${p.samvatsara} nāma saṃvatsare ${p.ayana} ${p.rtu} ṛtau ${p.adhika ? 'adhika ' : ''}${p.masa} māse ${p.paksha} pakṣe ${p.tithi} tithau ${p.vara} vāsara yuktāyāṃ ${p.nakshatra} nakṣatra yuktāyāṃ śubhayoga śubhakaraṇa evaṃguṇa viśeṣaṇa viśiṣṭāyāṃ asyāṃ ${p.tithi} śubhatithau `
}
