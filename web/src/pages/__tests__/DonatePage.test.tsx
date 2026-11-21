import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import DonatePage from '../DonatePage'
import { api, ApiError } from '../../lib/api'
import { routeApi, type Routes as ApiRoutes } from '../../test/apiMock'
import { makeCampaign, makeDonation, makeUser } from '../../test/factories'
import type { Campaign, UserProfile } from '../../types'

vi.mock('../../lib/api', async orig => ({ ...(await orig<typeof import('../../lib/api')>()), api: vi.fn() }))
const apiMock = vi.mocked(api)
const auth = vi.hoisted(() => ({ user: null as UserProfile | null }))
vi.mock('../../auth/AuthContext', () => ({ useAuth: () => auth }))

function renderPage(campaign: Campaign | ApiError, extra: ApiRoutes = {}) {
  routeApi(apiMock, { 'GET /campaigns/camp-1': campaign, ...extra })
  render(
    <MemoryRouter initialEntries={['/campaigns/camp-1/donate']}>
      <Routes>
        <Route path="/campaigns/:id/donate" element={<DonatePage />} />
        <Route path="/my-donations" element={<p>Minhas doações</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

// amanhã às 10h no formato do <input type="datetime-local">
const tomorrow = () => {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000)
  d.setHours(10, 0, 0, 0)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

async function fillBasics() {
  await userEvent.type(await screen.findByLabelText('Quantidade de agasalhos'), '3')
  fireEvent.change(screen.getByLabelText('Data e horário'), { target: { value: tomorrow() } })
}

const submit = () => userEvent.click(screen.getByRole('button', { name: 'Confirmar doação' }))

describe('DonatePage', () => {
  beforeEach(() => {
    apiMock.mockReset()
    auth.user = makeUser({ id: 'doador-1' })
  })

  it('campanha bloqueada (já atingiu a meta) não mostra o formulário', async () => {
    renderPage(makeCampaign({ isGoalReached: true }))

    expect(await screen.findByRole('status')).toHaveTextContent('Esta campanha já atingiu a meta.')
    expect(screen.queryByRole('button', { name: 'Confirmar doação' })).toBeNull()
  })

  it('erro ao carregar a campanha mostra "Tente novamente"', async () => {
    renderPage(new ApiError(500, 'Falha ao carregar.'))

    expect(await screen.findByRole('alert')).toHaveTextContent('Falha ao carregar.')
    expect(screen.getByRole('button', { name: 'Tente novamente' })).toBeInTheDocument()
  })

  it('mostra o resumo da campanha ao lado', async () => {
    renderPage(makeCampaign({ currentAmount: 4, goalAmount: 10 }))

    const resumo = await screen.findByRole('complementary', { name: 'Resumo da campanha' })
    expect(resumo).toHaveTextContent('Abrigo Esperança · Joinville/SC')
    expect(resumo).toHaveTextContent('4 de 10 agasalhos · 40%')
  })

  it('campos vazios mostram os erros', async () => {
    renderPage(makeCampaign())
    await screen.findByLabelText('Quantidade de agasalhos')

    await submit()

    expect(await screen.findByText('Informe a quantidade.')).toBeInTheDocument()
    expect(screen.getByText('Escolha a data e o horário.')).toBeInTheDocument()
  })

  it('data no passado é recusada', async () => {
    renderPage(makeCampaign())
    await userEvent.type(await screen.findByLabelText('Quantidade de agasalhos'), '3')
    fireEvent.change(screen.getByLabelText('Data e horário'), { target: { value: '2020-01-01T10:00' } })

    await submit()

    expect(await screen.findByText('Escolha uma data e horário futuros.')).toBeInTheDocument()
  })

  it('campanha só de entrega: envia a doação e vai para "Minhas doações"', async () => {
    const donate = vi.fn().mockReturnValue(makeDonation())
    renderPage(makeCampaign({ receiveOption: 'Entrega' }), { 'POST /donations': donate })
    await fillBasics()

    expect(screen.getByText(/Rua XV, 100 - Centro, Joinville\/SC/)).toBeInTheDocument() // local de entrega
    await submit()

    expect(donate).toHaveBeenCalledWith({
      campaignId: 'camp-1', quantity: 3, notes: '', donationMethod: 'Entrega', isAnonymous: false,
      scheduleDate: new Date(tomorrow()).toISOString(),
    })
    expect(await screen.findByText('Minhas doações')).toBeInTheDocument()
  })

  it('doação anônima na entrega', async () => {
    const donate = vi.fn().mockReturnValue(makeDonation())
    renderPage(makeCampaign({ receiveOption: 'Entrega' }), { 'POST /donations': donate })
    await fillBasics()

    await userEvent.click(screen.getByRole('radio', { name: /doar anonimamente/i }))
    await submit()

    expect(donate).toHaveBeenCalledWith(expect.objectContaining({ isAnonymous: true }))
  })

  it('coleta ou entrega: precisa escolher o método', async () => {
    renderPage(makeCampaign({ receiveOption: 'ColetaOuEntrega' }))
    await fillBasics()

    await submit()

    expect(await screen.findByText('Escolha como você vai doar.')).toBeInTheDocument()
  })

  it('coleta: exige endereço e não deixa doar anônimo', async () => {
    renderPage(makeCampaign({ receiveOption: 'ColetaOuEntrega' }))
    await fillBasics()

    await userEvent.click(screen.getByRole('radio', { name: /^Coleta/ }))
    expect(screen.getByRole('radio', { name: /doar anonimamente/i })).toBeDisabled()
    await submit()

    expect(await screen.findByText('O CEP deve ter 8 dígitos.')).toBeInTheDocument()
    expect(screen.getByText('Informe a rua.')).toBeInTheDocument()
  })

  it('coleta: envia o endereço de retirada', async () => {
    const donate = vi.fn().mockReturnValue(makeDonation())
    renderPage(makeCampaign({ receiveOption: 'Coleta', campaignDeliveryAddress: null }), { 'POST /donations': donate })
    await fillBasics()

    await userEvent.type(screen.getByLabelText('CEP'), '89201000')
    await userEvent.type(screen.getByLabelText('Número'), '10')
    await userEvent.type(screen.getByLabelText('Rua'), 'Rua A')
    await userEvent.type(screen.getByLabelText('Bairro'), 'Centro')
    await submit()

    expect(donate).toHaveBeenCalledWith(expect.objectContaining({
      donationMethod: 'Coleta', donorCep: '89201000', donorStreet: 'Rua A', donorNumber: '10', donorNeighborhood: 'Centro',
    }))
  })

  it('erro de campo da API aparece no campo; erro geral aparece no fim', async () => {
    renderPage(makeCampaign(), { 'POST /donations': new ApiError(400, 'Inválido.', { quantity: 'Quantidade muito alta.' }) })
    await fillBasics()

    await submit()
    expect(await screen.findByText('Quantidade muito alta.')).toBeInTheDocument()

    routeApi(apiMock, { 'GET /campaigns/camp-1': makeCampaign(), 'POST /donations': new ApiError(400, 'Esta campanha não está mais recebendo doações.') })
    await submit()
    expect(await screen.findByText('Esta campanha não está mais recebendo doações.')).toBeInTheDocument()
  })
})
