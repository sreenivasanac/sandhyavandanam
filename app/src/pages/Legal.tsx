// Privacy policy and support pages. Both app stores link to these on the website, and the apps show the same pages.
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { APP, CHANT_VIDEO } from '../config'

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
      <p>Your settings and your progress through a sandhyā are stored only on your device. Your name, gotra, pravara, nakṣatra, place (latitude and longitude) and reminder times are never sent to us or to anyone else, from the website or the apps. Clearing the site's data in your browser, or deleting the app, removes them.</p>
      <h2>Location</h2>
      <p>If you choose “Use my location”, your device gives the app your position once, to work out sunrise, sunset and the day's pañcāṅga. The calculation happens on your device. The position is rounded and saved with your other settings, and is not sent anywhere. You can pick a city from the list instead.</p>
      <h2>Notifications</h2>
      <p>The mobile apps can remind you of each sandhyā. These are local notifications: your phone schedules and shows them itself. No server is involved and no notification token is collected.</p>
      <h2>The mobile apps</h2>
      <p>The apps collect no data. They contain no analytics and no third-party software that collects data, and they work without a network connection.</p>
      <h2>The website</h2>
      <p>The website counts page views with Umami, an analytics tool we host ourselves. It uses no cookies and stores no personal data: it records the page opened, the referring site, the browser and device type, the country worked out from the IP address, and four events (a sandhyā begun, a section reached, a sandhyā completed, a chant clip played) with the time of day, the tradition and the script chosen. The IP address itself is not stored. Nothing you type is included. The site is hosted on a server in Finland, which keeps ordinary web-server logs for a short time for security.</p>
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
      <p>If a mantra, a meaning, an instruction or a picture is wrong, or something in the app does not work, please <A href={APP.support}>open an issue on GitHub</A>. Say which sandhyā, tradition and step it is.</p>
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
