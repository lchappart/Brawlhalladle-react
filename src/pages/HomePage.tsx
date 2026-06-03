import { ModeCard } from '../components/ModeCard'
import { getDayKey } from '../utils/daily'
import './HomePage.css'

const MODES = [
  {
    to: '/classique',
    title: 'Classique',
    description: 'Devine la légende du jour avec des indices sur les stats.',
    accent: 'pink' as const,
    featured: true,
  },
  {
    to: '/unlimited',
    title: 'Illimité',
    description: 'Enchaîne les parties sans limite quotidienne.',
    accent: 'pink' as const,
  },
  {
    to: '/brawldoku',
    title: 'Brawldoku',
    description: 'Grille du jour — armes × légendes, une grille par jour.',
    accent: 'pink' as const,
  },
  {
    to: '/brawldoku-unlimited',
    title: 'Brawldoku ∞',
    description: 'Grilles aléatoires à l’infini, sans attente du lendemain.',
    accent: 'pink' as const,
  },
  {
    to: '/legend-stat',
    title: 'Legend Stat',
    description: 'Une stat mystère — trouve la bonne valeur.',
    accent: 'pink' as const,
  },
] as const

export function HomePage() {
  const dayKey = getDayKey()

  return (
    <section className="mode-hub" aria-labelledby="mode-hub-title">
      <header className="mode-hub__header">
        <h1 id="mode-hub-title" className="bh-page-title">
          Choisis ton mode
        </h1>
        <p className="mode-hub__day">Défi du jour — {dayKey}</p>
      </header>

      <div className="mode-hub__grid">
        {MODES.map((mode) => (
          <ModeCard
            key={mode.to}
            to={mode.to}
            title={mode.title}
            description={mode.description}
            accent={mode.accent}
            featured={'featured' in mode && mode.featured}
          />
        ))}
      </div>
    </section>
  )
}
