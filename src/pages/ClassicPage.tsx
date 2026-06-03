import { GameShell } from '../components/GameShell'
import { ClassicGame } from '../games/ClassicGame'

export function ClassicPage() {
  return (
    <GameShell title="Classique">
      <ClassicGame />
    </GameShell>
  )
}
