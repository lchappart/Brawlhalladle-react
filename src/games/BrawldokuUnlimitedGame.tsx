import { useMemo, useState } from 'react'
import { useLegends } from '../context/LegendsContext'
import { generateBrawldokuPuzzle } from '../utils/legendGame'
import { BrawldokuModeCore } from './BrawldokuModeCore'

function emptyPicks() {
  return [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
}

function newRoundSeed(round: number) {
  return `brawldoku-unlimited-${round}-${Date.now()}`
}

export function BrawldokuUnlimitedGame() {
  const { legends, loading } = useLegends()
  const [round, setRound] = useState(1)
  const [seed, setSeed] = useState(() => newRoundSeed(1))
  const [picks, setPicks] = useState(emptyPicks)
  const [completed, setCompleted] = useState(false)
  const [totalWins, setTotalWins] = useState(0)

  const puzzle = useMemo(
    () => (legends.length ? generateBrawldokuPuzzle(legends, seed) : null),
    [legends, seed],
  )

  function startNextRound() {
    const nextRound = round + 1
    setRound(nextRound)
    setSeed(newRoundSeed(nextRound))
    setPicks(emptyPicks())
    setCompleted(false)
  }

  return (
    <BrawldokuModeCore
      key={seed}
      puzzle={puzzle}
      legends={legends}
      loading={loading}
      picks={picks}
      completed={completed}
      onPicksChange={setPicks}
      onComplete={() => {
        setCompleted(true)
        setTotalWins((n) => n + 1)
      }}
      emptyPuzzleMessage="Impossible de générer cette grille — passe à la suivante."
      hintIntro={
        <>
          Mode illimité — grille aléatoire (manche {round}
          {totalWins > 0
            ? ` · ${totalWins} grille${totalWins > 1 ? 's' : ''} complétée${totalWins > 1 ? 's' : ''}`
            : ''}
          ). Clique une case, puis cherche la légende aux deux armes indiquées.
        </>
      }
      afterVictory={
        <button
          type="button"
          className="bh-btn game-board__next"
          onClick={startNextRound}
        >
          Grille suivante
        </button>
      }
    />
  )
}
