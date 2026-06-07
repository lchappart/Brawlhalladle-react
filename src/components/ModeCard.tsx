import { Link } from 'react-router-dom'
import { LegendPortrait } from './LegendPortrait'
import './ModeCard.css'

export type ModeAccent = 'gold' | 'cyan' | 'magenta' | 'violet'

type ModeCardProps = {
  to: string
  title: string
  description: string
  accent: ModeAccent
  tag?: string
  featured?: boolean
  legendNameKey?: string
  legendName?: string
}

export function ModeCard({
  to,
  title,
  description,
  accent,
  tag,
  featured = false,
  legendNameKey,
  legendName,
}: ModeCardProps) {
  return (
    <Link
      to={to}
      className={`mode-card mode-card--${accent}${featured ? ' mode-card--featured' : ''}`}
    >
      {tag && <span className="mode-card__tag">{tag}</span>}

      <div className="mode-card__stage" aria-hidden>
        <span className="mode-card__glow" />
        {legendNameKey && (
          <LegendPortrait
            legendNameKey={legendNameKey}
            bioName={legendName ?? ''}
            size="lg"
            className="mode-card__art"
          />
        )}
      </div>

      <div className="mode-card__footer">
        <h2 className="mode-card__title">{title}</h2>
        <p className="mode-card__description">{description}</p>
        <span className="mode-card__play bh-btn bh-btn--gold">Jouer</span>
      </div>
    </Link>
  )
}
