import { useMemo } from 'react'
import { useLegends } from '../context/LegendsContext'
import { useGameStorage } from '../hooks/useGameStorage'
import {
  buildClassicGuessRow,
  getDailyLegend,
  isClassicWin,
} from '../utils/legendGame'
import { getDayKey } from '../utils/daily'
import { ClassicModeCore } from './ClassicModeCore'

type StoredClassic = {
  dayKey: string
  guessIds: number[]
  won: boolean
}

export function ClassicGame() {
  const { legends, loading } = useLegends()
  const dayKey = getDayKey()
  const target = useMemo(
    () => (legends.length ? getDailyLegend(legends, dayKey) : null),
    [legends, dayKey],
  )

  const storageKey = `classic_${dayKey}`
  const [stored, setStored] = useGameStorage<StoredClassic>(storageKey, {
    dayKey,
    guessIds: [],
    won: false,
  })

  function handleGuess(legend: { legend_id: number; bio_name: string }) {
    if (!target || stored.won) return
    const guess = legends.find((l) => l.legend_id === legend.legend_id)
    if (!guess) return

    const row = buildClassicGuessRow(guess, target)
    const won = isClassicWin(row) || legend.legend_id === target.legend_id

    setStored({
      dayKey,
      guessIds: [...stored.guessIds, legend.legend_id],
      won,
    })
  }

  if (loading || !target) {
    return (
      <div className="game-board">
        <p className="game-board__hint">Préparation du défi du jour…</p>
      </div>
    )
  }

  return (
    <ClassicModeCore
      target={target}
      guessIds={stored.guessIds}
      won={stored.won}
      hintsSeed={dayKey}
      hintIntro={
        <>
          Devine la légende du jour ({dayKey}). Indices débloqués après 3, 5 et 7 essais
          — clique pour les afficher (arme → surnom → citation). Les couleurs indiquent :{' '}
          <span className="hint-swatch hint-swatch--ok">vert</span> exact,{' '}
          <span className="hint-swatch hint-swatch--near">jaune</span> proche (1 arme
          ou stat ±1),{' '}
          <span className="hint-swatch hint-swatch--hi">bleu clair</span> /{' '}
          <span className="hint-swatch hint-swatch--lo">bleu foncé</span> stat plus
          haute / plus basse.
        </>
      }
      onGuess={handleGuess}
    />
  )
}
