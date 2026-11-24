import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import CampaignDetailsPage from '../CampaignDetailsPage'
import { api, ApiError } from '../../lib/api'
import { routeApi, type Routes as ApiRoutes } from '../../test/apiMock'
import { makeCampaign, makeUser } from '../../test/factories'
import type { UserProfile } from '../../types'

vi.mock('../../lib/api', async orig => ({ ...(await orig<typeof import('../../lib/api')>()), api: vi.fn() }))
const apiMock = vi.mocked(api)
const auth = vi.hoisted(() => ({ user: null as UserProfile | null }))
vi.mock('../../auth/AuthContext', () => ({ useAuth: () => auth }))

function renderPage(routes: ApiRoutes) {
  routeApi(apiMock, routes)
  render(
    <MemoryRouter initialEntries={['/campaigns/camp-1']}>
      <Routes>
        <Route path="/campaigns/:id" element={<CampaignDetailsPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CampaignDetailsPage', () => {
  beforeEach(() => {
    apiMock.mockReset()
    auth.user = makeUser({ id: 'doador-1' })
  })

  it('mostra os dados da campanha', async () => {
    renderPage({ 'GET /campaigns/camp-1': makeCampaign({ currentAmount: 4, goalAmount: 10 }) })

    expect(await screen.findByRole('heading', { name: 'Agasalhos para o inverno' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Abrigo Esperança' })).toHaveAttribute('href', '/users/owner-1')
    expect(screen.getByText('40% da meta')).toBeInTheDocument()
    expect(screen.getByText('Rua XV, 100 - Centro, Joinville/SC')).toBeInTheDocument()
  })

  it('campanha aberta: botão leva para a página de doar', async () => {
    renderPage({ 'GET /campaigns/camp-1': makeCampaign() })

    expect(await screen.findByRole('link', { name: 'Doar para esta campanha' })).toHaveAttribute('href', '/campaigns/camp-1/donate')
  })

  // ---------- ações do dono (RF15 / RN13) ----------

  it('dono de campanha ativa: vê "Editar campanha" e "Encerrar campanha" no lugar do botão de doar', async () => {
    auth.user = makeUser({ id: 'owner-1' })
    renderPage({ 'GET /campaigns/camp-1': makeCampaign() })

    expect(await screen.findByRole('link', { name: 'Editar campanha' })).toHaveAttribute('href', '/campaigns/camp-1/edit')
    expect(screen.getByRole('button', { name: 'Encerrar campanha' })).toBeInTheDocument()
    expect(screen.queryByText('Doar para esta campanha')).toBeNull()
  })

  it('outro usuário não vê as ações do dono', async () => {
    renderPage({ 'GET /campaigns/camp-1': makeCampaign() })

    await screen.findByRole('link', { name: 'Doar para esta campanha' })
    expect(screen.queryByRole('link', { name: 'Editar campanha' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Encerrar campanha' })).toBeNull()
  })

  it('dono de campanha encerrada: não pode editar nem encerrar de novo', async () => {
    auth.user = makeUser({ id: 'owner-1' })
    renderPage({ 'GET /campaigns/camp-1': makeCampaign({ isActive: false }) })

    expect(await screen.findByText('Esta campanha foi encerrada.')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Editar campanha' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Encerrar campanha' })).toBeNull()
  })

  it('encerrar: pede confirmação, chama o DELETE e mostra a campanha encerrada', async () => {
    auth.user = makeUser({ id: 'owner-1' })
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    let closed = false
    const close = vi.fn(() => { closed = true })
    renderPage({
      'GET /campaigns/camp-1': () => makeCampaign({ isActive: !closed }),
      'DELETE /campaigns/camp-1': close,
    })

    await userEvent.click(await screen.findByRole('button', { name: 'Encerrar campanha' }))

    expect(confirm).toHaveBeenCalled()
    expect(close).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('Esta campanha foi encerrada.')).toBeInTheDocument()
    confirm.mockRestore()
  })

  it('encerrar: se cancelar a confirmação, não chama a API', async () => {
    auth.user = makeUser({ id: 'owner-1' })
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const close = vi.fn()
    renderPage({ 'GET /campaigns/camp-1': makeCampaign(), 'DELETE /campaigns/camp-1': close })

    await userEvent.click(await screen.findByRole('button', { name: 'Encerrar campanha' }))

    expect(close).not.toHaveBeenCalled()
    confirm.mockRestore()
  })

  it('erro ao encerrar aparece na tela', async () => {
    auth.user = makeUser({ id: 'owner-1' })
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderPage({ 'GET /campaigns/camp-1': makeCampaign(), 'DELETE /campaigns/camp-1': new ApiError(500, 'Servidor fora do ar.') })

    await userEvent.click(await screen.findByRole('button', { name: 'Encerrar campanha' }))

    expect(await screen.findByText('Servidor fora do ar.')).toBeInTheDocument()
    confirm.mockRestore()
  })

  it('campanha só com coleta não mostra local de entrega', async () => {
    renderPage({ 'GET /campaigns/camp-1': makeCampaign({ receiveOption: 'Coleta', campaignDeliveryAddress: null }) })

    await screen.findByRole('heading', { name: 'Agasalhos para o inverno' })
    expect(screen.queryByText('Local de entrega:')).toBeNull()
  })

  it('erro da API mostra a mensagem e permite tentar de novo', async () => {
    renderPage({ 'GET /campaigns/camp-1': new ApiError(404, 'Campanha não encontrada.') })

    expect(await screen.findByRole('alert')).toHaveTextContent('Campanha não encontrada.')

    routeApi(apiMock, { 'GET /campaigns/camp-1': makeCampaign() })
    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(await screen.findByRole('heading', { name: 'Agasalhos para o inverno' })).toBeInTheDocument()
  })
})
