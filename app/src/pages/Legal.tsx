// Privacy policy and support pages. Both app stores link to these on the website, and the apps show the same pages.
import { Capacitor } from '@capacitor/core'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { APP, CHANT_VIDEO } from '../config'
import { useSettings } from '../lib/settings'

function Page({ title, children }: { title: string; children: React.ReactNode }) {
  useEffect(() => { document.title = `${title} · ${APP.name}`; window.scrollTo(0, 0) }, [title])
  return (
    <div className="mx-auto max-w-xl px-5 pb-20 pt-[env(safe-area-inset-top)]">
      <header className="-mx-3 flex h-13 items-center"><Link to="/" className="icon-btn" aria-label="Home"><Icon name="left" /></Link></header>
      <h1 className="display mb-6 mt-4 text-4xl">{title}</h1>
      <div className="legal">{children}</div>
    </div>
  )
}
const A = ({ href, children }: { href: string; children: React.ReactNode }) => <a className="underline" style={{ color: 'var(--kumkum)' }} href={href} target="_blank" rel="noreferrer">{children}</a>

export function Privacy() {
  return (
    <Page title="Privacy">
      <p className="muted">Last updated {APP.policyDate}. This covers the {APP.name} website ({APP.url.replace('https://', '')}) and the {APP.name} mobile apps.</p>
      <h2>In short</h2>
      <p>There are no accounts, no advertising and no tracking across other apps or sites. What you enter stays on your device.</p>
      <h2>What stays on your device</h2>
      <p>Your settings and your progress through a sandhyā are stored only on your device. Your name, gotra, pravara, nakṣatra, time zone or city, and reminder times are never sent to us or to anyone else, from the website or the apps. Clearing the site's data in your browser, or deleting the app, removes them.</p>
      <h2>Location</h2>
      <p>The app never asks for your location. Sunrise, sunset and the day's pañcāṅga are worked out on your device from its time zone, or from a time zone or nearby city you choose in Settings. That choice is saved with your other settings and is not sent anywhere.</p>
      <h2>Notifications</h2>
      <p>The mobile apps can remind you of each sandhyā. These are local notifications: your phone schedules and shows them itself. No server is involved and no notification token is collected.</p>
      <h2>The mobile apps</h2>
      <p>The apps collect no data. They contain no analytics and no third-party software that collects data, and they work without a network connection.</p>
      <h2>The website</h2>
      <p>The website counts page views with Umami, an analytics tool we host ourselves. It uses no cookies and stores no personal data: it records the page opened, the referring site, the browser and device type, the country worked out from the IP address, and four events (a sandhyā begun, a section reached, a sandhyā completed, a chant clip played) with the time of day, the tradition and the script chosen. The IP address itself is not stored. Nothing you type is included. The site is hosted on a server in Finland, which keeps ordinary web-server logs for a short time for security.</p>
      <h2>Feedback you send</h2>
      <p>If you use “Send feedback”, your message is posted as a public issue on the app's GitHub page, with the page you came from, the app type (website, iPhone or Android), and the tradition and script you use. Your name, gotra and place are not included. A contact you add, so we can reply, is not published: it is kept on our server only to answer you.</p>
      <h2>Links to other sites</h2>
      <p>Each step links to <A href={CHANT_VIDEO}>a recorded chant on YouTube</A>, and the credits link to other sites. Those open outside this app and follow their own privacy policies.</p>
      <h2>Children</h2>
      <p>The app is suitable for all ages and collects nothing from anyone, children included.</p>
      <h2>Changes and contact</h2>
      <p>If this policy changes, the new text and date will appear on this page. Questions: see <Link className="underline" style={{ color: 'var(--kumkum)' }} to="/support">Support</Link>.</p>
    </Page>
  )
}

export function Support() {
  return (
    <Page title="Support">
      <h2>Questions and corrections</h2>
      <p>If a mantra, a meaning, an instruction or a picture is wrong, something does not work, or you would like something added, please <Link className="underline" style={{ color: 'var(--kumkum)' }} to="/feedback">send feedback</Link>. No account is needed. Say which sandhyā and step it is. If you have a GitHub account you can also <A href={APP.support}>open an issue there</A>.</p>
      <h2>About the text</h2>
      <p>The procedure follows Kṛṣṇa Yajur Veda (Āpastamba) in the Smārta and Śrī Vaiṣṇava traditions, compiled from printed procedure texts. It is still being reviewed. Where your teacher or family practice differs, follow them.</p>
      <h2>About the chant</h2>
      <p>The chant buttons play a synthesised voice (<A href="https://prathosh.in/vagdhenu/">Vāgdhenu</A>, from Prof. Prathosh A P's <A href="https://prathosh.in/vagbodhini/">Vāgbodhinī</A> project at the Indian Institute of Science). It says each syllable, but Vedic mantras are in a flat tone, without svaras. It is a help with pronunciation and not a substitute for learning from a teacher. Each step links to a recording by a person.</p>
      <h2>Common questions</h2>
      <p><b>Does it work offline?</b> Yes. The mobile apps hold everything. The website works offline after the first visit; a chant clip is kept once you have played it.</p>
      <p><b>How do I change tradition, script or text size?</b> Open Settings from the home screen, or the display button while performing a sandhyā.</p>
      <p><b>Why are some steps missing?</b> Parts that only some families do are hidden until you switch on “Optional parts” in Settings.</p>
      <p><b>How do I move my settings to another device?</b> On the website, Settings has Export and Import. The mobile apps keep settings on the phone only.</p>
      <p className="muted mt-8">The source is open: <A href={APP.repo}>{APP.repo.replace('https://', '')}</A>. See also <Link className="underline" to="/privacy">Privacy</Link>.</p>
    </Page>
  )
}

const KINDS = [['bug', 'Something is wrong'], ['correction', 'A mantra or step to correct'], ['idea', 'An idea or request'], ['other', 'Other']] as const

/** Feedback form: posted to server/feedback.py, which files a GitHub issue. Opened as /feedback?from=<path>. */
export function Feedback() {
  const s = useSettings()
  const from = useSearchParams()[0].get('from') ?? ''
  const [kind, setKind] = useState<(typeof KINDS)[number][0]>('bug')
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [state, setState] = useState<{ sending?: boolean; error?: string; issue?: number }>({})
  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState({ sending: true })
    try {
      const r = await fetch(APP.feedbackApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, message, contact, page: from, platform: Capacitor.getPlatform(), tradition: s.tradition, script: s.script,
          website: (e.currentTarget.elements.namedItem('website') as HTMLInputElement).value }),
      })
      const j = await r.json().catch(() => ({}))
      setState(r.ok ? { issue: j.issue ?? 0 } : { error: j.error ?? 'Could not send. Please try again.' })
    } catch {
      setState({ error: navigator.onLine ? 'Could not reach the server. Please try again.' : 'You are offline. Connect and try again; your message is still here.' })
    }
  }
  if (state.issue !== undefined) return (
    <Page title="Thank you">
      <p>Your feedback has been sent{state.issue ? <> and filed as <A href={`${APP.repo}/issues/${state.issue}`}>issue #{state.issue}</A>, where you can follow it</> : ''}.</p>
      <p className="mt-6"><Link to={from.startsWith('/') && !from.startsWith('//') ? from : '/'} className="btn btn-quiet">Back</Link></p>
    </Page>
  )
  return (
    <Page title="Send feedback">
      <p className="muted">A bug, a correction to a mantra or step, or something you would like added. Your message becomes a public issue on the app's GitHub page; no account is needed.</p>
      <form onSubmit={send} className="mt-6 grid gap-5">
        <fieldset>
          <legend className="mb-2 font-semibold">What is it about?</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup">
            {KINDS.map(([k, label]) => <button type="button" key={k} role="radio" aria-checked={kind === k} className="chip" onClick={() => setKind(k)}>{label}</button>)}
          </div>
        </fieldset>
        <label className="grid gap-2">
          <span className="font-semibold">Your message</span>
          <textarea className="input py-2" style={{ minHeight: "9rem" }} required minLength={5} maxLength={5000} value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder={kind === 'correction' ? 'Which sandhyā and step, what it says, and what it should say' : kind === 'bug' ? 'What you did, and what went wrong' : ''} />
        </label>
        <label className="grid gap-2">
          <span className="font-semibold">Email or phone <span className="muted font-normal">(optional, if you would like a reply)</span></span>
          <input className="input" type="text" autoComplete="email" maxLength={200} value={contact} onChange={(e) => setContact(e.target.value)} />
          <span className="muted text-sm">Not published. Kept on our server only to reply to you.</span>
        </label>
        {/* honeypot: hidden from people, filled in by bots */}
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-px w-px opacity-0" />
        {state.error && <p role="alert" style={{ color: 'var(--kumkum)' }}>{state.error}</p>}
        <div><button className="btn btn-primary btn-lg" disabled={state.sending || message.trim().length < 5}>{state.sending ? 'Sending…' : 'Send feedback'}</button></div>
      </form>
    </Page>
  )
}
