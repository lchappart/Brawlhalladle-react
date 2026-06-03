import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './GameShell.css'

type GameShellProps = {
  title: string
  children: ReactNode
}

export function GameShell({ title, children }: GameShellProps) {
  const location = useLocation()
  const showBack = location.pathname !== '/'

  return (
    <div className="game-shell">
      <header className="game-shell__header">
        {showBack && (
          <Link to="/" className="game-shell__back" aria-label="Retour à l'accueil">
            <span aria-hidden>‹</span>
          </Link>
        )}
        <h1 className="game-shell__title bh-page-title">{title}</h1>
      </header>
      <div className="game-shell__content bh-frame">{children}</div>
    </div>
  )
}
