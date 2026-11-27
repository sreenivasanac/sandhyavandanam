import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useTheme } from './lib/hooks'
import { Home } from './pages/Home'
import { Privacy, Support } from './pages/Legal'
import { Perform } from './pages/Perform'
import { Read } from './pages/Read'
import { Settings, Welcome } from './pages/Settings'

export default function App() {
  useTheme()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Welcome />} />
        <Route path="/perform/:kala" element={<Perform />} />
        <Route path="/read/:kala" element={<Read />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
