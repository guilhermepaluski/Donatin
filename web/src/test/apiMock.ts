import type { Mock } from 'vitest'
import { ApiError } from '../lib/api'

// Respostas falsas da API por "MÉTODO /rota". Ex.: { 'GET /campaigns/camp-1': campanha }
// - um valor qualquer: a API responde com ele
// - um ApiError: a API responde com erro
// - uma função: recebe o body e devolve a resposta (ou lança um erro)
type Reply = unknown | ApiError | ((body: unknown) => unknown)
export type Routes = Record<string, Reply>

// Liga o `api` mockado (vi.mock('../lib/api')) às rotas falsas.
// Rotas não cadastradas respondem 404, para o teste falhar de um jeito claro.
export function routeApi(apiMock: Mock, routes: Routes) {
  apiMock.mockImplementation(async (path: string, opts: { method?: string; body?: unknown } = {}) => {
    const key = `${opts.method ?? 'GET'} ${path}`
    if (!(key in routes))
      throw new ApiError(404, `Rota não mockada: ${key}`)

    const reply = routes[key]
    if (reply instanceof ApiError)
      throw reply
    return typeof reply === 'function' ? (reply as (b: unknown) => unknown)(opts.body) : reply
  })
}
