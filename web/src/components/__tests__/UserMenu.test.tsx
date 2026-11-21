import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { UserMenu } from '../UserMenu'
import { makeUser } from '../../test/factories'
import type { UserProfile } from '../../types'

const auth = vi.hoisted(() => ({ user: null as UserProfile | null, logout: vi.fn() }))
vi.mock('../../auth/AuthContext', () => ({ useAuth: () => auth }))

const renderMenu = () => render(<MemoryRouter><UserMenu /></MemoryRouter>)

describe('UserMenu', () => {
  it('não aparece para quem não está logado', () => {
    auth.user = null
    const { container } = renderMenu()

    expect(container).toBeEmptyDOMElement()
  })

  it('abre mostrando nome, e-mail e os atalhos da conta', async () => {
    auth.user = makeUser()
    renderMenu()

    await userEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }))

    expect(screen.getByRole('dialog')).toHaveTextContent('maria@email.com')
    expect(screen.getByRole('link', { name: /minhas campanhas/i })).toHaveAttribute('href', '/my-donations?tab=received')
    expect(screen.getByRole('link', { name: /conta/i })).toHaveAttribute('href', '/profile')
  })

  it('clicar num atalho fecha o menu', async () => {
    auth.user = makeUser()
    renderMenu()

    await userEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }))
    await userEvent.click(screen.getByRole('link', { name: /criar campanha/i }))

    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('"Sair" faz logout', async () => {
    auth.user = makeUser()
    renderMenu()

    await userEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }))
    await userEvent.click(screen.getByRole('button', { name: /sair/i }))

    expect(auth.logout).toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
