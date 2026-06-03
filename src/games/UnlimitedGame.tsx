import { useEffect, useState } from 'react'
import type { Legend } from '../api/types'
import { useLegends } from '../context/LegendsContext'
import {
  buildClassicGuessRow,
  isClassicWin,
  pickRandomLegend,
} from '../utils/legendGame'
import { ClassicModeCore } from './ClassicModeCore'

export function UnlimitedGame() {
  const { legends, loading } = useLegends()
  const [round, setRound] = useState(1)
  const [target, setTarget] = useState<Legend | null>(null)
  const [guessIds, setGuessIds] = useState<number[]>([])
  const [won, setWon] = useState(false)
  const [totalWins, setTotalWins] = useState(0)

  useEffect(() => {
    if (legends.length && !target) {
      setTarget(pickRandomLegend(legends))
    }
  }, [legends, target])

  function startNextRound() {
    if (!legends.length) return
    setRound((r) => r + 1)
    setTarget(pickRandomLegend(legends))
    setGuessIds([])
    setWon(false)
  }

  function handleGuess(legend: { legend_id: number; bio_name: string }) {
    if (!target || won) return
    const guess = legends.find((l) => l.legend_id === legend.legend_id)
    if (!guess) return

    const row = buildClassicGuessRow(guess, target)
    const isWin = isClassicWin(row) || legend.legend_id === target.legend_id
    setGuessIds((ids) => [...ids, legend.legend_id])
    if (isWin) {
      setWon(true)
      setTotalWins((n) => n + 1)
    }
  }

  if (loading || !target) {
    return (
      <div className="game-board">
        <p className="game-board__hint">Chargement des légendes…</p>
      </div>
    )
  }

  return (
    <ClassicModeCore
      target={target}
      guessIds={guessIds}
      won={won}
      hintsSeed={`unlimited-${round}`}
      hintIntro={
        <>
          Mode illimité — légende aléatoire (manche {round}
          {totalWins > 0 ? ` · ${totalWins} victoire${totalWins > 1 ? 's' : ''}` : ''}
          ). Indices après 3, 5 et 7 essais — clique pour les afficher (arme → surnom →
          citation). Les
          couleurs indiquent :{' '}
          <span className="hint-swatch hint-swatch--ok">vert</span> exact,{' '}
          <span className="hint-swatch hint-swatch--near">jaune</span> proche (1 arme
          ou stat ±1),{' '}
          <span className="hint-swatch hint-swatch--hi">bleu clair</span> /{' '}
          <span className="hint-swatch hint-swatch--lo">bleu foncé</span> stat plus
          haute / plus basse.
        </>
      }
      onGuess={handleGuess}
      afterVictory={
        <button type="button" className="bh-btn game-board__next" onClick={startNextRound}>
          Légende suivante
        </button>
      }
    />
  )
}
