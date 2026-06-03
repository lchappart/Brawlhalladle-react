import { useEffect, useState } from 'react'
import type { Legend, LegendDetail } from '../api/types'
import { anonymizeQuoteForHint, formatWeaponName } from '../utils/legendGame'
import { WeaponIcon } from './WeaponIcon'
import './brawl-assets.css'
import { pickDailyIndex } from '../utils/daily'
import './ClassicHints.css'

/** Nombre d'essais requis pour débloquer chaque indice (1 → 3, 2 → 5, 3 → 7). */
export const CLASSIC_HINT_UNLOCK_AT = [3, 5, 7] as const

function isHintUnlocked(step: number, guessCount: number, won: boolean): boolean {
  if (won) return true
  const required = CLASSIC_HINT_UNLOCK_AT[step - 1]
  return required !== undefined && guessCount >= required
}

type ClassicHintsProps = {
  target: Legend
  detail: LegendDetail | null
  detailLoading: boolean
  guessCount: number
  won: boolean
  hintsSeed: string
}

export function ClassicHints({
  target,
  detail,
  detailLoading,
  guessCount,
  won,
  hintsSeed,
}: ClassicHintsProps) {
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set())

  useEffect(() => {
    setRevealed(new Set())
  }, [hintsSeed])

  function revealHint(step: number) {
    setRevealed((prev) => new Set(prev).add(step))
  }

  const weaponHint =
    pickDailyIndex(`classic-weapon-hint-${hintsSeed}`, 2) === 0
      ? target.weapon_one
      : target.weapon_two

  const hints = [
    {
      step: 1,
      label: 'Indice 1 — Arme',
      content: (
        <span className="classic-hints__weapon-hint">
          <WeaponIcon weapon={weaponHint} size="lg" />
          {formatWeaponName(weaponHint)}
        </span>
      ),
    },
    {
      step: 2,
      label: 'Indice 2 — Surnom',
      content: target.bio_aka,
    },
    {
      step: 3,
      label: 'Indice 3 — Citation',
      content: detail?.bio_quote?.trim()
        ? anonymizeQuoteForHint(detail.bio_quote.trim(), target)
        : null,
      loading: detailLoading && isHintUnlocked(3, guessCount, won),
    },
  ] as const

  return (
    <aside className="classic-hints" aria-label="Indices">
      <h2 className="classic-hints__title">Indices</h2>
      <ol className="classic-hints__list">
        {hints.map((hint) => {
          const isAvailable = isHintUnlocked(hint.step, guessCount, won)
          const isRevealed = revealed.has(hint.step)
          const requiredGuesses = CLASSIC_HINT_UNLOCK_AT[hint.step - 1]!
          const itemClass = [
            'classic-hints__item',
            isAvailable ? 'classic-hints__item--available' : '',
            isRevealed ? 'classic-hints__item--revealed' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <li key={hint.step} className={itemClass}>
              <span className="classic-hints__label">{hint.label}</span>
              {!isAvailable ? (
                <p className="classic-hints__locked">
                  Débloqué après {requiredGuesses} essais
                </p>
              ) : isRevealed ? (
                <p className="classic-hints__content">
                  {'loading' in hint && hint.loading ? (
                    <span className="classic-hints__loading">Chargement…</span>
                  ) : hint.content ? (
                    hint.content
                  ) : (
                    <span className="classic-hints__missing">
                      Citation indisponible
                    </span>
                  )}
                </p>
              ) : (
                <button
                  type="button"
                  className="classic-hints__reveal"
                  onClick={() => revealHint(hint.step)}
                >
                  Cliquer pour afficher
                </button>
              )}
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
