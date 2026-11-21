import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../LoginPage'
import { ApiError } from '../../lib/api'

// substitui o contexto de autenticação real por um falso
const login = vi.fn()
vi.mock('../../auth/AuthContext', () => ({ useAuth: () => ({ login }) }))

const renderPage = () => render(<MemoryRouter><LoginPage /></MemoryRouter>)

describe('LoginPage', () => {
  it('mostra erros de validação sem chamar a API', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByText('Insira o e-mail.')).toBeInTheDocument()
    expect(login).not.toHaveBeenCalled()
  })

  it('mostra a mensagem do backend quando o login falha', async () => {
    login.mockRejectedValueOnce(new ApiError(401, 'E-mail ou senha inválidos.'))
    renderPage()

    await userEvent.type(screen.getByLabelText(/e-mail/i), 'maria@email.com')
    await userEvent.type(screen.getByLabelText(/senha/i), '123456')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByText('E-mail ou senha inválidos.')).toBeInTheDocument()
    expect(login).toHaveBeenCalledWith({ email: 'maria@email.com', password: '123456' })
  })
})
