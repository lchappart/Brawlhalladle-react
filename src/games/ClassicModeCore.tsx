import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CellStatus, ClassicGuessRow, Legend, LegendDetail, StatKey } from '../api/types'
import { fetchLegendDetail } from '../api/brawlhallaClient'
import { ClassicHints } from '../components/ClassicHints'
import { LegendAutocomplete } from '../components/LegendAutocomplete'
import { LegendPortrait } from '../components/LegendPortrait'
import { WeaponKit } from '../components/WeaponKit'
import { useLegends } from '../context/LegendsContext'
import {
  buildClassicGuessRow,
  STAT_KEYS,
  STAT_LABELS,
  statValue,
} from '../utils/legendGame'
import '../styles/game.css'

function cellClass(status: CellStatus | ClassicGuessRow['weaponsStatus']) {
  if (status === 'correct') return 'cell--correct'
  if (status === 'close') return 'cell--close'
  if (status === 'higher') return 'cell--higher'
  if (status === 'lower') return 'cell--lower'
  return 'cell--wrong'
}

function StatCell({
  legend,
  statKey,
  status,
}: {
  legend: ClassicGuessRow['legend']
  statKey: StatKey
  status: CellStatus
}) {
  const value = statValue(legend, statKey)
  if (status === 'higher') {
    return (
      <span className="stat-cell">
        <span className="stat-cell__value">{value}</span>
        <span className="stat-cell__arrow" aria-label="Plus haut que la cible">
          ↑
        </span>
      </span>
    )
  }
  if (status === 'lower') {
    return (
      <span className="stat-cell">
        <span className="stat-cell__value">{value}</span>
        <span className="stat-cell__arrow" aria-label="Plus bas que la cible">
          ↓
        </span>
      </span>
    )
  }
  return <span className="stat-cell__value">{value}</span>
}

export type ClassicModeCoreProps = {
  target: Legend
  guessIds: number[]
  won: boolean
  hintsSeed: string
  hintIntro: ReactNode
  onGuess: (legend: { legend_id: number; bio_name: string }) => void
  afterVictory?: ReactNode
}

export function ClassicModeCore({
  target,
  guessIds,
  won,
  hintsSeed,
  hintIntro,
  onGuess,
  afterVictory,
}: ClassicModeCoreProps) {
  const { legends } = useLegends()
  const [input, setInput] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [detail, setDetail] = useState<LegendDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setDetail(null)
    setDetailLoading(true)
    void fetchLegendDetail(target.legend_id)
      .then(({ detail: d }) => {
        if (!cancelled) setDetail(d)
      })
      .catch(() => {
        if (!cancelled) setDetail(null)
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [target.legend_id])

  const rows: ClassicGuessRow[] = useMemo(() => {
    return [...guessIds]
      .reverse()
      .map((id) => legends.find((l) => l.legend_id === id))
      .filter((l): l is NonNullable<typeof l> => !!l)
      .map((g) => buildClassicGuessRow(g, target))
  }, [guessIds, legends, target])

  function handleGuess(legend: { legend_id: number; bio_name: string }) {
    if (won) return
    if (guessIds.includes(legend.legend_id)) {
      setMessage('Tu as déjà essayé cette légende.')
      return
    }
    onGuess(legend)
    setInput('')
    setMessage(null)
  }

  return (
    <div className="game-board">
      <ClassicHints
        target={target}
        detail={detail}
        detailLoading={detailLoading}
        guessCount={guessIds.length}
        won={won}
        hintsSeed={hintsSeed}
      />

      <p className="game-board__hint">{hintIntro}</p>

      {!won && (
        <div className="game-board__actions">
          <LegendAutocomplete
            legends={legends}
            value={input}
            onChange={setInput}
            onSubmit={handleGuess}
            excludedLegendIds={guessIds}
            disabled={won}
          />
        </div>
      )}

      {message && (
        <p className="game-board__hint" role="alert">
          {message}
        </p>
      )}

      {won && (
        <div className="game-result game-result--win">
          <h2>Victoire !</h2>
          <LegendPortrait
            legendNameKey={target.legend_name_key}
            bioName={target.bio_name}
            size="lg"
            className="game-result__portrait"
          />
          <p>
            C&apos;était <strong>{target.bio_name}</strong>
          </p>
          <WeaponKit legend={target} size="md" />
          {afterVictory}
        </div>
      )}

      {rows.length > 0 && (
        <div className="classic-grid-wrap">
          <table className="classic-grid">
            <thead>
              <tr>
                <th>Légende</th>
                <th>Armes</th>
                {STAT_KEYS.map((k) => (
                  <th key={k}>{STAT_LABELS[k]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.legend.legend_id}>
                  <td className="cell--name">
                    <span className="cell--name-inner">
                      <LegendPortrait
                        legendNameKey={row.legend.legend_name_key}
                        bioName={row.legend.bio_name}
                        size="sm"
                      />
                      <span>{row.legend.bio_name}</span>
                    </span>
                  </td>
                  <td className={`cell--weapons ${cellClass(row.weaponsStatus)}`}>
                    <WeaponKit legend={row.legend} size="sm" />
                  </td>
                  {STAT_KEYS.map((k) => (
                    <td key={k} className={cellClass(row.stats[k])}>
                      <StatCell legend={row.legend} statKey={k} status={row.stats[k]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
