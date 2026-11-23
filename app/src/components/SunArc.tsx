import type { Kala } from '../config'

/**
 * The day as the sun's path over a horizon, with the three junctures (sandhyās) marked: sunrise, midday, sunset.
 * The bottom edge of this drawing IS the horizon — the sky block ends there and the page begins.
 * `f` is the sun's progress through daylight (0 = sunrise, 1 = sunset); outside 0..1 the sun is down.
 */
export function SunArc({ f, done, active, night }: { f: number; done: Partial<Record<Kala, number>>; active: Kala; night: boolean }) {
  const X0 = 36, W = 248, Y = 112, H = 84
  const at = (t: number) => [X0 + W * t, Y - H * Math.sin(Math.PI * t)] as const
  const path = Array.from({ length: 41 }, (_, n) => at(n / 40)).map(([x, y], n) => `${n ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const up = f >= 0 && f <= 1
  const [sx, sy] = at(Math.min(1, Math.max(0, f)))
  const marks: [Kala, number][] = [['pratah', 0], ['madhyahnika', 0.5], ['sayam', 1]]
  return (
    <svg viewBox="0 0 320 112" className="block w-full overflow-visible" role="img" aria-label="The sun's path today with the three sandhyā times marked">
      <path d={path} fill="none" stroke="var(--sky-ink)" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
      {up && <circle cx={sx} cy={sy} r="17" fill="var(--sun)" />}
      {night && (
        // a waning crescent: a disc with a sky-coloured disc laid over it
        <g>
          <circle cx="236" cy="34" r="9" fill="var(--sky-ink)" opacity="0.9" />
          <circle cx="240.5" cy="31" r="8" fill="var(--sky-a)" />
        </g>
      )}
      {marks.map(([k, t]) => {
        const [x, y] = at(t)
        const isDone = !!done[k]
        return (
          <g key={k}>
            <circle cx={x} cy={y} r={k === active ? 6.5 : 5} fill={isDone ? 'var(--sky-ink)' : 'var(--sky-a)'} stroke="var(--sky-ink)" strokeWidth="2" />
            {isDone && <path d={`M${x - 2.6} ${y + 0.2}l1.9 1.9 3.4-4`} fill="none" stroke="var(--sky-a)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />}
          </g>
        )
      })}
    </svg>
  )
}
