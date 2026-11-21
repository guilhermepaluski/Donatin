import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProfilePage from '../ProfilePage'
import { api, ApiError } from '../../lib/api'
import { routeApi, type Routes as ApiRoutes } from '../../test/apiMock'
import { makeCampaign, makePublicProfile, makeUser } from '../../test/factories'
import type { UserProfile } from '../../types'

vi.mock('../../lib/api', async orig => ({ ...(await orig<typeof import('../../lib/api')>()), api: vi.fn() }))
const apiMock = vi.mocked(api)
const auth = vi.hoisted(() => ({ user: null as UserProfile | null, updateUser: vi.fn() }))
vi.mock('../../auth/AuthContext', () => ({ useAuth: () => auth }))

function renderAt(url: string, routes: ApiRoutes) {
  routeApi(apiMock, routes)
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users/:id" element={<ProfilePage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProfilePage', () => {
  beforeEach(() => {
    apiMock.mockReset()
    auth.updateUser.mockReset()
  })

  describe('meu perfil (/profile)', () => {
    beforeEach(() => { auth.user = makeUser({ aboutMe: 'Gosto de ajudar.' }) })

    it('mostra meus dados e minhas campanhas ativas e encerradas', async () => {
      renderAt('/profile', {
        'GET /campaigns/user/user-1': [makeCampaign({ id: 'a', title: 'Ativa' }), makeCampaign({ id: 'b', title: 'Antiga', isActive: false })],
      })

      expect(screen.getByRole('heading', { name: 'Maria Souza' })).toBeInTheDocument()
      expect(screen.getByText('maria@email.com')).toBeInTheDocument()
      expect(screen.getByText('Pessoa física')).toBeInTheDocument()
      expect(screen.getByText('Gosto de ajudar.')).toBeInTheDocument()
      expect(await screen.findByText('Ativa')).toBeInTheDocument()
      expect(screen.getByRole('region', { name: 'Campanhas encerradas' })).toHaveTextContent('Antiga')
    })

    it('sem campanhas ativas mostra a mensagem', async () => {
      renderAt('/profile', { 'GET /campaigns/user/user-1': [] })

      expect(await screen.findByText('Nenhuma campanha ativa no momento.')).toBeInTheDocument()
    })

    it('edita o perfil e mostra a confirmação', async () => {
      const save = vi.fn().mockReturnValue(makeUser({ name: 'Maria Silva' }))
      renderAt('/profile', { 'GET /campaigns/user/user-1': [], 'PUT /users/me': save })

      await userEvent.click(screen.getByRole('button', { name: /editar perfil/i }))
      await userEvent.clear(screen.getByLabelText('Nome'))
      await userEvent.type(screen.getByLabelText('Nome'), 'Maria Silva')
      await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

      expect(save).toHaveBeenCalledWith({
        name: 'Maria Silva', phone: '(47) 99999-0000', city: 'Joinville', uf: 'SC', aboutMe: 'Gosto de ajudar.', profilePhotoUrl: undefined,
      })
      expect(auth.updateUser).toHaveBeenCalledWith(expect.objectContaining({ name: 'Maria Silva' }))
      expect(await screen.findByText('Perfil atualizado com sucesso.')).toBeInTheDocument()
    })

    it('valida antes de enviar', async () => {
      renderAt('/profile', { 'GET /campaigns/user/user-1': [] })

      await userEvent.click(screen.getByRole('button', { name: /editar perfil/i }))
      await userEvent.clear(screen.getByLabelText('Nome'))
      await userEvent.type(screen.getByLabelText('Foto de perfil (link)'), 'foto.png')
      await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

      expect(await screen.findByText('Informe o nome.')).toBeInTheDocument()
      expect(screen.getByText('Use um link que comece com http:// ou https://')).toBeInTheDocument()
      expect(apiMock).not.toHaveBeenCalledWith('/users/me', expect.anything())
    })

    it('erro da API aparece no formulário', async () => {
      renderAt('/profile', { 'GET /campaigns/user/user-1': [], 'PUT /users/me': new ApiError(400, 'Inválido.', { phone: 'Telefone inválido.' }) })

      await userEvent.click(screen.getByRole('button', { name: /editar perfil/i }))
      await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

      expect(await screen.findByText('Telefone inválido.')).toBeInTheDocument()
    })

    it('"Cancelar" volta para a visualização sem salvar', async () => {
      renderAt('/profile', { 'GET /campaigns/user/user-1': [] })

      await userEvent.click(screen.getByRole('button', { name: /editar perfil/i }))
      await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

      expect(screen.getByRole('button', { name: /editar perfil/i })).toBeInTheDocument()
    })

    it('instituição: edita também o endereço (só dígitos no CEP)', async () => {
      auth.user = makeUser({ cpfCnpj: '12345678000199', cep: '89201000', street: 'Rua XV', number: '100', neighborhood: 'Centro' })
      const save = vi.fn().mockReturnValue(auth.user)
      renderAt('/profile', { 'GET /campaigns/user/user-1': [], 'PUT /users/me': save })

      expect(screen.getByText('Instituição')).toBeInTheDocument()
      expect(screen.getByText('Rua XV, 100 - Centro - 89201-000')).toBeInTheDocument()

      await userEvent.click(screen.getByRole('button', { name: /editar perfil/i }))
      expect(screen.getByLabelText('CEP')).toHaveValue('89201-000')
      await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

      expect(save).toHaveBeenCalledWith(expect.objectContaining({ cep: '89201000', street: 'Rua XV', number: '100', neighborhood: 'Centro' }))
    })
  })

  describe('perfil público (/users/:id)', () => {
    beforeEach(() => { auth.user = null })

    it('instituição: mostra contato, CNPJ formatado e o botão "Ligar" (RF23)', async () => {
      renderAt('/users/owner-1', { 'GET /users/owner-1/public': makePublicProfile(), 'GET /campaigns/user/owner-1': [] })

      expect(await screen.findByRole('heading', { name: 'Abrigo Esperança' })).toBeInTheDocument()
      expect(screen.getByText('12.345.678/0001-99')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /ligar/i })).toHaveAttribute('href', 'tel:47988881111')
      expect(screen.queryByRole('button', { name: /editar perfil/i })).toBeNull()
    })

    it('pessoa física sem descrição mostra "Sem descrição."', async () => {
      renderAt('/users/p1', {
        'GET /users/p1/public': makePublicProfile({ id: 'p1', name: 'João', isInstitution: false, cpfCnpj: null, phone: null, address: null, aboutMe: null }),
        'GET /campaigns/user/p1': [],
      })

      expect(await screen.findByText('Sem descrição.')).toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /ligar/i })).toBeNull()
    })

    it('usuário inexistente mostra o erro', async () => {
      renderAt('/users/x', { 'GET /users/x/public': new ApiError(404, 'Usuário não encontrado.'), 'GET /campaigns/user/x': [] })

      expect(await screen.findByRole('alert')).toHaveTextContent('Usuário não encontrado.')
    })

    it('erro nas campanhas aparece na seção', async () => {
      renderAt('/users/owner-1', { 'GET /users/owner-1/public': makePublicProfile(), 'GET /campaigns/user/owner-1': new ApiError(500, 'Falha nas campanhas.') })

      expect(await screen.findByText('Falha nas campanhas.')).toBeInTheDocument()
    })
  })
})
