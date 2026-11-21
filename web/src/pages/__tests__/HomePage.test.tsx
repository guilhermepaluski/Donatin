import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from '../HomePage'
import { api } from '../../lib/api'
import { routeApi } from '../../test/apiMock'
import { makeCampaign, makeUser } from '../../test/factories'
import type { UserProfile } from '../../types'

vi.mock('../../lib/api', async orig => ({ ...(await orig<typeof import('../../lib/api')>()), api: vi.fn() }))
const apiMock = vi.mocked(api)
const auth = vi.hoisted(() => ({ user: null as UserProfile | null }))
vi.mock('../../auth/AuthContext', () => ({ useAuth: () => auth }))

const renderPage = () => render(<MemoryRouter><HomePage /></MemoryRouter>)

describe('HomePage', () => {
  beforeEach(() => {
    apiMock.mockReset()
    routeApi(apiMock, { 'GET /campaigns/closest-to-goal?limit=3': [makeCampaign({ title: 'Ração para o abrigo' })] })
  })

  it('deslogado: dá as boas-vindas genéricas', () => {
    auth.user = null
    renderPage()

    expect(screen.getByText(/Bem-vindo ao Donatin/)).toBeInTheDocument()
  })

  it('logado: cumprimenta pelo primeiro nome', () => {
    auth.user = makeUser({ name: 'Maria Souza' })
    renderPage()

    expect(screen.getByText(/Olá, Maria!/)).toBeInTheDocument()
  })

  it('mostra as campanhas em destaque (mais perto da meta)', async () => {
    renderPage()

    expect(await screen.findByText('Ração para o abrigo')).toBeInTheDocument()
  })

  it('cada categoria leva para a lista já filtrada', () => {
    renderPage()

    expect(screen.getByRole('link', { name: /Educação/ })).toHaveAttribute('href', '/campaigns?category=Educacao')
  })
})
