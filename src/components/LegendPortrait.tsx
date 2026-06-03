import { useMemo } from 'react'
import { useImageFallback } from '../hooks/useImageFallback'
import { getLegendPortraitUrls } from '../utils/brawlAssets'
import './brawl-assets.css'

type PortraitSize = 'sm' | 'md' | 'lg'

type LegendPortraitProps = {
  legendNameKey: string
  bioName: string
  size?: PortraitSize
  className?: string
}

export function LegendPortrait({
  legendNameKey,
  bioName,
  size = 'md',
  className = '',
}: LegendPortraitProps) {
  const urls = useMemo(
    () => getLegendPortraitUrls(legendNameKey),
    [legendNameKey],
  )
  const { src, onError, exhausted } = useImageFallback(urls)

  const sizeClass = `bh-portrait--${size}`

  if (exhausted) {
    return (
      <span
        className={`bh-portrait bh-portrait--placeholder ${sizeClass} ${className}`.trim()}
        aria-hidden
      >
        {bioName.slice(0, 2)}
      </span>
    )
  }

  return (
    <img
      className={`bh-portrait ${sizeClass} ${className}`.trim()}
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={onError}
    />
  )
}
