export type Legend = {
  legend_id: number
  legend_name_key: string
  bio_name: string
  bio_aka: string
  weapon_one: string
  weapon_two: string
  strength: string
  dexterity: string
  defense: string
  speed: string
}

/** Détails d'une légende (GET /legend/:id) — citation, etc. */
export type LegendDetail = Legend & {
  bio_quote?: string
  bio_quote_about_attrib?: string
  bio_quote_from?: string
  bio_quote_from_attrib?: string
}

export type StatKey = 'strength' | 'dexterity' | 'defense' | 'speed'

export type CellStatus = 'correct' | 'close' | 'wrong' | 'higher' | 'lower'

export type WeaponsKitStatus = 'correct' | 'close' | 'wrong'

export type ClassicGuessRow = {
  legend: Legend
  weaponsStatus: WeaponsKitStatus
  stats: Record<StatKey, CellStatus>
}
