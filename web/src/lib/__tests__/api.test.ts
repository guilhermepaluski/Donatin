import { afterEach, describe, expect, it, vi } from 'vitest'
import { api, ApiError, tokenStorage } from '../api'

const mockFetch = (status: number, body?: unknown) =>
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: () => (body === undefined ? Promise.reject(new Error('sem corpo')) : Promise.resolve(body)),
  }))

afterEach(() => vi.unstubAllGlobals())

describe('api', () => {
  it('retorna o JSON quando a resposta é OK', async () => {
    mockFetch(200, { id: '1' })
    await expect(api('/campaigns/1')).resolves.toEqual({ id: '1' })
  })

  it('envia o token salvo no header Authorization', async () => {
    tokenStorage.set('meu-token')
    mockFetch(200, {})
    await api('/users/me')
    const [, init] = vi.mocked(fetch).mock.calls[0]
    expect((init!.headers as Record<string, string>).Authorization).toBe('Bearer meu-token')
  })

  it('envia o body como JSON', async () => {
    mockFetch(201, {})
    await api('/donations', { method: 'POST', body: { quantity: 2 } })
    const [, init] = vi.mocked(fetch).mock.calls[0]
    expect(init!.body).toBe('{"quantity":2}')
    expect((init!.headers as Record<string, string>)['Content-Type']).toBe('application/json')
  })

  it('retorna undefined em 204', async () => {
    mockFetch(204)
    await expect(api('/x', { method: 'POST' })).resolves.toBeUndefined()
  })

  it('lança ApiError com a mensagem do backend', async () => {
    mockFetch(400, { message: 'Campanha encerrada.' })
    await expect(api('/donations')).rejects.toMatchObject({ status: 400, message: 'Campanha encerrada.' })
  })

  it('converte erros de validação por campo (ProblemDetails)', async () => {
    mockFetch(400, { errors: { Phone: ['Telefone inválido.'] } })
    const err = await api('/auth/register').catch(e => e) as ApiError
    expect(err.fields).toEqual({ phone: 'Telefone inválido.' })
    expect(err.message).toBe('Telefone inválido.')
  })

  it('lança ApiError com status 0 quando o servidor está fora', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(api('/campaigns')).rejects.toMatchObject({ status: 0 })
  })
})
