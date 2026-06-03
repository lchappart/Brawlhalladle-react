import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { LegendsProvider } from './context/LegendsContext'
import { HomePage } from './pages/HomePage'
import { ClassicPage } from './pages/ClassicPage'
import { BrawldokuPage } from './pages/BrawldokuPage'
import { BrawldokuUnlimitedPage } from './pages/BrawldokuUnlimitedPage'
import { LegendStatPage } from './pages/LegendStatPage'
import { UnlimitedPage } from './pages/UnlimitedPage'

function App() {
  return (
    <LegendsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/classique" element={<ClassicPage />} />
            <Route path="/unlimited" element={<UnlimitedPage />} />
            <Route path="/brawldoku" element={<BrawldokuPage />} />
            <Route path="/brawldoku-unlimited" element={<BrawldokuUnlimitedPage />} />
            <Route path="/legend-stat" element={<LegendStatPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LegendsProvider>
  )
}

export default App
