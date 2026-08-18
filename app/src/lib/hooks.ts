import { useEffect } from 'react'
import { useSettings } from './settings'

/** Apply theme + font scale to <html>. */
export function useTheme() {
  const theme = useSettings((s) => s.theme)
  const fontScale = useSettings((s) => s.fontScale)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches)
      document.documentElement.dataset.theme = dark ? 'dark' : 'light'
      document.documentElement.style.setProperty('--font-scale', String(fontScale))
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme, fontScale])
}

/** Keep the screen on while performing (phone on the floor, wet hands). Silently no-ops where unsupported. */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return
    let lock: WakeLockSentinel | null = null
    const request = async () => {
      try {
        lock = await navigator.wakeLock.request('screen')
      } catch {
        /* denied (low battery etc.) — nothing to do */
      }
    }
    const onVisible = () => document.visibilityState === 'visible' && request()
    request()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      lock?.release()
    }
  }, [active])
}
