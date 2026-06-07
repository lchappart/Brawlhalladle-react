import type {
  CellStatus,
  ClassicGuessRow,
  Legend,
  StatKey,
  WeaponsKitStatus,
} from '../api/types'
import { getDayKey, hashString, pickDailyIndex, seededShuffle } from './daily'

export const STAT_KEYS: StatKey[] = [
  'strength',
  'dexterity',
  'defense',
  'speed',
]

export const STAT_LABELS: Record<StatKey, string> = {
  strength: 'Force',
  dexterity: 'Dextérité',
  defense: 'Défense',
  speed: 'Vitesse',
}

export function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
}

export function legendMatchesQuery(legend: Legend, query: string): boolean {
  const q = normalizeName(query)
  if (!q) return true
  return (
    normalizeName(legend.bio_name).includes(q) ||
    normalizeName(legend.legend_name_key).includes(q) ||
    normalizeName(legend.bio_aka).includes(q)
  )
}

export function findLegendByName(legends: Legend[], name: string): Legend | undefined {
  const q = normalizeName(name)
  return legends.find(
    (l) =>
      normalizeName(l.bio_name) === q ||
      normalizeName(l.legend_name_key) === q,
  )
}

export function getDailyLegend(legends: Legend[], dayKey = getDayKey()): Legend {
  const sorted = [...legends].sort((a, b) => a.legend_id - b.legend_id)
  const index = pickDailyIndex(`classic-${dayKey}`, sorted.length)
  return sorted[index]!
}

export function pickRandomLegend(
  legends: Legend[],
  excludeIds: number[] = [],
): Legend {
  const exclude = new Set(excludeIds)
  const pool = legends.filter((l) => !exclude.has(l.legend_id))
  const source = pool.length > 0 ? pool : legends
  return source[Math.floor(Math.random() * source.length)]!
}

export function statValue(legend: Legend, key: StatKey): number {
  return Number.parseInt(legend[key], 10)
}

export function compareStat(
  guess: number,
  target: number,
): CellStatus {
  if (guess === target) return 'correct'
  if (Math.abs(guess - target) === 1) return 'close'
  return guess > target ? 'higher' : 'lower'
}

/** Compare les deux armes du guess au kit cible (ordre ignoré). */
export function compareWeaponsKit(guess: Legend, target: Legend): WeaponsKitStatus {
  const guessKit = new Set([guess.weapon_one, guess.weapon_two])
  const matches = [target.weapon_one, target.weapon_two].filter((w) =>
    guessKit.has(w),
  ).length
  if (matches === 2) return 'correct'
  if (matches === 1) return 'close'
  return 'wrong'
}

export function formatWeaponName(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, '$1 $2')
}

const QUOTE_NAME_PLACEHOLDER = '???'

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Regex insensible aux accents (ex. Bodvar ↔ Bödvar). */
function accentFlexibleNameRegex(term: string): RegExp {
  const chars = [...term.normalize('NFC')]
  let pattern = ''
  for (const char of chars) {
    const base = char.normalize('NFD').replace(/\p{M}/gu, '')
    if (/[aeiouAEIOU]/.test(base)) {
      pattern += `${escapeRegExp(base)}\\p{M}?`
    } else {
      pattern += escapeRegExp(base)
    }
  }
  return new RegExp(pattern, 'giu')
}

function formatLegendNameKey(key: string): string {
  const spaced = key.replace(/_/g, ' ')
  return formatWeaponName(spaced)
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

function collectLegendNameTerms(legend: Legend): string[] {
  const seen = new Set<string>()
  const terms: string[] = []

  const add = (raw: string) => {
    const t = raw.trim()
    if (t.length < 2) return
    const key = normalizeName(t)
    if (seen.has(key)) return
    seen.add(key)
    terms.push(t)
  }

  add(legend.bio_name)
  if (normalizeName(legend.bio_aka) !== normalizeName(legend.bio_name)) {
    add(legend.bio_aka)
  }
  add(formatLegendNameKey(legend.legend_name_key))

  const words = legend.bio_name.trim().split(/\s+/).filter((w) => w.length >= 3)
  if (words.length > 1) {
    for (const w of words) add(w)
  }

  return terms.sort((a, b) => b.length - a.length)
}

/** Masque le nom de la légende dans une citation (indice classique). */
export function anonymizeQuoteForHint(quote: string, legend: Legend): string {
  let result = quote
  for (const term of collectLegendNameTerms(legend)) {
    result = result.replace(accentFlexibleNameRegex(term), QUOTE_NAME_PLACEHOLDER)
  }
  return result
}

export function formatLegendWeapons(legend: Legend): string {
  return `${formatWeaponName(legend.weapon_one)} · ${formatWeaponName(legend.weapon_two)}`
}

export function buildClassicGuessRow(
  guess: Legend,
  target: Legend,
): ClassicGuessRow {
  return {
    legend: guess,
    weaponsStatus: compareWeaponsKit(guess, target),
    stats: {
      strength: compareStat(statValue(guess, 'strength'), statValue(target, 'strength')),
      dexterity: compareStat(
        statValue(guess, 'dexterity'),
        statValue(target, 'dexterity'),
      ),
      defense: compareStat(statValue(guess, 'defense'), statValue(target, 'defense')),
      speed: compareStat(statValue(guess, 'speed'), statValue(target, 'speed')),
    },
  }
}

export function isClassicWin(row: ClassicGuessRow): boolean {
  return (
    row.weaponsStatus === 'correct' &&
    STAT_KEYS.every((k) => row.stats[k] === 'correct')
  )
}

export function getUniqueWeapons(legends: Legend[]): string[] {
  const set = new Set<string>()
  for (const l of legends) {
    set.add(l.weapon_one)
    set.add(l.weapon_two)
  }
  return [...set].sort((a, b) => a.localeCompare(b))
}

export function findLegendsWithWeapons(
  legends: Legend[],
  weaponA: string,
  weaponB: string,
): Legend[] {
  return legends.filter((l) => {
    const kit = [l.weapon_one, l.weapon_two]
    return kit.includes(weaponA) && kit.includes(weaponB)
  })
}

export type BrawldokuPuzzle = {
  dayKey: string
  rowWeapons: [string, string, string]
  colWeapons: [string, string, string]
  answers: Legend[][]
}

export function generateBrawldokuPuzzle(
  legends: Legend[],
  dayKey = getDayKey(),
): BrawldokuPuzzle | null {
  const weapons = getUniqueWeapons(legends)
  if (weapons.length < 6) return null

  const baseSeed = hashString(`brawldoku-${dayKey}`)

  for (let attempt = 0; attempt < 200; attempt++) {
    const seed = baseSeed + attempt * 997
    const shuffled = seededPickSix(weapons, seed)
    const rowWeapons = shuffled.slice(0, 3) as [string, string, string]
    const colWeapons = shuffled.slice(3, 6) as [string, string, string]

    const answers: Legend[][] = []
    let valid = true

    for (const rw of rowWeapons) {
      const row: Legend[] = []
      for (const cw of colWeapons) {
        const matches = findLegendsWithWeapons(legends, rw, cw)
        if (matches.length !== 1) {
          valid = false
          break
        }
        row.push(matches[0]!)
      }
      if (!valid) break
      answers.push(row)
    }

    if (valid) {
      return { dayKey, rowWeapons, colWeapons, answers }
    }
  }

  return null
}

function seededPickSix(weapons: string[], seed: number): string[] {
  return seededShuffle(weapons, seed).slice(0, 6)
}
