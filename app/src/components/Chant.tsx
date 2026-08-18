import { useEffect, useRef, useState } from 'react'

let current: HTMLAudioElement | null = null // only one clip plays at a time

/** Small play/stop button for a mantra's chant clip. Lazy: the file is fetched only on first tap. */
export function Chant({ src, label }: { src: string; label?: string }) {
  const ref = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  useEffect(() => () => ref.current?.pause(), [])
  const toggle = () => {
    if (!ref.current) {
      ref.current = new Audio(src)
      ref.current.onended = ref.current.onpause = () => setPlaying(false)
      ref.current.onplay = () => setPlaying(true)
    }
    const a = ref.current
    if (!a.paused) return a.pause()
    if (current && current !== a) current.pause()
    current = a
    a.currentTime = 0
    a.play().catch(() => setPlaying(false))
  }
  return (
    <button type="button" onClick={toggle} aria-pressed={playing} aria-label={playing ? 'Stop chant' : 'Play chant'}
      className="btn btn-ghost mt-2 !py-1.5 !px-3 text-sm">
      <span aria-hidden>{playing ? '■' : '▶'}</span> {playing ? 'Stop' : 'Chant'}
      {label && <span className="opacity-60 font-normal">· {label}</span>}
    </button>
  )
}
