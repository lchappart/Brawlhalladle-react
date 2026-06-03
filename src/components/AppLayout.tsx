import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ApiBanner } from './ApiBanner'
import { useLegends } from '../context/LegendsContext'
import { getDayKey } from '../utils/daily'
import './AppLayout.css'

const NAV_ITEMS = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/classique', label: 'Classique' },
  { to: '/unlimited', label: 'Illimité' },
  { to: '/brawldoku', label: 'Brawldoku' },
  { to: '/brawldoku-unlimited', label: 'Brawldoku ∞' },
  { to: '/legend-stat', label: 'Legend Stat' },
] as const

export function AppLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const dayKey = getDayKey()
  const { quota, fromCache } = useLegends()

  return (
    <div className="bh-app">
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

        <div className="bh-app__status-bar">
          <div className="bh-app__avatar" aria-hidden>
            BH
          </div>
          <div className="bh-app__status-text">
            <span className="bh-app__username">Joueur</span>
            <span className="bh-app__level">
              Défi {dayKey} · API {quota.remaining}/{quota.max}
              {fromCache ? ' · cache' : ''}
            </span>
          </div>
        </div>
      </header>

      <div className={`bh-app__body${isHome ? ' bh-app__body--home' : ''}`}>
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

        <main className="bh-app__main">
          <Outlet />
        </main>

        {!isHome && (
          <aside className="bh-app__info" aria-label="Informations">
            <div className="bh-ribbon bh-app__info-ribbon">
              Défi du jour — {dayKey}
            </div>
            <p className="bh-app__info-text">
              Devine les légendes via l&apos;API officielle Brawlhalla
            </p>
            <div className="bh-ribbon bh-ribbon--green bh-app__info-ribbon">
              Données · cache 24h
            </div>
            <ApiBanner />
          </aside>
        )}
      </div>
    </div>
  )
}
