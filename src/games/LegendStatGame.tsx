import { useMemo, useState } from 'react'
import { LegendAutocomplete } from '../components/LegendAutocomplete'
import { LegendPortrait } from '../components/LegendPortrait'
import { WeaponKit } from '../components/WeaponKit'
import { useLegends } from '../context/LegendsContext'
import { useGameStorage } from '../hooks/useGameStorage'
import { getDayKey } from '../utils/daily'
import type { Legend, StatKey } from '../api/types'
import {
  getDailyLegend,
  getLegendStatRevealOrder,
  STAT_LABELS,
  statValue,
} from '../utils/legendGame'
import '../styles/game.css'

type StoredLegendStat = {
  dayKey: string
  guessIds: number[]
  revealedCount: number
  won: boolean
}

export function LegendStatGame() {
  const { legends, loading } = useLegends()
  const dayKey = getDayKey()
  const target = useMemo(
    () => (legends.length ? getDailyLegend(legends, `stat-${dayKey}`) : null),
    [legends, dayKey],
  )
  const revealOrder = useMemo(() => getLegendStatRevealOrder(dayKey), [dayKey])

  const storageKey = `legendstat_${dayKey}`
  const [stored, setStored] = useGameStorage<StoredLegendStat>(storageKey, {
    dayKey,
    guessIds: [],
    revealedCount: 1,
    won: false,
  })

  const [input, setInput] = useState('')
  const gameOver = stored.won

  const visibleStats = revealOrder.slice(0, stored.revealedCount)

  function handleGuess(legend: Legend) {
    if (!target || gameOver) return
    if (stored.guessIds.includes(legend.legend_id)) return

    const won = legend.legend_id === target.legend_id
    const nextIds = [...stored.guessIds, legend.legend_id]
    const nextRevealed = Math.min(
      revealOrder.length,
      stored.revealedCount + (won ? 0 : 1),
    )
    setStored({
      dayKey,
      guessIds: nextIds,
      revealedCount: won ? stored.revealedCount : nextRevealed,
      won,
    })
    setInput('')
  }

  if (loading || !target) {
    return (
      <div className="game-board">
        <p className="game-board__hint">Chargement du défi stats…</p>
      </div>
    )
  }

  return (
    <div className="game-board">
      <p className="game-board__hint">
        Devine la légende à partir de ses stats ({dayKey}). Une stat de plus est
        révélée à chaque mauvaise réponse.
      </p>

      <StatPanel target={target} visibleStats={visibleStats} allStats={revealOrder} />

      {!gameOver && (
        <div className="game-board__actions">
          <LegendAutocomplete
            legends={legends}
            value={input}
            onChange={setInput}
            onSubmit={handleGuess}
            excludedLegendIds={stored.guessIds}
            disabled={gameOver}
          />
        </div>
      )}

      {stored.won && (
        <div className="game-result game-result--win">
          <h2>Bonne réponse !</h2>
          <LegendPortrait
            legendNameKey={target.legend_name_key}
            bioName={target.bio_name}
            size="lg"
            className="game-result__portrait"
          />
          <p>
            <strong>{target.bio_name}</strong>
          </p>
          <WeaponKit legend={target} size="md" />
        </div>
      )}

      {stored.guessIds.length > 0 && (
        <ul className="legend-stat-guesses">
          {[...stored.guessIds].reverse().map((id) => {
            const g = legends.find((l) => l.legend_id === id)
            return g ? (
              <li key={id} className="legend-stat-guesses__item">
                <span aria-hidden>✗</span>
                <LegendPortrait
                  legendNameKey={g.legend_name_key}
                  bioName={g.bio_name}
                  size="md"
                />
                {g.bio_name}
              </li>
            ) : null
          })}
        </ul>
      )}

    </div>
  )
}

function StatPanel({
  target,
  visibleStats,
  allStats,
}: {
  target: Legend
  visibleStats: StatKey[]
  allStats: StatKey[]
}) {
  return (
    <div className="legend-stat-panel">
      <h3>Stats mystère</h3>
      {allStats.map((key) => {
        const visible = visibleStats.includes(key)
        return (
          <div
            key={key}
            className={visible ? 'legend-stat-row' : 'legend-stat-row is-hidden'}
          >
            <span>{STAT_LABELS[key]}</span>
            <span>{visible ? statValue(target, key) : '?'}</span>
          </div>
        )
      })}
    </div>
  )
}
