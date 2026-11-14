import { useEffect, useState } from 'react'
import { api, ApiError } from './api'

type Result<T> = {
  key: string;
  data?: T;
  error?: string
}

// GET em qualquer rota. path = null -> não busca.
export function useFetch<T>(path: string | null) {
  const [result, setResult] = useState<Result<T> | null>(null)
  const [attempt, setAttempt] = useState(0)
  const key = `${path}|${attempt}`

  useEffect(() => {
    if (!path)
      return
    let cancelled = false

    api<T>(path)
      .then(data => { if (!cancelled) setResult({ key, data }) })
      .catch(e => {
        if (!cancelled) setResult({ key, error: e instanceof ApiError ? e.message : 'Não foi possível carregar.' })
      })

    return () => { cancelled = true }
  }, [key, path])

  const current = result?.key === key ? result : null

  return {
    data: current?.data ?? null,
    loading: !!path && !current,
    error: current?.error ?? null,
    reload: () => setAttempt(n => n + 1),
  }
}