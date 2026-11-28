// Daily sandhyā reminders in the native apps (iOS today, Android later): local notifications, scheduled on the device.
// The website has no reminders; everything here is a no-op there.
import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { KALAS, KALA_LABEL, type Kala } from '../config'
import { panchanga } from './panchanga'
import { placeOf } from './places'
import { useSettings, type Settings } from './settings'

export const NATIVE = Capacitor.isNativePlatform()
const ID: Record<Kala, number> = { pratah: 1, madhyahnika: 2, sayam: 3 }
const LEAD_MIN = 20 // remind this long before sunrise / sunset, so there is time to get ready

const hhmm = (d: Date) => {
  const m = Math.round((d.getHours() * 60 + d.getMinutes()) / 5) * 5 // to the nearest five minutes
  return `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

/** Starting time for a reminder: a little before today's sunrise / sunset at the chosen city or time zone, else 6, 12 and 6 by the clock. */
export function defaultTime(kala: Kala, s: Pick<Settings, 'lat' | 'lon' | 'place' | 'tz'>): string {
  if (kala === 'madhyahnika') return '12:00'
  const pl = placeOf(s)
  if (!pl) return kala === 'pratah' ? '06:00' : '18:00'
  const p = panchanga(new Date(), pl.lat, pl.lon)
  const at = kala === 'pratah' ? p.sunrise : p.sunset
  return at ? hhmm(new Date(at.getTime() - LEAD_MIN * 60e3)) : kala === 'pratah' ? '06:00' : '18:00'
}

/** Ask for notification permission (the system shows its prompt only the first time). */
export async function allowReminders(): Promise<boolean> {
  if (!NATIVE) return false
  return (await LocalNotifications.requestPermissions()).display === 'granted'
}

/**
 * Make the scheduled notifications match the settings: one repeating daily notification per switched-on sandhyā.
 * Inexact on Android: an exact alarm needs the user to grant "Alarms & reminders" in system settings, and a reminder a few minutes late is fine.
 */
async function sync(reminders: Settings['reminders']) {
  await LocalNotifications.cancel({ notifications: KALAS.map((k) => ({ id: ID[k] })) })
  const notifications = KALAS.flatMap((k) => {
    const [hour, minute] = (reminders[k] ?? '').split(':').map(Number)
    if (!Number.isInteger(hour) || !Number.isInteger(minute)) return []
    return [{ id: ID[k], title: `${KALA_LABEL[k].sa} sandhyā`, body: `Time for the ${KALA_LABEL[k].en.toLowerCase()} sandhyāvandanam.`, schedule: { on: { hour, minute }, allowWhileIdle: true }, isExactNotification: false, extra: { kala: k } }]
  })
  if (notifications.length) await LocalNotifications.schedule({ notifications })
}

/** Call once at start-up: keeps notifications in step with the settings (also after an import or reset) and opens the right sandhyā when one is tapped. */
export function initReminders() {
  if (!NATIVE) return
  // one sync at a time, in order, so the newest settings are always the ones left scheduled
  let queue: Promise<void> = Promise.resolve()
  const run = (r: Settings['reminders']) => { queue = queue.then(() => sync(r)).catch(() => { /* reminders must never break the app */ }) }
  run(useSettings.getState().reminders)
  useSettings.subscribe((s, prev) => { if (s.reminders !== prev.reminders) run(s.reminders) })
  LocalNotifications.addListener('localNotificationActionPerformed', (e) => {
    const kala = e.notification.extra?.kala
    if ((KALAS as readonly string[]).includes(kala)) location.assign(`/perform/${kala}`)
  })
}
