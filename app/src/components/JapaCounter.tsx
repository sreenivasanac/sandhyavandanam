import { useState } from 'react'

/** Tap counter for the Gāyatrī japa — a memory aid. A light tick on each count, a longer buzz at the target. */
export function JapaCounter({ target }: { target: number }) {
  const [n, setN] = useState(0)
  const tap = () => {
    if (n >= target) return
    navigator.vibrate?.(n + 1 === target ? [60, 60, 200] : 8)
    setN(n + 1)
  }
  const C = 2 * Math.PI * 96
  const done = n >= target
  return (
    <div className="my-8 text-center">
      <button type="button" onClick={tap} aria-label={`Count one. ${n} of ${target} done`}
        className="relative mx-auto grid size-56 touch-manipulation select-none place-items-center rounded-full transition-transform duration-150 active:scale-[0.97]"
        style={{ background: 'var(--surface)', boxShadow: '0 0 0 1px var(--line)' }}>
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 224 224" aria-hidden>
          <circle cx="112" cy="112" r="96" fill="none" stroke="var(--wash)" strokeWidth="8" />
          <circle cx="112" cy="112" r="96" fill="none" stroke="var(--turmeric)" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - n / target)} style={{ transition: 'stroke-dashoffset 300ms var(--ease-out)' }} />
        </svg>
        <span>
          <b className="display block text-7xl tabular-nums">{n}</b>
          <span className="muted text-sm">{done ? `${target} complete` : `of ${target}, tap to count`}</span>
        </span>
      </button>
      <div className="mt-4 flex justify-center gap-2">
        <button type="button" className="btn btn-plain" onClick={() => setN(Math.max(0, n - 1))} disabled={n === 0}>Undo one</button>
        <button type="button" className="btn btn-plain" onClick={() => setN(0)} disabled={n === 0}>Start again</button>
      </div>
    </div>
  )
}
