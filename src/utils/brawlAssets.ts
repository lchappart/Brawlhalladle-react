/** Pack communautaire MIT : https://github.com/deemakuzovkin/bh-images */
const BH_IMAGES_BASE =
  'https://raw.githubusercontent.com/deemakuzovkin/bh-images/main'

const WIKI_GG_BASE = 'https://brawlhalla.wiki.gg/images'

const FANDOM_BASE = 'https://static.wikia.nocookie.net/brawlhalla_gamepedia/images'

/** Clé API → fichier dans bh-images/weapons */
const WEAPON_BH_FILE: Record<string, string> = {
  Hammer: 'hammer',
  Sword: 'sword',
  RocketLance: 'rocket lance',
  Spear: 'spear',
  Pistol: 'blasters',
  Katar: 'katars',
  Axe: 'axe',
  Bow: 'bow',
  Fists: 'gauntlets',
  Scythe: 'scythe',
  Cannon: 'cannon',
  Orb: 'orb',
  Greatsword: 'greatsword',
  Boots: 'battle boots',
}

/** Icônes Fandom (secours si bh-images indisponible) */
const WEAPON_FANDOM_ICON: Record<string, string> = {
  Hammer: `${FANDOM_BASE}/4/4b/Grapple_Hammer_Icon.png`,
  Sword: `${FANDOM_BASE}/3/32/Sword_Icon.png`,
  RocketLance: `${FANDOM_BASE}/5/5a/Rocket_Lance_Icon.png`,
  Spear: `${FANDOM_BASE}/0/00/Spear_Icon.png`,
  Pistol: `${FANDOM_BASE}/e/e0/Blasters_Icon.png`,
  Katar: `${FANDOM_BASE}/8/8c/Katars_Icon.png`,
  Axe: `${FANDOM_BASE}/c/c8/Axe_Icon.png`,
  Bow: `${FANDOM_BASE}/5/5e/Bow_Icon.png`,
  Fists: `${FANDOM_BASE}/4/4a/Gauntlets_Icon.png`,
  Scythe: `${FANDOM_BASE}/9/9a/Scythe_Icon.png`,
  Cannon: `${FANDOM_BASE}/8/8f/Cannon_Icon.png`,
  Orb: `${FANDOM_BASE}/4/4e/Orb_Icon.png`,
  Greatsword: `${FANDOM_BASE}/f/f7/Greatsword_Icon.png`,
  Boots: `${FANDOM_BASE}/9/9e/Battle_Boots_Icon.png`,
  Chakram: `${WIKI_GG_BASE}/Chakram_Icon.png`,
}

function wikiLegendFileName(legendNameKey: string): string {
  return legendNameKey
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('_')
}

/** URLs de portrait, du plus fiable au secours. */
export function getLegendPortraitUrls(legendNameKey: string): string[] {
  return [
    `${BH_IMAGES_BASE}/legends/big/${encodeURIComponent(legendNameKey)}.png`,
    `${WIKI_GG_BASE}/${wikiLegendFileName(legendNameKey)}.png`,
  ]
}

/** URLs d’icône d’arme, du plus fiable au secours. */
export function getWeaponIconUrls(weapon: string): string[] {
  const urls: string[] = []
  const bhFile = WEAPON_BH_FILE[weapon]
  if (bhFile) {
    urls.push(`${BH_IMAGES_BASE}/weapons/${encodeURIComponent(bhFile)}.png`)
  }
  const fandom = WEAPON_FANDOM_ICON[weapon]
  if (fandom) urls.push(fandom)
  return urls
}
