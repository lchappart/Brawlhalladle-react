import { useLegends } from '../context/LegendsContext'
import './ApiBanner.css'

export function ApiBanner() {
  const { loading, error, fromCache, quota, reload } = useLegends()

  if (loading) {
    return (
      <p className="api-banner api-banner--loading" role="status">
        Chargement des légendes…
      </p>
    )
  }

  if (error) {
    return (
      <div className="api-banner api-banner--error" role="alert">
        <p>{error}</p>
        <button type="button" className="bh-btn bh-btn--ghost" onClick={() => reload()}>
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <p className="api-banner" role="status">
      {fromCache ? 'Données en cache' : 'Données API'} — quota :{' '}
      <strong>
        {quota.remaining}/{quota.max}
      </strong>{' '}
      appels restants ({quota.windowMinutes} min)
    </p>
  )
}
