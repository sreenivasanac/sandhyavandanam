import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useTheme } from './lib/hooks'
import { countView } from './lib/nudge'
import { Home } from './pages/Home'
import { Feedback, Privacy, Support } from './pages/Legal'
import { Perform } from './pages/Perform'
import { Read } from './pages/Read'
import { Settings, Welcome } from './pages/Settings'

export default function App() {
  useTheme()
  return (
    <BrowserRouter>
      <CountViews />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Welcome />} />
        <Route path="/perform/:kala" element={<Perform />} />
        <Route path="/read/:kala" element={<Read />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/support" element={<Support />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

/** Every page or step change (steps live in ?s=) counts towards the set-up nudge. */
function CountViews() {
  const { pathname, search } = useLocation()
  useEffect(countView, [pathname, search])
  return null
}
