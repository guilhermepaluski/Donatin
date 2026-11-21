import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useCampaignDetails, useCampaigns, useClosestToGoalCampaigns, useDebounced } from '../useCampaigns'
import { api } from '../api'

vi.mock('../api', async orig => ({ ...(await orig<typeof import('../api')>()), api: vi.fn() }))
const apiMock = vi.mocked(api)

describe('useCampaigns e amigos', () => {
  beforeEach(() => {
    apiMock.mockReset()
    apiMock.mockResolvedValue([])
  })

  it.each([
    ['', '', '/campaigns'],
    ['Roupas', '', '/campaigns?category=Roupas'],
    ['', 'casaco azul', '/campaigns?keyword=casaco+azul'],
    ['Roupas', 'casaco', '/campaigns?category=Roupas&keyword=casaco'],
  ])('categoria "%s" + busca "%s" chama %s', (category, keyword, url) => {
    renderHook(() => useCampaigns(category, keyword))

    expect(apiMock).toHaveBeenCalledWith(url)
  })

  it('useCampaigns devolve lista vazia enquanto não há dados', () => {
    const { result } = renderHook(() => useCampaigns('', ''))

    expect(result.current.campaigns).toEqual([])
  })

  it('useCampaignDetails busca a campanha pelo id', () => {
    renderHook(() => useCampaignDetails('camp-1'))

    expect(apiMock).toHaveBeenCalledWith('/campaigns/camp-1')
  })

  it('useClosestToGoalCampaigns pede o limite informado', () => {
    renderHook(() => useClosestToGoalCampaigns(5))

    expect(apiMock).toHaveBeenCalledWith('/campaigns/closest-to-goal?limit=5')
  })
})

describe('useDebounced', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('só entrega o valor novo depois que a pessoa para de digitar', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounced(v, 300), { initialProps: { v: 'a' } })

    rerender({ v: 'ab' })
    act(() => vi.advanceTimersByTime(200))
    rerender({ v: 'abc' }) // digitou de novo antes dos 300ms: reinicia a contagem
    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('a')

    act(() => vi.advanceTimersByTime(100))
    expect(result.current).toBe('abc')
  })
})
