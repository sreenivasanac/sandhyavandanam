import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useTheme } from './lib/hooks'
import { useSettings } from './lib/settings'
import { Home } from './pages/Home'
import { Perform } from './pages/Perform'
import { Read } from './pages/Read'
import { Settings } from './pages/Settings'

export default function App() {
  useTheme()
  const onboarded = useSettings((s) => s.onboarded)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={onboarded ? <Home /> : <Settings onboarding />} />
        <Route path="/perform/:kala" element={<Perform />} />
        <Route path="/read/:kala" element={<Read />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
