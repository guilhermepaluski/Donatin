import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'
import { api } from '../lib/api'
import { routeApi } from '../test/apiMock'

vi.mock('../lib/api', async orig => ({ ...(await orig<typeof import('../lib/api')>()), api: vi.fn() }))
const apiMock = vi.mocked(api)

// teste de "fumaça": o app inteiro sobe e cada rota leva à página certa
describe('App (rotas)', () => {
  beforeEach(() => {
    apiMock.mockReset()
    routeApi(apiMock, { 'GET /campaigns/closest-to-goal?limit=3': [], 'GET /campaigns': [] })
  })

  it('"/" abre a home', async () => {
    window.history.pushState({}, '', '/')
    render(<App />)

    expect(await screen.findByText(/Pequenos gestos/)).toBeInTheDocument()
  })

  it('rota protegida sem login manda para o login', async () => {
    window.history.pushState({}, '', '/my-donations')
    render(<App />)

    expect(await screen.findByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('rota desconhecida volta para a home', async () => {
    window.history.pushState({}, '', '/nao-existe')
    render(<App />)

    expect(await screen.findByText(/Pequenos gestos/)).toBeInTheDocument()
  })
})
