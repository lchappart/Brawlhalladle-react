import { GameShell } from '../components/GameShell'
import { LegendStatGame } from '../games/LegendStatGame'

export function LegendStatPage() {
  return (
    <GameShell title="Legend Stat">
      <LegendStatGame />
    </GameShell>
  )
}
