import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { getDayKey } from '../utils/daily'
import './AppLayout.css'

const NAV_ITEMS = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/classique', label: 'Classique' },
  { to: '/unlimited', label: 'Illimité' },
  { to: '/brawldoku', label: 'Brawldoku' },
  { to: '/brawldoku-unlimited', label: 'Brawldoku ∞' },
] as const

export function AppLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="bh-app">
      <div className="bh-app__sky" aria-hidden />
      <div className="bh-app__rays" aria-hidden />
      <div className="bh-app__grain" aria-hidden />
      <div className="bh-app__lightning bh-app__lightning--tl" aria-hidden />
      <div className="bh-app__lightning bh-app__lightning--br" aria-hidden />
      <p className="bh-app__watermark" aria-hidden>
        BRAWLHALLADLE
      </p>

      <header className="bh-app__header">
        <NavLink to="/" className="bh-app__logo" aria-label="Brawlhalladle — accueil">
          <span className="bh-title bh-title--logo">
            <span className="bh-title__red">Brawl</span>
            halladle
          </span>
        </NavLink>

        <div className="bh-app__daily" aria-label={`Défi du jour ${getDayKey()}`}>
          <span className="bh-app__daily-icon" aria-hidden>
            ⚡
          </span>
          <span className="bh-app__daily-text">
            <span className="bh-app__daily-label">Défi du jour</span>
            <span className="bh-app__daily-date">{getDayKey()}</span>
          </span>
        </div>
      </header>

      <div className="bh-app__body">
        <aside className="bh-app__sidebar" aria-label="Navigation des modes">
          <div className="bh-ribbon bh-app__sidebar-label">Modes</div>
          <nav className="bh-app__nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={'end' in item ? item.end : false}
                className={({ isActive }) =>
                  `bh-nav-btn${isActive ? ' bh-nav-btn--active' : ''}`
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className={`bh-app__main${isHome ? ' bh-app__main--home' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
