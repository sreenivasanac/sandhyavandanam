import { useEffect, useRef, useState } from 'react'
import { track } from '../lib/track'

let current: HTMLAudioElement | null = null // only one clip plays at a time

/** Round play/stop button for a mantra's chant clip, with a ring that fills as it plays. The file loads on first tap. */
export function Chant({ src }: { src: string }) {
  const ref = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [p, setP] = useState(0) // 0..1
  useEffect(() => () => ref.current?.pause(), [])
  const toggle = () => {
    if (!ref.current) {
      const a = (ref.current = new Audio(src))
      a.onplay = () => setPlaying(true)
      a.onpause = a.onended = () => { setPlaying(false); setP(0) }
      a.ontimeupdate = () => setP(a.duration ? a.currentTime / a.duration : 0)
    }
    const a = ref.current
    if (!a.paused) return a.pause()
    if (current && current !== a) current.pause()
    current = a
    a.currentTime = 0
    a.play().catch(() => setPlaying(false))
    track('chant')
  }
  const C = 2 * Math.PI * 19
  return (
    <button type="button" onClick={toggle} aria-pressed={playing} title="Hear this line chanted (synthesised voice)"
      aria-label={playing ? 'Stop chant' : 'Hear this line chanted'}
      className="relative grid size-11 shrink-0 place-items-center rounded-full transition-transform duration-150 active:scale-90"
      style={{ background: playing ? 'var(--kumkum)' : 'var(--wash)', color: playing ? 'var(--on-kumkum)' : 'var(--kumkum)' }}>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44" aria-hidden>
        <circle cx="22" cy="22" r="19" fill="none" stroke="var(--turmeric)" strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - p)} style={{ opacity: playing ? 1 : 0, transition: 'stroke-dashoffset 250ms linear' }} />
      </svg>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
        {playing ? <rect x="3.5" y="3.5" width="9" height="9" rx="1.5" /> : <path d="M5 2.8v10.4a.6.6 0 00.92.5l8-5.2a.6.6 0 000-1L5.92 2.3A.6.6 0 005 2.8z" />}
      </svg>
    </button>
  )
}
