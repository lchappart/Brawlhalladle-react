import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchAllLegends } from '../api/brawlhallaClient'
import { getApiQuota } from '../api/rateLimit'
import type { Legend } from '../api/types'

type LegendsContextValue = {
  legends: Legend[]
  loading: boolean
  error: string | null
  fromCache: boolean
  quota: ReturnType<typeof getApiQuota>
  reload: (force?: boolean) => Promise<void>
}

const LegendsContext = createContext<LegendsContextValue | null>(null)

export function LegendsProvider({ children }: { children: ReactNode }) {
  const [legends, setLegends] = useState<Legend[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fromCache, setFromCache] = useState(true)
  const [quota, setQuota] = useState(getApiQuota)

  const reload = useCallback(async (force = false) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchAllLegends({ force })
      setLegends(result.legends)
      setFromCache(result.fromCache)
      setQuota(getApiQuota())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload(false)
  }, [reload])

  const value = useMemo(
    () => ({ legends, loading, error, fromCache, quota, reload }),
    [legends, loading, error, fromCache, quota, reload],
  )

  return (
    <LegendsContext.Provider value={value}>{children}</LegendsContext.Provider>
  )
}

export function useLegends() {
  const ctx = useContext(LegendsContext)
  if (!ctx) throw new Error('useLegends doit être utilisé dans LegendsProvider')
  return ctx
}
