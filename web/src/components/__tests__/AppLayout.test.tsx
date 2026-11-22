import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AppLayout from '../AppLayout'
import { makeUser } from '../../test/factories'
import type { UserProfile } from '../../types'

// o layout só decide o que mostrar; o sininho e o menu têm os próprios testes
const auth = vi.hoisted(() => ({ user: null as UserProfile | null, loading: false }))
vi.mock('../../auth/AuthContext', () => ({ useAuth: () => auth }))
vi.mock('../NotificationBell', () => ({ NotificationBell: () => <p>sininho</p> }))
vi.mock('../UserMenu', () => ({ UserMenu: () => <p>menu do usuário</p> }))

const renderLayout = () =>
  render(
    <MemoryRouter initialEntries={['/campaigns']}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/campaigns" element={<p>conteúdo da página</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

describe('AppLayout', () => {
  it('mostra o conteúdo da página dentro do layout', () => {
    renderLayout()

    expect(screen.getByText('conteúdo da página')).toBeInTheDocument()
  })

  it('marca o link da página atual no menu', () => {
    renderLayout()

    expect(screen.getByRole('link', { name: 'Campanhas' })).toHaveClass('bg-primary')
    expect(screen.getByRole('link', { name: 'Início' })).not.toHaveClass('bg-primary')
  })

  it('deslogado: mostra "Entrar" e "Cadastre-se"', () => {
    Object.assign(auth, { user: null, loading: false })
    renderLayout()

    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: 'Cadastre-se' })).toHaveAttribute('href', '/register')
    expect(screen.queryByText('sininho')).toBeNull()
  })

  it('logado: mostra o sininho e o menu do usuário', () => {
    Object.assign(auth, { user: makeUser(), loading: false })
    renderLayout()

    expect(screen.getByText('sininho')).toBeInTheDocument()
    expect(screen.getByText('menu do usuário')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Entrar' })).toBeNull()
  })

  it('enquanto confere o token, não mostra nem "Entrar" nem o menu (evita piscar)', () => {
    Object.assign(auth, { user: null, loading: true })
    renderLayout()

    expect(screen.queryByRole('link', { name: 'Entrar' })).toBeNull()
    expect(screen.queryByText('menu do usuário')).toBeNull()
  })

  it('rodapé: todos os links levam para rotas que existem', () => {
    renderLayout()

    const footer = within(screen.getByRole('contentinfo'))
    expect(footer.getByRole('link', { name: 'Explorar campanhas' })).toHaveAttribute('href', '/campaigns')
    expect(footer.getByRole('link', { name: 'Como funciona?' })).toHaveAttribute('href', '/how-it-works')
    expect(footer.getByRole('link', { name: 'Quero doar' })).toHaveAttribute('href', '/campaigns')
    expect(footer.getByRole('link', { name: 'Criar uma campanha' })).toHaveAttribute('href', '/create-campaign')
    expect(footer.getByRole('link', { name: 'Política de Privacidade' })).toHaveAttribute('href', '/privacy')
    expect(footer.getByRole('link', { name: 'Termos de Uso' })).toHaveAttribute('href', '/terms')
  })

  it('rodapé: não tem link de "Instituições" (lista de instituições fica para depois)', () => {
    renderLayout()

    expect(within(screen.getByRole('contentinfo')).queryByRole('link', { name: 'Instituições' })).toBeNull()
  })
})
