import { GameShell } from '../components/GameShell'
import { UnlimitedGame } from '../games/UnlimitedGame'

export function UnlimitedPage() {
  return (
    <GameShell title="Illimité">
      <UnlimitedGame />
    </GameShell>
  )
}
