import { Link } from 'react-router-dom'
import './ModeCard.css'

type ModeCardProps = {
  to: string
  title: string
  description: string
  accent: 'pink' | 'cyan'
  featured?: boolean
}

export function ModeCard({
  to,
  title,
  description,
  accent,
  featured = false,
}: ModeCardProps) {
  return (
    <Link
      to={to}
      className={`mode-card mode-card--${accent}${featured ? ' mode-card--featured' : ''}`}
    >
      <div className="mode-card__header" aria-hidden />

      <div className="mode-card__footer">
        <h2 className="mode-card__title">{title}</h2>
        <p className="mode-card__description">{description}</p>
        <span className="mode-card__play bh-btn bh-btn--gold">Jouer</span>
      </div>
    </Link>
  )
}
