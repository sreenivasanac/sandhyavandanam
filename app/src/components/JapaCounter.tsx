import { useState } from 'react'

/** Tap counter for the Gāyatrī japa — a memory aid only; vibrates briefly at the target where supported. */
export function JapaCounter({ target }: { target: number }) {
  const [n, setN] = useState(0)
  const tap = () => {
    const next = Math.min(n + 1, target)
    if (next === target && n !== target) navigator.vibrate?.(200)
    setN(next)
  }
  return (
    <div className="my-6 text-center font-sans">
      <button type="button" onClick={tap} aria-label={`Count one japa, ${n} of ${target}`}
        className="mx-auto flex size-44 flex-col items-center justify-center rounded-full border-2 select-none touch-manipulation"
        style={{ borderColor: 'var(--accent)', background: 'var(--accent-soft)' }}>
        <b className="font-serif text-6xl">{n}</b>
        <span className="text-sm" style={{ color: 'var(--fg-muted)' }}>of {target}{n === target ? ' ✓' : ''}</span>
        <span className="text-xs mt-1" style={{ color: 'var(--accent)' }}>tap to count</span>
      </button>
      <div className="mt-3 flex justify-center gap-2">
        <button type="button" className="btn btn-ghost !py-1.5" onClick={() => setN(Math.max(0, n - 1))} aria-label="Undo one">−1</button>
        <button type="button" className="btn btn-ghost !py-1.5" onClick={() => setN(0)}>Reset</button>
      </div>
    </div>
  )
}
