import { useMemo } from 'react'
import { useImageFallback } from '../hooks/useImageFallback'
import { getWeaponIconUrls } from '../utils/brawlAssets'
import { formatWeaponName } from '../utils/legendGame'
import './brawl-assets.css'

type WeaponIconSize = 'xs' | 'sm' | 'md' | 'lg'

type WeaponIconProps = {
  weapon: string
  size?: WeaponIconSize
  /** Texte sous l’icône (grille Brawldoku) */
  showLabel?: boolean
  className?: string
}

export function WeaponIcon({
  weapon,
  size = 'sm',
  showLabel = false,
  className = '',
}: WeaponIconProps) {
  const urls = useMemo(() => getWeaponIconUrls(weapon), [weapon])
  const { src, onError, exhausted } = useImageFallback(urls)
  const label = formatWeaponName(weapon)

  const icon =
    !exhausted && src ? (
      <img
        className={`bh-weapon-icon bh-weapon-icon--${size}`}
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onError={onError}
      />
    ) : (
      <span
        className={`bh-weapon-icon bh-weapon-icon--${size} bh-portrait--placeholder`}
        style={{ fontSize: '0.45rem' }}
        aria-hidden
      >
        {weapon.slice(0, 2)}
      </span>
    )

  if (!showLabel) {
    return (
      <span
        className={className}
        title={label}
        aria-label={label}
        role="img"
      >
        {icon}
      </span>
    )
  }

  return (
    <span className={`bh-weapon-label-wrap ${className}`.trim()}>
      {icon}
      <span className="bh-weapon-label-wrap__text">{label}</span>
    </span>
  )
}
