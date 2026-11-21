import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useFetch } from '../useFetch'
import { api, ApiError } from '../api'

vi.mock('../api', async orig => ({ ...(await orig<typeof import('../api')>()), api: vi.fn() }))
const apiMock = vi.mocked(api)

describe('useFetch', () => {
  beforeEach(() => { apiMock.mockReset() })

  it('não busca nada quando o path é null', () => {
    const { result } = renderHook(() => useFetch(null))

    expect(result.current).toMatchObject({ data: null, loading: false, error: null })
    expect(apiMock).not.toHaveBeenCalled()
  })

  it('começa carregando e depois entrega os dados', async () => {
    apiMock.mockResolvedValue([1, 2])
    const { result } = renderHook(() => useFetch<number[]>('/numeros'))

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.data).toEqual([1, 2]))
    expect(result.current.loading).toBe(false)
    expect(apiMock).toHaveBeenCalledWith('/numeros')
  })

  it('mostra a mensagem do backend quando a API devolve erro', async () => {
    apiMock.mockRejectedValue(new ApiError(500, 'Servidor fora do ar.'))
    const { result } = renderHook(() => useFetch('/x'))

    await waitFor(() => expect(result.current.error).toBe('Servidor fora do ar.'))
  })

  it('usa uma mensagem genérica para erros que não vieram da API', async () => {
    apiMock.mockRejectedValue(new Error('boom'))
    const { result } = renderHook(() => useFetch('/x'))

    await waitFor(() => expect(result.current.error).toBe('Não foi possível carregar.'))
  })

  it('reload busca de novo e mantém os dados antigos enquanto carrega', async () => {
    apiMock.mockResolvedValueOnce('primeiro')
    const { result } = renderHook(() => useFetch<string>('/x'))
    await waitFor(() => expect(result.current.data).toBe('primeiro'))

    let resolve!: (v: string) => void
    apiMock.mockReturnValueOnce(new Promise(r => { resolve = r }))
    act(() => result.current.reload())

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe('primeiro') // não "pisca" vazio durante o reload

    await act(async () => resolve('segundo'))
    expect(result.current.data).toBe('segundo')
    expect(apiMock).toHaveBeenCalledTimes(2)
  })

  it('ignora a resposta antiga quando o path muda antes dela chegar', async () => {
    let resolveOld!: (v: string) => void
    apiMock.mockReturnValueOnce(new Promise(r => { resolveOld = r }))
    apiMock.mockResolvedValueOnce('novo')

    const { result, rerender } = renderHook(({ path }) => useFetch<string>(path), { initialProps: { path: '/a' } })
    rerender({ path: '/b' })
    await waitFor(() => expect(result.current.data).toBe('novo'))

    await act(async () => resolveOld('velho'))
    expect(result.current.data).toBe('novo')
  })
})
