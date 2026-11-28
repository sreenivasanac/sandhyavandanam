import type { Settings } from './settings'
import { TZ_COORDS } from './tzcoords.ts'

// Optional refinement: a nearby city gives exact sunrise times. Without one, the time zone gives an approximate place.
export const PLACES: [string, number, number][] = [
  ['Chennai', 13.08, 80.27], ['Bengaluru', 12.97, 77.59], ['Hyderabad', 17.39, 78.49], ['Mumbai', 19.08, 72.88],
  ['Pune', 18.52, 73.86], ['Delhi', 28.61, 77.21], ['Kolkata', 22.57, 88.36], ['Coimbatore', 11.02, 76.96],
  ['Tiruchirappalli', 10.79, 78.7], ['Madurai', 9.93, 78.12], ['Mysuru', 12.3, 76.64], ['Thiruvananthapuram', 8.52, 76.94],
  ['Singapore', 1.35, 103.82], ['Dubai', 25.2, 55.27], ['London', 51.51, -0.13], ['New York', 40.71, -74.01],
  ['Chicago', 41.88, -87.63], ['Dallas', 32.78, -96.8], ['San Francisco Bay Area', 37.39, -122.08], ['Seattle', 47.61, -122.33],
  ['Toronto', 43.65, -79.38], ['Sydney', -33.87, 151.21],
]

// One-tap time zones: where visitors are so far (Umami, Nov 2026: India, US, Switzerland, Canada, UK, UAE, Kuwait), plus a few common ones.
export const COMMON_TZ: [label: string, tz: string][] = [
  ['India (IST)', 'Asia/Kolkata'], ['US Eastern', 'America/New_York'], ['US Central', 'America/Chicago'], ['US Pacific', 'America/Los_Angeles'],
  ['UK', 'Europe/London'], ['Central Europe', 'Europe/Zurich'], ['Gulf (UAE, Oman)', 'Asia/Dubai'], ['Arabia (Kuwait, Saudi)', 'Asia/Riyadh'],
  ['Singapore', 'Asia/Singapore'], ['Sydney', 'Australia/Sydney'],
]

// Older names some devices still report
const ALIAS: Record<string, string> = { 'Asia/Calcutta': 'Asia/Kolkata', 'US/Eastern': 'America/New_York', 'US/Central': 'America/Chicago', 'US/Pacific': 'America/Los_Angeles', 'US/Mountain': 'America/Denver', 'Asia/Katmandu': 'Asia/Kathmandu', 'Europe/Kiev': 'Europe/Kyiv', 'Asia/Saigon': 'Asia/Ho_Chi_Minh', 'Asia/Rangoon': 'Asia/Yangon', 'America/Indianapolis': 'America/Indiana/Indianapolis', 'Asia/Dacca': 'Asia/Dhaka' }
export const canonTz = (tz: string) => ALIAS[tz] ?? tz
export const ALL_TZ = Object.keys(TZ_COORDS)

/** The device's own time zone: read from the system, so no location permission is needed. */
export function deviceTz(): string {
  try { return canonTz(Intl.DateTimeFormat().resolvedOptions().timeZone) } catch { return '' }
}

/** Readable name: the common label if it has one, else "Tokyo (Asia)". */
export function tzLabel(tz: string): string {
  const c = COMMON_TZ.find(([, z]) => z === tz)
  if (c) return c[0]
  const [region, ...rest] = tz.split('/')
  return rest.length ? `${rest.join(' / ').replace(/_/g, ' ')} (${region})` : tz
}

export type Place = { lat: number; lon: number; label: string; approx: boolean }

/** Where sunrise and the pañcāṅga are computed for: a chosen city, else the chosen (or device) time zone's main city. */
export function placeOf(s: Pick<Settings, 'lat' | 'lon' | 'place' | 'tz'>): Place | null {
  if (s.lat != null && s.lon != null) return { lat: s.lat, lon: s.lon, label: s.place || 'your place', approx: false }
  const tz = canonTz(s.tz || deviceTz())
  const c = TZ_COORDS[tz]
  return c ? { lat: c[0], lon: c[1], label: tzLabel(tz), approx: true } : null
}
