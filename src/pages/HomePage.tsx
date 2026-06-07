import { useMemo } from 'react'
import { ModeCard, type ModeAccent } from '../components/ModeCard'
import { useLegends } from '../context/LegendsContext'
import { getDayKey, hashString, seededShuffle } from '../utils/daily'
import './HomePage.css'

type Mode = {
  to: string
  title: string
  description: string
  accent: ModeAccent
  tag: string
  featured?: boolean
}

const MODES: Mode[] = [
  {
    to: '/classique',
    title: 'Classique',
    description: 'Devine la légende du jour avec des indices sur les stats.',
    accent: 'gold',
    tag: 'Quotidien',
    featured: true,
  },
  {
    to: '/unlimited',
    title: 'Illimité',
    description: 'Enchaîne les parties sans limite quotidienne.',
    accent: 'cyan',
    tag: 'Infini',
  },
  {
    to: '/brawldoku',
    title: 'Brawldoku',
    description: 'Grille du jour — armes × légendes, une grille par jour.',
    accent: 'magenta',
    tag: 'Quotidien',
  },
  {
    to: '/brawldoku-unlimited',
    title: 'Brawldoku ∞',
    description: 'Grilles aléatoires à l’infini, sans attente du lendemain.',
    accent: 'violet',
    tag: 'Infini',
  },
]

export function HomePage() {
  const dayKey = getDayKey()
  const { legends } = useLegends()

  /* Une légende vedette différente par carte, stable sur la journée. */
  const featuredLegends = useMemo(() => {
    if (legends.length === 0) return []
    return seededShuffle(legends, hashString(`hub-${dayKey}`))
  }, [legends, dayKey])

  return (
    <section className="mode-hub" aria-labelledby="mode-hub-title">
      <header className="mode-hub__header">
        <p className="mode-hub__eyebrow">Brawlhalladle</p>
        <h1 id="mode-hub-title" className="bh-page-title">
          Choisis ton mode
        </h1>
        <p className="mode-hub__day">Défi du jour — {dayKey}</p>
      </header>

      <div className="mode-hub__grid">
        {MODES.map((mode, i) => {
          const legend = featuredLegends[i % (featuredLegends.length || 1)]
          return (
            <ModeCard
              key={mode.to}
              to={mode.to}
              title={mode.title}
              description={mode.description}
              accent={mode.accent}
              tag={mode.tag}
              featured={mode.featured}
              legendNameKey={legend?.legend_name_key}
              legendName={legend?.bio_name}
            />
          )
        })}
      </div>
    </section>
  )
}
