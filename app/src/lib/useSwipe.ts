import { useEffect, type RefObject } from 'react'

/**
 * Horizontal swipe on touch screens: the element follows the finger (damped), and a swipe past the distance or
 * velocity threshold fires onNext/onPrev. Vertical scrolling is untouched (set `touch-action: pan-y` on the element).
 */
export function useSwipe(ref: RefObject<HTMLElement | null>, onNext: () => void, onPrev: () => void, canNext: boolean, canPrev: boolean) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let x0 = 0, y0 = 0, t0 = 0, dx = 0, active = false, locked: 'x' | 'y' | null = null
    const set = (x: number, animate: boolean) => {
      el.style.transition = animate ? 'transform 260ms cubic-bezier(0.23,1,0.32,1), opacity 260ms' : 'none'
      el.style.transform = x ? `translateX(${x}px)` : ''
      el.style.opacity = x ? String(1 - Math.min(0.5, Math.abs(x) / 400)) : ''
    }
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' || (e.target as HTMLElement).closest('button,a,input,select')) return
      x0 = e.clientX; y0 = e.clientY; t0 = e.timeStamp; dx = 0; active = true; locked = null
    }
    const move = (e: PointerEvent) => {
      if (!active) return
      const mx = e.clientX - x0, my = e.clientY - y0
      if (!locked && Math.hypot(mx, my) > 10) locked = Math.abs(mx) > Math.abs(my) * 1.4 ? 'x' : 'y'
      if (locked !== 'x') return
      // rubber-band when there is nowhere to go in that direction
      const blocked = (mx < 0 && !canNext) || (mx > 0 && !canPrev)
      dx = blocked ? mx * 0.2 : mx * 0.85
      set(dx, false)
    }
    const up = (e: PointerEvent) => {
      if (!active) return
      active = false
      if (locked !== 'x') return
      const v = Math.abs(dx) / Math.max(1, e.timeStamp - t0) // px per ms
      const go = Math.abs(dx) > 70 || (v > 0.45 && Math.abs(dx) > 24)
      set(0, true)
      if (go && dx < 0 && canNext) onNext()
      else if (go && dx > 0 && canPrev) onPrev()
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up)
    }
  }, [ref, onNext, onPrev, canNext, canPrev])
}
