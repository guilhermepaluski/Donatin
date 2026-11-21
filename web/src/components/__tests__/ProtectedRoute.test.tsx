import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { GuestRoute, ProtectedRoute } from '../ProtectedRoute'
import { makeUser } from '../../test/factories'
import type { UserProfile } from '../../types'

const auth = vi.hoisted(() => ({ user: null as UserProfile | null, loading: false }))
vi.mock('../../auth/AuthContext', () => ({ useAuth: () => auth }))

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<p>Home</p>} />
        <Route path="/login" element={<p>Tela de login</p>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/privada" element={<p>Área logada</p>} />
        </Route>
        <Route element={<GuestRoute />}>
          <Route path="/entrar" element={<p>Formulário de entrada</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  it('mostra "Carregando" enquanto confere o token', () => {
    Object.assign(auth, { user: null, loading: true })
    renderAt('/privada')

    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('manda quem não está logado para o login', () => {
    Object.assign(auth, { user: null, loading: false })
    renderAt('/privada')

    expect(screen.getByText('Tela de login')).toBeInTheDocument()
  })

  it('deixa quem está logado entrar', () => {
    Object.assign(auth, { user: makeUser(), loading: false })
    renderAt('/privada')

    expect(screen.getByText('Área logada')).toBeInTheDocument()
  })
})

describe('GuestRoute', () => {
  it('mostra "Carregando" enquanto confere o token', () => {
    Object.assign(auth, { user: null, loading: true })
    renderAt('/entrar')

    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('quem já está logado vai para a home', () => {
    Object.assign(auth, { user: makeUser(), loading: false })
    renderAt('/entrar')

    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('quem não está logado vê o formulário', () => {
    Object.assign(auth, { user: null, loading: false })
    renderAt('/entrar')

    expect(screen.getByText('Formulário de entrada')).toBeInTheDocument()
  })
})
