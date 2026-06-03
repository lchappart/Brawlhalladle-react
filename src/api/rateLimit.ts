const STORAGE_KEY = 'bh_api_calls'
const MAX_CALLS = 10
const WINDOW_MS = 15 * 60 * 1000

type CallLog = {
  timestamps: number[]
}

function readLog(): CallLog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { timestamps: [] }
    const parsed = JSON.parse(raw) as CallLog
    return Array.isArray(parsed.timestamps) ? parsed : { timestamps: [] }
  } catch {
    return { timestamps: [] }
  }
}

function writeLog(log: CallLog) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log))
}

function prune(timestamps: number[]): number[] {
  const cutoff = Date.now() - WINDOW_MS
  return timestamps.filter((t) => t > cutoff)
}

export function getApiQuota() {
  const timestamps = prune(readLog().timestamps)
  return {
    used: timestamps.length,
    remaining: Math.max(0, MAX_CALLS - timestamps.length),
    max: MAX_CALLS,
    windowMinutes: WINDOW_MS / 60_000,
  }
}

export function canMakeApiCall(): boolean {
  return getApiQuota().remaining > 0
}

export function recordApiCall() {
  const timestamps = [...prune(readLog().timestamps), Date.now()]
  writeLog({ timestamps })
}

export class RateLimitError extends Error {
  constructor() {
    super(
      `Limite API atteinte (${MAX_CALLS} appels / ${WINDOW_MS / 60_000} min). Réessaie plus tard ou utilise le cache.`,
    )
    this.name = 'RateLimitError'
  }
}
