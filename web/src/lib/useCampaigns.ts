import { useEffect, useState } from "react";
import { useFetch } from './useFetch'
import type { Campaign } from "../types";

// URL = GET /campaigns?category=...&keyword=...
export function useCampaigns(category: string, keyword: string) {
  const params = new URLSearchParams()
  
  if (category)
    params.set('category', category)
  if (keyword)
    params.set('keyword', keyword)
  
  const query = params.toString()
  const { data, ...rest } = useFetch<Campaign[]>(`/campaigns${query ? `?${query}` : ''}`)
  return { campaigns: data ?? [], ...rest }
}

// GET /campaigns/${id}
export function useCampaignDetails(id: string) {
  const { data, ...rest } = useFetch<Campaign>(`/campaigns/${id}`)
  return { campaign: data, ...rest } // return just one campaign here
}

// GET /campaigns/closest-to-goal?limit=3
export function useClosestToGoalCampaigns(limit = 3) {
  const { data, ...rest } = useFetch<Campaign[]>(`/campaigns/closest-to-goal?limit=${limit}`)
  return { campaigns: data ?? [], ...rest }
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