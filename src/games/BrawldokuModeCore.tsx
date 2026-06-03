import { useMemo, useState, type ReactNode } from 'react'
import type { Legend } from '../api/types'
import { LegendAutocomplete } from '../components/LegendAutocomplete'
import { LegendPortrait } from '../components/LegendPortrait'
import { WeaponIcon } from '../components/WeaponIcon'
import { formatWeaponName, type BrawldokuPuzzle } from '../utils/legendGame'
import '../styles/game.css'

export type ActiveCell = { row: number; col: number }

export type BrawldokuModeCoreProps = {
  puzzle: BrawldokuPuzzle | null
  legends: Legend[]
  loading: boolean
  picks: number[][]
  completed: boolean
  onPicksChange: (picks: number[][]) => void
  onComplete: () => void
  hintIntro: ReactNode
  afterVictory?: ReactNode
  emptyPuzzleMessage?: string
}

export function BrawldokuModeCore({
  puzzle,
  legends,
  loading,
  picks,
  completed,
  onPicksChange,
  onComplete,
  hintIntro,
  afterVictory,
  emptyPuzzleMessage = 'Impossible de générer la grille. Réessaie plus tard.',
}: BrawldokuModeCoreProps) {
  const [message, setMessage] = useState<string | null>(null)
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null)
  const [searchInput, setSearchInput] = useState('')

  const allCorrect = useMemo(() => {
    if (!puzzle) return false
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const pick = picks[r]?.[c] ?? 0
        if (pick !== puzzle.answers[r]![c]!.legend_id) return false
      }
    }
    return true
  }, [puzzle, picks])

  const excludedLegendIds = useMemo(() => {
    const used = new Set<number>()
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const id = picks[r]?.[c] ?? 0
        if (id === 0) continue
        if (activeCell?.row === r && activeCell.col === c) continue
        used.add(id)
      }
    }
    return [...used]
  }, [picks, activeCell])

  const activeCellLabel = useMemo(() => {
    if (!activeCell || !puzzle) return null
    const { row, col } = activeCell
    return `${formatWeaponName(puzzle.rowWeapons[row]!)} × ${formatWeaponName(puzzle.colWeapons[col]!)}`
  }, [activeCell, puzzle])

  function setCell(row: number, col: number, legendId: number) {
    if (!puzzle || completed) return
    const next = picks.map((r, ri) =>
      r.map((v, ci) => (ri === row && ci === col ? legendId : v)),
    )
    onPicksChange(next)
    setMessage(null)
  }

  function selectCell(row: number, col: number) {
    if (completed) return
    setActiveCell({ row, col })
    const pickId = picks[row]?.[col] ?? 0
    const legend = legends.find((l) => l.legend_id === pickId)
    setSearchInput(legend?.bio_name ?? '')
    setMessage(null)
  }

  function handleSearchSubmit(legend: Legend) {
    if (!activeCell) {
      setMessage('Clique d’abord sur une case de la grille.')
      return
    }
    setCell(activeCell.row, activeCell.col, legend.legend_id)
    setSearchInput(legend.bio_name)
  }

  function checkSolution() {
    if (!puzzle) return
    if (allCorrect) {
      onComplete()
      setActiveCell(null)
      setMessage(null)
    } else {
      setMessage('Pas encore bon — vérifie chaque case.')
    }
  }

  if (loading) {
    return (
      <div className="game-board">
        <p className="game-board__hint">Chargement du Brawldoku…</p>
      </div>
    )
  }

  if (!puzzle) {
    return (
      <div className="game-board">
        <p className="game-board__hint">{emptyPuzzleMessage}</p>
        {afterVictory}
      </div>
    )
  }

  return (
    <div className="game-board">
      <p className="game-board__hint">{hintIntro}</p>

      {completed && (
        <div className="game-result game-result--win">
          <h2>Grille complète !</h2>
          <p>Toutes les intersections armes × armes sont correctes.</p>
        </div>
      )}

      {!completed && (
        <div className="brawldoku__search-wrap">
          <p className="brawldoku__search-label">
            {activeCellLabel
              ? `Case : ${activeCellLabel}`
              : 'Sélectionne une case dans la grille'}
          </p>
          <LegendAutocomplete
            legends={legends}
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={handleSearchSubmit}
            excludedLegendIds={excludedLegendIds}
            disabled={completed || !activeCell}
            placeholder={
              activeCell ? 'Rechercher une légende…' : 'Choisis une case…'
            }
          />
        </div>
      )}

      <BrawldokuGrid
        puzzle={puzzle}
        legends={legends}
        picks={picks}
        completed={completed}
        activeCell={activeCell}
        onSelectCell={selectCell}
      />

      {!completed && (
        <div className="game-board__actions">
          <button type="button" className="bh-btn" onClick={checkSolution}>
            Valider la grille
          </button>
        </div>
      )}

      {completed && afterVictory}

      {message && (
        <p className="game-board__hint" role="alert">
          {message}
        </p>
      )}
    </div>
  )
}

function BrawldokuGrid({
  puzzle,
  legends,
  picks,
  completed,
  activeCell,
  onSelectCell,
}: {
  puzzle: BrawldokuPuzzle
  legends: Legend[]
  picks: number[][]
  completed: boolean
  activeCell: ActiveCell | null
  onSelectCell: (row: number, col: number) => void
}) {
  return (
    <div className="brawldoku">
      <table className="brawldoku__table">
        <thead>
          <tr>
            <th className="brawldoku__corner" />
            {puzzle.colWeapons.map((w) => (
              <th key={w}>
                <div className="brawldoku__weapon-label">
                  <WeaponIcon weapon={w} size="lg" showLabel />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {puzzle.rowWeapons.map((rowWeapon, ri) => (
            <tr key={rowWeapon}>
              <th>
                <div className="brawldoku__weapon-label brawldoku__weapon-label--row">
                  <WeaponIcon weapon={rowWeapon} size="lg" showLabel />
                </div>
              </th>
              {puzzle.colWeapons.map((colWeapon, ci) => {
                const answer = puzzle.answers[ri]![ci]!
                const pickId = picks[ri]?.[ci] ?? 0
                const pick = legends.find((l) => l.legend_id === pickId)
                const isActive =
                  activeCell?.row === ri && activeCell.col === ci && !completed
                const isCorrect = pickId === answer.legend_id && pickId !== 0
                const showWrong =
                  completed && pickId !== 0 && pickId !== answer.legend_id

                let cellClass = 'brawldoku__cell-btn'
                if (isActive) cellClass += ' brawldoku__cell-btn--active'
                if (isCorrect) cellClass += ' brawldoku__cell-btn--correct'
                if (showWrong) cellClass += ' brawldoku__cell-btn--wrong'
                if (!pick && !completed) cellClass += ' brawldoku__cell-btn--empty'

                return (
                  <td key={colWeapon} className="brawldoku__cell">
                    <button
                      type="button"
                      className={cellClass}
                      disabled={completed}
                      aria-label={`Case ${formatWeaponName(rowWeapon)} et ${formatWeaponName(colWeapon)}${pick ? ` : ${pick.bio_name}` : ''}`}
                      aria-pressed={isActive}
                      onClick={() => onSelectCell(ri, ci)}
                    >
                      {pick ? (
                        <span className="brawldoku__cell-inner">
                          <LegendPortrait
                            legendNameKey={pick.legend_name_key}
                            bioName={pick.bio_name}
                            size="md"
                          />
                          <span>{pick.bio_name}</span>
                        </span>
                      ) : (
                        '?'
                      )}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
