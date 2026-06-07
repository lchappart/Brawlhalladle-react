import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Legend } from '../api/types'
import { legendMatchesQuery, normalizeName } from '../utils/legendGame'
import { LegendPortrait } from './LegendPortrait'
import { WeaponKit } from './WeaponKit'
import './LegendAutocomplete.css'
import './brawl-assets.css'

type LegendAutocompleteProps = {
  legends: Legend[]
  value: string
  onChange: (value: string) => void
  onSubmit: (legend: Legend) => void
  /** Légendes déjà essayées — exclues des suggestions et de la validation Entrée */
  excludedLegendIds?: readonly number[]
  disabled?: boolean
  placeholder?: string
  /** Afficher les armes dans les suggestions (désactivé en Brawldoku) */
  showWeapons?: boolean
}

const MAX_SUGGESTIONS = 8

type ListPosition = {
  top: number
  left: number
  width: number
}

export function LegendAutocomplete({
  legends,
  value,
  onChange,
  onSubmit,
  excludedLegendIds = [],
  disabled,
  placeholder = 'Nom de la légende…',
  showWeapons = true,
}: LegendAutocompleteProps) {
  const listId = useId()
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [listPosition, setListPosition] = useState<ListPosition | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const excludedIds = useMemo(
    () => new Set(excludedLegendIds),
    [excludedLegendIds],
  )

  const selectableLegends = useMemo(
    () => legends.filter((l) => !excludedIds.has(l.legend_id)),
    [legends, excludedIds],
  )

  const suggestions = useMemo(() => {
    if (!value.trim()) return []
    return selectableLegends
      .filter((l) => legendMatchesQuery(l, value))
      .slice(0, MAX_SUGGESTIONS)
  }, [selectableLegends, value])

  const showList = open && suggestions.length > 0

  useEffect(() => {
    setActiveIndex(0)
  }, [suggestions])

  useEffect(() => {
    if (!showList || !wrapperRef.current) {
      setListPosition(null)
      return
    }

    function updatePosition() {
      const el = wrapperRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setListPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [showList, value, suggestions.length])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node
      if (wrapperRef.current?.contains(target)) return
      if (listRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  function pick(legend: Legend) {
    onChange(legend.bio_name)
    setOpen(false)
    onSubmit(legend)
  }

  function trySubmitTyped() {
    const exact = selectableLegends.find(
      (l) => normalizeName(l.bio_name) === normalizeName(value),
    )
    if (exact) {
      onSubmit(exact)
      return
    }
    if (suggestions[activeIndex]) pick(suggestions[activeIndex]!)
  }

  const list = showList && listPosition && (
    <ul
      ref={listRef}
      className="legend-ac__list legend-ac__list--portal"
      id={listId}
      role="listbox"
      style={{
        top: listPosition.top,
        left: listPosition.left,
        width: listPosition.width,
      }}
    >
      {suggestions.map((legend, i) => (
        <li key={legend.legend_id}>
          <button
            type="button"
            role="option"
            aria-selected={i === activeIndex}
            className={
              i === activeIndex ? 'legend-ac__option is-active' : 'legend-ac__option'
            }
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => pick(legend)}
          >
            <span className="legend-ac__option-inner">
              <LegendPortrait
                legendNameKey={legend.legend_name_key}
                bioName={legend.bio_name}
                size="md"
              />
              <span className="legend-ac__option-text">
                <span className="legend-ac__name">{legend.bio_name}</span>
                {showWeapons && (
                  <span className="legend-ac__weapons legend-ac__weapons-row">
                    <WeaponKit legend={legend} size="sm" />
                  </span>
                )}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="legend-ac" ref={wrapperRef}>
      <input
        className="legend-ac__input"
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex((i) => Math.max(i - 1, 0))
          } else if (e.key === 'Enter') {
            e.preventDefault()
            trySubmitTyped()
          } else if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
      />
      {list && createPortal(list, document.body)}
    </div>
  )
}
