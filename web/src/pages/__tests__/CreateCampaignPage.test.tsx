import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import CreateCampaignPage, { EditCampaignPage } from '../CreateCampaignPage'
import { api, ApiError } from '../../lib/api'
import { routeApi } from '../../test/apiMock'
import { makeCampaign, makeUser } from '../../test/factories'
import type { UserProfile } from '../../types'

vi.mock('../../lib/api', async orig => ({ ...(await orig<typeof import('../../lib/api')>()), api: vi.fn() }))
const apiMock = vi.mocked(api)
const auth = vi.hoisted(() => ({ user: null as UserProfile | null }))
vi.mock('../../auth/AuthContext', () => ({ useAuth: () => auth }))

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

  // ---------- imagem da capa: upload para o Azure Blob Storage (RNF19) ----------

  const capa = () => new File(['conteudo'], 'capa.png', { type: 'image/png' })
  const imageInput = () => screen.getByLabelText('Imagem da capa (opcional)')
  const uploadedUrl = 'https://donatinimagens.blob.core.windows.net/images/abc.png'

  it('escolher uma imagem envia o arquivo e mostra a prévia', async () => {
    const upload = vi.fn().mockReturnValue({ url: uploadedUrl })
    routeApi(apiMock, { 'POST /uploads/image': upload })
    renderPage()
    const file = capa()

    await userEvent.upload(imageInput(), file)

    const sent = upload.mock.calls[0][0] as FormData
    expect(sent).toBeInstanceOf(FormData)
    expect(sent.get('file')).toBe(file)
    expect(await screen.findByAltText('Prévia da capa')).toHaveAttribute('src', uploadedUrl)
  })

  it('a moldura é o botão de escolher a imagem (clicar nela abre o seletor de arquivos)', () => {
    renderPage()

    const frame = screen.getByText('Clique para escolher a imagem da capa (opcional)').closest('label')
    expect(frame).toHaveAttribute('for', imageInput().id)
  })

  it('ao publicar, envia a URL da imagem que foi salva', async () => {
    const create = vi.fn().mockReturnValue(makeCampaign({ id: 'nova' }))
    routeApi(apiMock, { 'POST /uploads/image': { url: uploadedUrl }, 'POST /campaigns': create })
    renderPage()
    await fillAbout()
    await userEvent.click(screen.getByRole('radio', { name: /Você busca o item/ }))

    await userEvent.upload(imageInput(), capa())
    await screen.findByAltText('Prévia da capa')
    await submit()

    expect(create).toHaveBeenCalledWith(expect.objectContaining({ imageUrl: uploadedUrl }))
  })

  it('erro no envio da imagem aparece na tela e não mostra prévia', async () => {
    routeApi(apiMock, { 'POST /uploads/image': new ApiError(400, 'Envie uma imagem JPG, PNG ou WEBP.') })
    renderPage()

    await userEvent.upload(imageInput(), capa())

    expect(await screen.findByText('Envie uma imagem JPG, PNG ou WEBP.')).toBeInTheDocument()
    expect(screen.queryByAltText('Prévia da capa')).toBeNull()
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

describe('EditCampaignPage (/campaigns/:id/edit)', () => {
  beforeEach(() => {
    apiMock.mockReset()
    auth.user = makeUser({ id: 'owner-1' })
  })

  const renderEdit = () =>
    render(
      <MemoryRouter initialEntries={['/campaigns/camp-1/edit']}>
        <Routes>
          <Route path="/campaigns/:id/edit" element={<EditCampaignPage />} />
          <Route path="/campaigns/:id" element={<p>Página da campanha</p>} />
        </Routes>
      </MemoryRouter>,
    )

  const existing = () => makeCampaign({
    title: 'Agasalhos para o inverno', description: 'Arrecadação de agasalhos', category: 'Roupas', product: 'agasalhos',
    goalAmount: 10, receiveOption: 'Entrega', imageUrl: 'https://donatinimagens.blob.core.windows.net/images/capa.png',
  })

  it('carrega os dados da campanha no formulário', async () => {
    routeApi(apiMock, { 'GET /campaigns/camp-1': existing() })
    renderEdit()

    expect(await screen.findByRole('heading', { name: 'Editar campanha' })).toBeInTheDocument()
    expect(screen.getByLabelText('Título')).toHaveValue('Agasalhos para o inverno')
    expect(screen.getByLabelText('Descrição')).toHaveValue('Arrecadação de agasalhos')
    expect(screen.getByLabelText('Categoria')).toHaveValue('Roupas')
    expect(screen.getByLabelText('O que será arrecadado')).toHaveValue('agasalhos')
    expect(screen.getByLabelText('Meta (quantidade)')).toHaveValue(10)
    expect(screen.getByLabelText('CEP')).toHaveValue('89201-000')
    expect(screen.getByLabelText('Rua')).toHaveValue('Rua XV')
    expect(screen.getByLabelText('UF')).toHaveValue('SC')
    expect(screen.getByAltText('Prévia da capa')).toHaveAttribute('src', 'https://donatinimagens.blob.core.windows.net/images/capa.png')
    expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeInTheDocument()
  })

  it('salvar envia o PUT com os dados alterados e volta para a campanha', async () => {
    const update = vi.fn().mockReturnValue(existing())
    routeApi(apiMock, { 'GET /campaigns/camp-1': existing(), 'PUT /campaigns/camp-1': update })
    renderEdit()

    const title = await screen.findByLabelText('Título')
    await waitFor(() => expect(title).toHaveValue('Agasalhos para o inverno'))
    await userEvent.clear(title)
    await userEvent.type(title, 'Cobertores para o inverno')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(update).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Cobertores para o inverno', goalAmount: 10, receiveOption: 'Entrega',
      deliveryCep: '89201000', deliveryStreet: 'Rua XV', deliveryUf: 'SC',
      imageUrl: 'https://donatinimagens.blob.core.windows.net/images/capa.png',
    }))
    expect(await screen.findByText('Página da campanha')).toBeInTheDocument()
  })

  it('quem não é o dono vê um aviso e não vê o formulário', async () => {
    auth.user = makeUser({ id: 'outra-pessoa' })
    routeApi(apiMock, { 'GET /campaigns/camp-1': existing() })
    renderEdit()

    expect(await screen.findByText('Só quem criou a campanha pode editá-la.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Salvar alterações' })).toBeNull()
  })

  it('campanha encerrada não pode ser editada', async () => {
    routeApi(apiMock, { 'GET /campaigns/camp-1': makeCampaign({ isActive: false }) })
    renderEdit()

    expect(await screen.findByText('Esta campanha foi encerrada e não pode mais ser editada.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Salvar alterações' })).toBeNull()
  })
})

