import { GameShell } from '../components/GameShell'
import { BrawldokuUnlimitedGame } from '../games/BrawldokuUnlimitedGame'

export function BrawldokuUnlimitedPage() {
  return (
    <GameShell title="Brawldoku illimité">
      <BrawldokuUnlimitedGame />
    </GameShell>
  )
}
