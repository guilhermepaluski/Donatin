import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import CreateCampaignPage from '../CreateCampaignPage'
import { api, ApiError } from '../../lib/api'
import { routeApi } from '../../test/apiMock'
import { makeCampaign } from '../../test/factories'

vi.mock('../../lib/api', async orig => ({ ...(await orig<typeof import('../../lib/api')>()), api: vi.fn() }))
const apiMock = vi.mocked(api)

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/create-campaign']}>
      <Routes>
        <Route path="/create-campaign" element={<CreateCampaignPage />} />
        <Route path="/campaigns/:id" element={<p>Página da campanha criada</p>} />
      </Routes>
    </MemoryRouter>,
  )

// data daqui a 30 dias no formato do <input type="date">
const futureDay = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('sv-SE')

async function fillAbout() {
  await userEvent.type(screen.getByLabelText('Título'), 'Ração para o abrigo')
  await userEvent.type(screen.getByLabelText('Descrição'), 'Precisamos de ração.')
  await userEvent.selectOptions(screen.getByLabelText('Categoria'), 'Animais')
  await userEvent.type(screen.getByLabelText('O que será arrecadado'), 'kg de ração')
  await userEvent.type(screen.getByLabelText('Meta (quantidade)'), '50')
  fireEvent.change(screen.getByLabelText('Data de encerramento'), { target: { value: futureDay() } })
}

const submit = () => userEvent.click(screen.getByRole('button', { name: 'Publicar campanha' }))

describe('CreateCampaignPage', () => {
  beforeEach(() => { apiMock.mockReset() })

  it('campos vazios mostram os erros e não chamam a API', async () => {
    renderPage()

    await submit()

    expect(await screen.findByText('Informe o título da campanha.')).toBeInTheDocument()
    expect(screen.getByText('Selecione uma categoria.')).toBeInTheDocument()
    expect(screen.getByText('Informe a data de encerramento.')).toBeInTheDocument()
    expect(apiMock).not.toHaveBeenCalled()
  })

  it('entrega (padrão) exige o endereço de entrega', async () => {
    renderPage()
    await fillAbout()

    await submit()

    expect(await screen.findByText('O CEP deve ter 8 dígitos.')).toBeInTheDocument()
    expect(screen.getByText('Informe a rua.')).toBeInTheDocument()
    expect(screen.getByText('O estado deve ter 2 letras (ex.: SC)')).toBeInTheDocument()
  })

  it('data no passado é recusada', async () => {
    renderPage()
    await fillAbout()
    fireEvent.change(screen.getByLabelText('Data de encerramento'), { target: { value: '2020-01-01' } })

    await submit()

    expect(await screen.findByText('A data deve ser hoje ou futura.')).toBeInTheDocument()
  })

  it('link de imagem inválido é recusado; válido mostra a prévia', async () => {
    renderPage()

    await userEvent.type(screen.getByLabelText('Link da imagem (opcional)'), 'https://site.com/capa.png')
    expect(screen.getByAltText('Prévia da capa')).toHaveAttribute('src', 'https://site.com/capa.png')

    await userEvent.clear(screen.getByLabelText('Link da imagem (opcional)'))
    await userEvent.type(screen.getByLabelText('Link da imagem (opcional)'), 'capa.png')
    await submit()

    expect(await screen.findByText('Use um link que comece com http:// ou https://')).toBeInTheDocument()
  })

  it('só coleta: não pede endereço, envia e abre a campanha criada', async () => {
    const create = vi.fn().mockReturnValue(makeCampaign({ id: 'nova' }))
    routeApi(apiMock, { 'POST /campaigns': create })
    renderPage()
    await fillAbout()

    await userEvent.click(screen.getByRole('radio', { name: /Você busca o item/ }))
    expect(screen.queryByText('Endereço de entrega')).toBeNull()
    await submit()

    const day = futureDay()
    expect(create).toHaveBeenCalledWith({
      title: 'Ração para o abrigo', description: 'Precisamos de ração.', category: 'Animais', product: 'kg de ração',
      goalAmount: 50, receiveOption: 'Coleta', conclusionDate: new Date(`${day}T23:59:59`).toISOString(), imageUrl: undefined,
    })
    expect(await screen.findByText('Página da campanha criada')).toBeInTheDocument()
  })

  it('entrega: envia o endereço com CEP só em dígitos', async () => {
    const create = vi.fn().mockReturnValue(makeCampaign({ id: 'nova' }))
    routeApi(apiMock, { 'POST /campaigns': create })
    renderPage()
    await fillAbout()

    await userEvent.type(screen.getByLabelText('CEP'), '89201000')
    expect(screen.getByLabelText('CEP')).toHaveValue('89201-000')
    await userEvent.type(screen.getByLabelText('Número'), '100')
    await userEvent.type(screen.getByLabelText('Rua'), 'Rua XV')
    await userEvent.type(screen.getByLabelText('Bairro'), 'Centro')
    await userEvent.type(screen.getByLabelText('Cidade'), 'Joinville')
    await userEvent.type(screen.getByLabelText('UF'), 'sc')
    await submit()

    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      receiveOption: 'Entrega', deliveryCep: '89201000', deliveryStreet: 'Rua XV', deliveryNumber: '100',
      deliveryNeighborhood: 'Centro', deliveryCity: 'Joinville', deliveryUf: 'SC', deliveryComplement: undefined,
    }))
  })

  it('erro de campo da API aparece no campo; erro geral aparece no fim', async () => {
    routeApi(apiMock, { 'POST /campaigns': new ApiError(400, 'Dados inválidos.', { title: 'Título já usado.' }) })
    renderPage()
    await fillAbout()
    await userEvent.click(screen.getByRole('radio', { name: /Você busca o item/ }))

    await submit()
    expect(await screen.findByText('Título já usado.')).toBeInTheDocument()

    routeApi(apiMock, { 'POST /campaigns': new ApiError(500, 'Servidor fora do ar.') })
    await submit()
    expect(await screen.findByText('Servidor fora do ar.')).toBeInTheDocument()
  })
})
