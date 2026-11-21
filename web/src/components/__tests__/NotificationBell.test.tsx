import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { NotificationBell } from '../NotificationBell'
import { api, ApiError } from '../../lib/api'
import { routeApi, type Routes as ApiRoutes } from '../../test/apiMock'
import { makeNotification } from '../../test/factories'

vi.mock('../../lib/api', async orig => ({ ...(await orig<typeof import('../../lib/api')>()), api: vi.fn() }))
const apiMock = vi.mocked(api)

function renderBell(routes: ApiRoutes) {
  routeApi(apiMock, routes)
  render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<NotificationBell />} />
        <Route path="/my-donations" element={<p>Página de doações</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('NotificationBell', () => {
  beforeEach(() => { apiMock.mockReset() })
  afterEach(() => { vi.useRealTimers() })

  it('mostra quantas notificações não foram lidas', async () => {
    renderBell({ 'GET /notifications/unread-count': 3 })

    expect(await screen.findByRole('button', { name: 'Notificações (3 não lidas)' })).toHaveTextContent('3')
  })

  it('mais de 9 aparece como "9+"', async () => {
    renderBell({ 'GET /notifications/unread-count': 12 })

    expect(await screen.findByText('9+')).toBeInTheDocument()
  })

  it('sem não lidas, não mostra o número', async () => {
    renderBell({ 'GET /notifications/unread-count': 0 })

    expect(await screen.findByRole('button', { name: 'Notificações' })).toBeInTheDocument()
  })

  it('ao abrir, lista as notificações', async () => {
    renderBell({
      'GET /notifications/unread-count': 1,
      'GET /notifications/mine': [makeNotification({ content: 'Nova doação recebida' }), makeNotification({ id: 'n2', read: true, content: 'Antiga' })],
    })

    await userEvent.click(await screen.findByRole('button', { name: /notificações/i }))

    expect(await screen.findByText('Nova doação recebida')).toBeInTheDocument()
    expect(screen.getByText('Antiga')).toBeInTheDocument()
    expect(screen.getAllByLabelText('Não lida')).toHaveLength(1)
  })

  it('lista vazia mostra a mensagem', async () => {
    renderBell({ 'GET /notifications/unread-count': 0, 'GET /notifications/mine': [] })

    await userEvent.click(await screen.findByRole('button', { name: 'Notificações' }))

    expect(await screen.findByText('Você não tem notificações.')).toBeInTheDocument()
  })

  it('erro ao carregar a lista mostra a mensagem', async () => {
    renderBell({ 'GET /notifications/unread-count': 0, 'GET /notifications/mine': new ApiError(500, 'Falha ao buscar.') })

    await userEvent.click(await screen.findByRole('button', { name: 'Notificações' }))

    expect(await screen.findByText('Falha ao buscar.')).toBeInTheDocument()
  })

  it('clicar numa não lida marca como lida e vai para as doações', async () => {
    const markRead = vi.fn()
    renderBell({
      'GET /notifications/unread-count': 1,
      'GET /notifications/mine': [makeNotification({ id: 'n1', content: 'Nova doação' })],
      'POST /notifications/n1/read': markRead,
    })

    await userEvent.click(await screen.findByRole('button', { name: /notificações/i }))
    await userEvent.click(await screen.findByText('Nova doação'))

    expect(markRead).toHaveBeenCalled()
    expect(await screen.findByText('Página de doações')).toBeInTheDocument()
  })

  it('clicar numa já lida não chama a API de novo', async () => {
    renderBell({
      'GET /notifications/unread-count': 0,
      'GET /notifications/mine': [makeNotification({ id: 'n1', read: true, content: 'Lida' })],
    })

    await userEvent.click(await screen.findByRole('button', { name: 'Notificações' }))
    await userEvent.click(await screen.findByText('Lida'))

    expect(apiMock).not.toHaveBeenCalledWith('/notifications/n1/read', expect.anything())
    expect(await screen.findByText('Página de doações')).toBeInTheDocument()
  })

  it('"Marcar todas como lidas" chama a API e recarrega', async () => {
    const readAll = vi.fn()
    renderBell({
      'GET /notifications/unread-count': 2,
      'GET /notifications/mine': [makeNotification()],
      'POST /notifications/read-all': readAll,
    })

    await userEvent.click(await screen.findByRole('button', { name: /notificações/i }))
    await userEvent.click(await screen.findByRole('button', { name: 'Marcar todas como lidas' }))

    expect(readAll).toHaveBeenCalled()
  })

  it('atualiza o contador a cada 30 segundos', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    renderBell({ 'GET /notifications/unread-count': 0 })
    await screen.findByRole('button', { name: 'Notificações' })
    const before = apiMock.mock.calls.length

    await act(async () => { vi.advanceTimersByTime(30_000) })

    expect(apiMock.mock.calls.length).toBe(before + 1)
  })
})
