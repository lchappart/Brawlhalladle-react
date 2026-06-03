import type { Legend, LegendDetail } from './types'
import { canMakeApiCall, recordApiCall, RateLimitError } from './rateLimit'

const CACHE_KEY = 'bh_legends_cache_v1'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

type LegendsCache = {
  fetchedAt: number
  legends: Legend[]
}

function getApiKey(): string {
  const key = import.meta.env.VITE_BRAWLHALLA_API_KEY?.trim()
  if (!key) throw new Error('Clé API manquante. Ajoute VITE_BRAWLHALLA_API_KEY dans .env')
  return key
}

function getBaseUrl(): string {
  return (
    import.meta.env.VITE_BRAWLHALLA_API_URL?.trim() || 'https://api.brawlhalla.com'
  ).replace(/\/$/, '')
}

function readCache(): LegendsCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as LegendsCache
    if (!parsed.legends?.length || !parsed.fetchedAt) return null
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(legends: Legend[]) {
  const payload: LegendsCache = { fetchedAt: Date.now(), legends }
  localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
}

/** Lecture du cache même expiré (secours si quota dépassé). */
export function readLegendsCacheStale(): Legend[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as LegendsCache
    return parsed.legends?.length ? parsed.legends : null
  } catch {
    return null
  }
}

/**
 * Un seul endpoint réseau : GET /legend/all
 * Toutes les armes et stats sont dérivées localement.
 */
export async function fetchAllLegends(options?: {
  force?: boolean
}): Promise<{ legends: Legend[]; fromCache: boolean }> {
  const cached = readCache()
  if (cached && !options?.force) {
    return { legends: cached.legends, fromCache: true }
  }

  if (!canMakeApiCall()) {
    const stale = readLegendsCacheStale()
    if (stale) return { legends: stale, fromCache: true }
    throw new RateLimitError()
  }

  const url = `${getBaseUrl()}/legend/all?api_key=${encodeURIComponent(getApiKey())}`
  recordApiCall()

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`API Brawlhalla (${res.status}): impossible de charger les légendes.`)
  }

  const legends = (await res.json()) as Legend[]
  writeCache(legends)
  return { legends, fromCache: false }
}

const DETAIL_CACHE_PREFIX = 'bh_legend_detail_'
const DETAIL_TTL_MS = 24 * 60 * 60 * 1000

function detailCacheKey(legendId: number): string {
  return `${DETAIL_CACHE_PREFIX}${legendId}`
}

function readDetailCache(legendId: number): LegendDetail | null {
  try {
    const raw = localStorage.getItem(detailCacheKey(legendId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as { fetchedAt: number; detail: LegendDetail }
    if (Date.now() - parsed.fetchedAt > DETAIL_TTL_MS) return null
    return parsed.detail
  } catch {
    return null
  }
}

function writeDetailCache(detail: LegendDetail) {
  localStorage.setItem(
    detailCacheKey(detail.legend_id),
    JSON.stringify({ fetchedAt: Date.now(), detail }),
  )
}

/**
 * GET /legend/:id — pour bio_quote (1 appel / légende, mis en cache).
 */
export async function fetchLegendDetail(
  legendId: number,
): Promise<{ detail: LegendDetail; fromCache: boolean }> {
  const cached = readDetailCache(legendId)
  if (cached) return { detail: cached, fromCache: true }

  if (!canMakeApiCall()) {
    const staleRaw = localStorage.getItem(detailCacheKey(legendId))
    if (staleRaw) {
      const parsed = JSON.parse(staleRaw) as { detail: LegendDetail }
      return { detail: parsed.detail, fromCache: true }
    }
    throw new RateLimitError()
  }

  const url = `${getBaseUrl()}/legend/${legendId}?api_key=${encodeURIComponent(getApiKey())}`
  recordApiCall()

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`API Brawlhalla (${res.status}): détails légende indisponibles.`)
  }

  const detail = (await res.json()) as LegendDetail
  writeDetailCache(detail)
  return { detail, fromCache: false }
}
