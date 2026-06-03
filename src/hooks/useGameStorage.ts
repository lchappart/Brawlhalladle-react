import { useCallback, useEffect, useState } from 'react'

export function useGameStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) return JSON.parse(raw) as T
    } catch {
      /* ignore */
    }
    return initial
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  const reset = useCallback(() => setState(initial), [initial])

  return [state, setState, reset] as const
}
