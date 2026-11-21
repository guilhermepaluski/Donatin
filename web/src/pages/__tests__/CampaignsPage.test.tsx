import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import CampaignsPage from '../CampaignsPage'
import { api, ApiError } from '../../lib/api'
import { makeCampaign } from '../../test/factories'

vi.mock('../../lib/api', async orig => ({ ...(await orig<typeof import('../../lib/api')>()), api: vi.fn() }))
const apiMock = vi.mocked(api)

const renderPage = (url = '/campaigns') => render(<MemoryRouter initialEntries={[url]}><CampaignsPage /></MemoryRouter>)

describe('CampaignsPage', () => {
  beforeEach(() => {
    apiMock.mockReset()
    apiMock.mockResolvedValue([makeCampaign({ id: 'a' }), makeCampaign({ id: 'b' })])
  })

  it('mostra quantas campanhas encontrou', async () => {
    renderPage()

    expect(await screen.findByText('2 campanhas encontradas')).toBeInTheDocument()
  })

  it('usa o singular quando há só uma', async () => {
    apiMock.mockResolvedValue([makeCampaign()])
    renderPage()

    expect(await screen.findByText('1 campanha encontrada')).toBeInTheDocument()
  })

  it('lê o filtro de categoria da URL', async () => {
    renderPage('/campaigns?category=Roupas')

    await waitFor(() => expect(apiMock).toHaveBeenCalledWith('/campaigns?category=Roupas'))
    expect(screen.getByRole('button', { name: 'Roupas' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('clicar numa categoria filtra e "Todas" limpa o filtro', async () => {
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: 'Higiene' }))
    await waitFor(() => expect(apiMock).toHaveBeenLastCalledWith('/campaigns?category=Higiene'))

    await userEvent.click(screen.getByRole('button', { name: 'Todas' }))
    await waitFor(() => expect(apiMock).toHaveBeenLastCalledWith('/campaigns'))
  })

  it('a busca por texto só chama a API depois que a pessoa para de digitar', async () => {
    renderPage()
    await screen.findByText('2 campanhas encontradas')
    apiMock.mockClear()

    await userEvent.type(screen.getByLabelText('Buscar campanhas'), 'casaco')

    await waitFor(() => expect(apiMock).toHaveBeenCalledWith('/campaigns?keyword=casaco'))
    expect(apiMock).not.toHaveBeenCalledWith('/campaigns?keyword=c') // não fez uma busca por letra
  })

  it('erro da API aparece com "Tentar novamente"', async () => {
    apiMock.mockRejectedValue(new ApiError(500, 'Servidor indisponível.'))
    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent('Servidor indisponível.')
  })
})
