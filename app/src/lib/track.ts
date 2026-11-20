// Anonymous usage analytics (self-hosted Umami, no cookies). Nothing the user types — name, gotra, place — is ever sent.
import { ANALYTICS } from '../config'

declare global {
  interface Window { umami?: { track: (event: string, data?: Record<string, string | number>) => void } }
}

// Events fired before the tracker script has loaded (e.g. on a direct link into a sandhyā) wait here.
const queue: [string, Record<string, string | number> | undefined][] = []
let loading = false

/** Load the tracker once. It only reports from the production host, so local development is never counted. */
export function initAnalytics() {
  if (!ANALYTICS.websiteId || location.hostname !== ANALYTICS.host) return
  const s = document.createElement('script')
  s.defer = true
  s.src = ANALYTICS.script
  s.dataset.websiteId = ANALYTICS.websiteId
  s.dataset.excludeSearch = 'true' // the step number lives in ?s=; keep URLs to one per screen
  s.onload = () => { for (const [e, d] of queue.splice(0)) track(e, d) }
  loading = true
  document.head.appendChild(s)
}

/** Record a named event; a no-op until (or unless) the tracker has loaded. */
export function track(event: string, data?: Record<string, string | number>) {
  try {
    if (window.umami) window.umami.track(event, data)
    else if (loading && queue.length < 50) queue.push([event, data])
  } catch { /* analytics must never break the app */ }
}
