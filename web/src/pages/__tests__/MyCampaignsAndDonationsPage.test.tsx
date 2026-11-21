import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import MyCampaignsAndDonationsPage from '../MyCampaignsAndDonationsPage'
import { api, ApiError } from '../../lib/api'
import { routeApi, type Routes as ApiRoutes } from '../../test/apiMock'
import { makeCampaign, makeDonation, makeSchedule, makeUser } from '../../test/factories'

vi.mock('../../lib/api', async orig => ({ ...(await orig<typeof import('../../lib/api')>()), api: vi.fn() }))
const apiMock = vi.mocked(api)
vi.mock('../../auth/AuthContext', () => ({ useAuth: () => ({ user: makeUser({ id: 'user-1' }) }) }))

function renderPage(routes: ApiRoutes, url = '/my-donations') {
  routeApi(apiMock, { 'GET /schedules/mine': [], ...routes })
  render(<MemoryRouter initialEntries={[url]}><MyCampaignsAndDonationsPage /></MemoryRouter>)
}

describe('MyCampaignsAndDonationsPage', () => {
  beforeEach(() => { apiMock.mockReset() })

  describe('aba "Realizadas" (o que eu doei)', () => {
    it('lista as minhas doações', async () => {
      renderPage({ 'GET /donations/mine': [makeDonation({ id: 'd1', campaignTitle: 'Ração' }), makeDonation({ id: 'd2', campaignTitle: 'Livros' })] })

      expect(await screen.findByText('Ração')).toBeInTheDocument()
      expect(screen.getByText('Livros')).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Realizadas' })).toHaveAttribute('aria-selected', 'true')
    })

    it('filtra por status', async () => {
      renderPage({ 'GET /donations/mine': [makeDonation({ id: 'd1', campaignTitle: 'Ração' }), makeDonation({ id: 'd2', campaignTitle: 'Livros', status: 'Concluida' })] })
      await screen.findByText('Ração')

      await userEvent.click(within(screen.getByRole('group', { name: 'Filtrar por status' })).getByRole('button', { name: 'Concluída' }))

      expect(screen.queryByText('Ração')).toBeNull()
      expect(screen.getByText('Livros')).toBeInTheDocument()
    })

    it('sem doações mostra o convite para ver campanhas', async () => {
      renderPage({ 'GET /donations/mine': [] })

      expect(await screen.findByText('Nenhuma doação encontrada.')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Ver campanhas' })).toHaveAttribute('href', '/campaigns')
    })

    it('cancelar chama a API e recarrega a lista', async () => {
      const cancel = vi.fn()
      renderPage({ 'GET /donations/mine': [makeDonation({ id: 'd1' })], 'POST /donations/d1/cancel': cancel })

      await userEvent.click(await screen.findByRole('button', { name: /cancelar doação/i }))

      expect(cancel).toHaveBeenCalled()
      await waitFor(() => expect(apiMock.mock.calls.filter(([p]) => p === '/donations/mine').length).toBeGreaterThan(1))
    })

    it('se a ação falhar, mostra a mensagem do backend', async () => {
      renderPage({ 'GET /donations/mine': [makeDonation({ id: 'd1' })], 'POST /donations/d1/cancel': new ApiError(400, 'Esta doação não pode mais ser cancelada.') })

      await userEvent.click(await screen.findByRole('button', { name: /cancelar doação/i }))

      expect(await screen.findByText('Esta doação não pode mais ser cancelada.')).toBeInTheDocument()
    })

    it('reagendar envia a doação e a nova data', async () => {
      const reschedule = vi.fn()
      renderPage({
        'GET /donations/mine': [makeDonation({ id: 'd1' })],
        'GET /schedules/mine': [makeSchedule({ id: 's1', donationId: 'd1' })],
        'POST /schedules': reschedule,
      })

      await userEvent.click(await screen.findByRole('button', { name: 'Reagendar' }))
      const input = screen.getByLabelText('Nova data e horário:')
      const when = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      const local = new Date(when.getTime() - when.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      await userEvent.type(input, local)
      await userEvent.click(screen.getByRole('button', { name: /confirmar reagendamento/i }))

      expect(reschedule).toHaveBeenCalledWith({ donationId: 'd1', scheduleDate: new Date(local).toISOString() })
    })

    it('erro ao carregar mostra "Tentar novamente"', async () => {
      renderPage({ 'GET /donations/mine': new ApiError(500, 'Falha ao carregar.') })

      expect(await screen.findByText('Falha ao carregar.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
    })

    it('erro só nos agendamentos aparece separado, sem esconder as doações', async () => {
      renderPage({ 'GET /donations/mine': [makeDonation({ campaignTitle: 'Ração' })], 'GET /schedules/mine': new ApiError(500, 'Agendamentos indisponíveis.') })

      expect(await screen.findByText(/Agendamentos indisponíveis\./)).toBeInTheDocument()
      expect(screen.getByText('Ração')).toBeInTheDocument()
    })
  })

  describe('aba "Recebidas" (minhas campanhas)', () => {
    it('sem campanhas, convida a criar uma', async () => {
      renderPage({ 'GET /campaigns/user/user-1': [] }, '/my-donations?tab=received')

      expect(await screen.findByText(/Você ainda não criou nenhuma campanha/)).toBeInTheDocument()
    })

    it('mostra as doações da primeira campanha e permite trocar', async () => {
      renderPage({
        'GET /campaigns/user/user-1': [makeCampaign({ id: 'c1', title: 'Ração' }), makeCampaign({ id: 'c2', title: 'Livros' })],
        'GET /donations/campaign/c1': [makeDonation({ id: 'd1', donorName: 'João' })],
        'GET /donations/campaign/c2': [],
      }, '/my-donations?tab=received')

      expect(await screen.findByRole('link', { name: 'João' })).toBeInTheDocument()

      await userEvent.selectOptions(screen.getByLabelText('Campanha'), 'c2')
      expect(await screen.findByText('Nenhuma doação recebida nesta campanha.')).toBeInTheDocument()
    })

    it('o dono confirma o recebimento', async () => {
      const confirm = vi.fn()
      renderPage({
        'GET /campaigns/user/user-1': [makeCampaign({ id: 'c1' })],
        'GET /donations/campaign/c1': [makeDonation({ id: 'd1' })],
        'POST /donations/d1/confirm': confirm,
      }, '/my-donations?tab=received')

      await userEvent.click(await screen.findByRole('button', { name: /confirmar recebimento/i }))

      expect(confirm).toHaveBeenCalled()
    })

    it('o dono pede reagendamento com justificativa', async () => {
      const refuse = vi.fn()
      renderPage({
        'GET /campaigns/user/user-1': [makeCampaign({ id: 'c1' })],
        'GET /donations/campaign/c1': [makeDonation({ id: 'd1' })],
        'GET /schedules/mine': [makeSchedule({ id: 's1', donationId: 'd1', viewerRole: 'Owner' })],
        'POST /schedules/s1/refuse': refuse,
      }, '/my-donations?tab=received')

      await userEvent.click(await screen.findByRole('button', { name: /solicitar reagendamento/i }))
      await userEvent.type(screen.getByLabelText('Justificativa:'), 'Vou viajar')
      await userEvent.click(screen.getByRole('button', { name: /enviar solicitação/i }))

      expect(refuse).toHaveBeenCalledWith({ reason: 'Vou viajar' })
    })
  })

  it('trocar de aba atualiza a URL e a lista', async () => {
    renderPage({ 'GET /donations/mine': [], 'GET /campaigns/user/user-1': [] })
    await screen.findByText('Nenhuma doação encontrada.')

    await userEvent.click(screen.getByRole('tab', { name: 'Recebidas' }))

    expect(await screen.findByText(/Você ainda não criou nenhuma campanha/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('tab', { name: 'Realizadas' }))
    expect(await screen.findByText('Nenhuma doação encontrada.')).toBeInTheDocument()
  })
})
