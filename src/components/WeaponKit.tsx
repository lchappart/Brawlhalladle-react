import type { Legend } from '../api/types'
import { WeaponIcon } from './WeaponIcon'
import './brawl-assets.css'

type WeaponKitProps = {
  legend: Pick<Legend, 'weapon_one' | 'weapon_two'>
  size?: 'xs' | 'sm' | 'md'
}

export function WeaponKit({ legend, size = 'xs' }: WeaponKitProps) {
  return (
    <span className="bh-weapon-kit">
      <WeaponIcon weapon={legend.weapon_one} size={size} />
      <WeaponIcon weapon={legend.weapon_two} size={size} />
    </span>
  )
}
