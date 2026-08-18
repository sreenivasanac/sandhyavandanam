import { Link } from 'react-router-dom'
import { APP, KALAS, KALA_LABEL, TRADITION_LABEL, suggestKala } from '../config'
import { useSettings } from '../lib/settings'

export function Home() {
  const s = useSettings()
  const now = suggestKala()
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-1" style={{ color: 'var(--accent)' }}>{APP.name}</h1>
      <p className="font-sans mb-8" style={{ color: 'var(--fg-muted)' }}>
        {s.name ? `Namaste, ${s.name}. ` : ''}{TRADITION_LABEL[s.tradition]} · <Link to="/settings" className="underline">settings</Link>
      </p>
      <div className="grid gap-4">
        {KALAS.map((k) => (
          <div key={k} className="card p-5 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-40">
              <h2 className="text-2xl font-bold">{KALA_LABEL[k].sa}</h2>
              <p className="font-sans" style={{ color: 'var(--fg-muted)' }}>{KALA_LABEL[k].en} sandhyā{k === now ? ' · now' : ''}</p>
            </div>
            <Link to={`/perform/${k}`} className="btn btn-primary">Perform</Link>
            <Link to={`/read/${k}`} className="btn btn-ghost">Read</Link>
          </div>
        ))}
      </div>
      <footer className="font-sans text-sm mt-10 leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
        <p>Kṛṣṇa Yajur Veda (Āpastamba) sandhyā, Smārta and Śrī Vaiṣṇava variants, compiled from published procedure texts (Sri Rama / srimatham.com; Sunder Kidambi / prapatti.com; K. Chakravarthy; S. Narayanan et al.). Mantra text is under review — please follow your own guru/family tradition where it differs, and report corrections on <a className="underline" href={APP.repo} target="_blank" rel="noreferrer">GitHub</a>.</p>
      </footer>
    </div>
  )
}
