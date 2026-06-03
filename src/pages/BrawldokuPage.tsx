import { GameShell } from '../components/GameShell'
import { BrawldokuGame } from '../games/BrawldokuGame'

export function BrawldokuPage() {
  return (
    <GameShell title="Brawldoku">
      <BrawldokuGame />
    </GameShell>
  )
}
