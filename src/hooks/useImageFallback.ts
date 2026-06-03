import { useEffect, useMemo, useState } from 'react'

export function useImageFallback(urls: readonly string[]) {
  const key = useMemo(() => urls.join('\0'), [urls])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [key])

  const src = urls[index]
  const exhausted = index >= urls.length

  function onError() {
    setIndex((i) => i + 1)
  }

  return { src, onError, exhausted }
}
