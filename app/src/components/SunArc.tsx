import type { Kala } from '../config'

/**
 * The day as the sun's path, with the three junctures (sandhyās) marked: sunrise, midday, sunset.
 * `f` is the sun's progress through daylight (0 = sunrise, 1 = sunset); outside 0..1 it is below the horizon.
 */
export function SunArc({ f, done, active }: { f: number; done: Partial<Record<Kala, number>>; active: Kala }) {
  const X0 = 36, W = 248, Y = 118, H = 86
  const at = (t: number) => [X0 + W * t, Y - H * Math.sin(Math.PI * t)] as const
  const path = Array.from({ length: 41 }, (_, n) => at(n / 40)).map(([x, y], n) => `${n ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const up = f >= 0 && f <= 1
  const [sx, sy] = at(Math.min(1, Math.max(0, f)))
  const marks: [Kala, number][] = [['pratah', 0], ['madhyahnika', 0.5], ['sayam', 1]]
  return (
    <svg viewBox="0 0 320 140" className="w-full" role="img" aria-label="The sun's path today with the three sandhyā times marked">
      <path d={path} fill="none" stroke="var(--ink)" strokeOpacity="0.22" strokeWidth="1.5" strokeDasharray="1 6" strokeLinecap="round" />
      <line x1="14" x2="306" y1={Y} y2={Y} stroke="var(--ink)" strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round" />
      {marks.map(([k, t]) => {
        const [x, y] = at(t)
        const isDone = !!done[k]
        return (
          <g key={k}>
            <circle cx={x} cy={y} r={k === active ? 7 : 5.5} fill={isDone ? 'var(--ink)' : 'var(--paper)'} stroke="var(--ink)" strokeWidth="1.5" />
            {isDone && <path d={`M${x - 2.8} ${y + 0.2}l2 2 3.6-4.2`} fill="none" stroke="var(--paper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
          </g>
        )
      })}
      {up && (
        <g style={{ transition: 'transform 600ms var(--ease-out)' }}>
          <circle cx={sx} cy={sy} r="20" fill="var(--sun)" opacity="0.18" />
          <circle cx={sx} cy={sy} r="11" fill="var(--sun)" />
        </g>
      )}
    </svg>
  )
}
