import type { Kala } from '../config'

/**
 * Pothi: the sun's path as a small ink engraving — a ruled horizon, a fine arc, the sun drawn in line with rays.
 * `f` is the sun's progress through daylight (0 = sunrise, 1 = sunset); outside 0..1 the sun is down.
 */
export function SunArc({ f, done, active, night }: { f: number; done: Partial<Record<Kala, number>>; active: Kala; night: boolean }) {
  const X0 = 36, W = 248, Y = 104, H = 78
  const at = (t: number) => [X0 + W * t, Y - H * Math.sin(Math.PI * t)] as const
  const path = Array.from({ length: 41 }, (_, n) => at(n / 40)).map(([x, y], n) => `${n ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const up = f >= 0 && f <= 1
  const [sx, sy] = at(Math.min(1, Math.max(0, f)))
  const marks: [Kala, number][] = [['pratah', 0], ['madhyahnika', 0.5], ['sayam', 1]]
  const rays = Array.from({ length: 12 }, (_, n) => (n * Math.PI) / 6)
  return (
    <svg viewBox="0 0 320 112" className="block w-full overflow-visible" role="img" aria-label="The sun's path today with the three sandhyā times marked" fill="none" stroke="var(--ink)" strokeLinecap="round">
      <path d={path} strokeWidth="0.8" />
      {/* horizon: a double rule, as at the foot of an engraved plate */}
      <line x1="6" x2="314" y1={Y} y2={Y} strokeWidth="1.1" />
      <line x1="6" x2="314" y1={Y + 3} y2={Y + 3} strokeWidth="0.4" />
      {up && (
        <g stroke="var(--kumkum)">
          <circle cx={sx} cy={sy} r="7" strokeWidth="1.1" fill="var(--paper)" />
          {rays.map((a) => <line key={a} x1={sx + 10 * Math.cos(a)} y1={sy + 10 * Math.sin(a)} x2={sx + 14 * Math.cos(a)} y2={sy + 14 * Math.sin(a)} strokeWidth="0.8" />)}
        </g>
      )}
      {night && <path d="M236 22a10 10 0 1 0 8 17 8 8 0 0 1-8-17z" strokeWidth="0.9" fill="var(--paper)" />}
      {marks.map(([k, t]) => {
        const [x, y] = at(t)
        return (
          <g key={k}>
            <line x1={x} x2={x} y1={y - (t === 0.5 ? 0 : 0)} y2={Y + 9} strokeWidth="0.6" strokeDasharray={t === 0.5 ? '1 3' : undefined} />
            <rect x={x - 3.2} y={y - 3.2} width="6.4" height="6.4" transform={`rotate(45 ${x} ${y})`} strokeWidth="1" fill={done[k] ? 'var(--ink)' : 'var(--paper)'} stroke={k === active ? 'var(--kumkum)' : 'var(--ink)'} />
          </g>
        )
      })}
    </svg>
  )
}
