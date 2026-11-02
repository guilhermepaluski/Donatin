import { useEffect, useState } from "react";
import { api, ApiError } from './api'
import type { Campaign } from "../types";

type Result = {
  key: string;
  campaigns?: Campaign[];
  error?: string
}

type DetailResult = {
  key: string;
  campaign?: Campaign;
  error?: string
}

// request a list of campaigns and controls "carregando/erro/tentar de novo"
function useCampaignRequest(path: string) {
  const [result, setResult] = useState<Result | null>(null)
  const [attempt, setAttempt] = useState(0)

  const key = `${path}|${attempt}`

  useEffect(() => {
    let cancelled = false

    api<Campaign[]>(path)
      .then(campaigns => {
        if (!cancelled)
          setResult({ key, campaigns })
      })
      .catch(e => {
        if (!cancelled)
          setResult({ key, error: e instanceof ApiError ? e.message : 'Não foi possível carregar as campanhas.' })
      })

    return () => { cancelled = true }
  }, [key, path])

  return {
    campaigns: result?.campaigns ?? [],
    loading: result?.key !== key,
    error: result?.key === key ? (result.error ?? null) : null,
    reload: () => setAttempt(n => n + 1)
  }
}

// URL = GET /campaigns?category=...&keyword=...
export function useCampaigns(category: string, keyword: string) {
  const params = new URLSearchParams()
  
  if (category)
    params.set('category', category)
  if (keyword)
    params.set('keyword', keyword)
  
  const query = params.toString()
  return useCampaignRequest(`/campaigns${query ? `?${query}` : ''}`)
}

// GET /campaigns/${id}
export function useCampaignDetails(id: string) {
  const [result, setResult] = useState<DetailResult | null>(null)
  const [attempt, setAttempt] = useState(0)

  const key = `${id}|${attempt}`

  useEffect(() => {
    let cancelled = false

    api<Campaign>(`/campaigns/${id}`)
      .then(campaign => {
        if (!cancelled)
          setResult({ key, campaign })
      })
      .catch(e => {
        if (!cancelled)
          setResult({ key, error: e instanceof ApiError ? e.message : 'Não foi possível carregar a campanha.' })
      })

    return () => { cancelled = true }
  }, [key, id])

  const current = result?.key === key ? result : null

  return {
    campaign: current?.campaign ?? null,
    loading: !current,
    error: current?.error ?? null,
    reload: () => setAttempt(n => n + 1)
  }
}

// GET /campaigns/closest-to-goal?limit=3
export function useClosestToGoalCampaigns(limit = 3) {
  return useCampaignRequest(`/campaigns/closest-to-goal?limit=${limit}`)
}

// espera o usuário parar de digitar antes de buscar (evita uma requisição por letra)
export function useDebounced<T>(value: T, ms: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(timer)
  }, [value, ms])
  return debounced
}