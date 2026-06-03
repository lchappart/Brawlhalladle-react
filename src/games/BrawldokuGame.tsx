import { useMemo } from 'react'
import { useLegends } from '../context/LegendsContext'
import { useGameStorage } from '../hooks/useGameStorage'
import { getDayKey } from '../utils/daily'
import { generateBrawldokuPuzzle } from '../utils/legendGame'
import { BrawldokuModeCore } from './BrawldokuModeCore'

type StoredBrawldoku = {
  dayKey: string
  picks: number[][]
  completed: boolean
}

function emptyPicks() {
  return [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
}

export function BrawldokuGame() {
  const { legends, loading } = useLegends()
  const dayKey = getDayKey()

  const puzzle = useMemo(
    () => (legends.length ? generateBrawldokuPuzzle(legends, dayKey) : null),
    [legends, dayKey],
  )

  const storageKey = `brawldoku_${dayKey}`
  const [stored, setStored] = useGameStorage<StoredBrawldoku>(storageKey, {
    dayKey,
    picks: emptyPicks(),
    completed: false,
  })

  return (
    <BrawldokuModeCore
      puzzle={puzzle}
      legends={legends}
      loading={loading}
      picks={stored.picks}
      completed={stored.completed}
      onPicksChange={(picks) => setStored({ ...stored, picks })}
      onComplete={() => setStored({ ...stored, completed: true })}
      hintIntro={
        <>
          Grille du {dayKey} : clique une case, puis cherche la légende qui a les
          deux armes indiquées (ligne × colonne).
        </>
      }
    />
  )
}
