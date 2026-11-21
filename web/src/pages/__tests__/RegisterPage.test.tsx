import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import RegisterPage from '../RegisterPage'
import { ApiError } from '../../lib/api'

const signUp = vi.fn()
vi.mock('../../auth/AuthContext', () => ({ useAuth: () => ({ register: signUp }) }))

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/register']}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<p>Home</p>} />
      </Routes>
    </MemoryRouter>,
  )

// na instituição o campo de nome vira "Razão social"
async function fillPerson(nameLabel = 'Nome') {
  await userEvent.type(screen.getByLabelText(nameLabel), '  Maria Souza ')
  await userEvent.type(screen.getByLabelText('Telefone'), '47999990000')
  await userEvent.type(screen.getByLabelText('Cidade'), 'Joinville')
  await userEvent.type(screen.getByLabelText('UF'), 'sc')
  await userEvent.type(screen.getByLabelText('E-mail'), 'maria@email.com')
  await userEvent.type(screen.getByLabelText('Senha'), 'Senha@123')
}

const submit = () => userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))

describe('RegisterPage', () => {
  beforeEach(() => { signUp.mockReset() })

  it('campos vazios mostram os erros e não chamam a API', async () => {
    renderPage()

    await submit()

    expect(await screen.findByText('Informe o nome.')).toBeInTheDocument()
    expect(screen.getByText('Informe o e-mail.')).toBeInTheDocument()
    expect(screen.getByText('A senha deve ter pelo menos 8 caracteres.')).toBeInTheDocument()
    expect(signUp).not.toHaveBeenCalled()
  })

  it('senha sem maiúscula ou caractere especial é recusada', async () => {
    renderPage()
    await fillPerson()
    await userEvent.clear(screen.getByLabelText('Senha'))
    await userEvent.type(screen.getByLabelText('Senha'), 'senhafraca')

    await submit()

    expect(await screen.findByText('Inclua uma letra maiúscula e um caractere especial.')).toBeInTheDocument()
  })

  it('pessoa física: envia os dados formatados e vai para a home', async () => {
    signUp.mockResolvedValue(undefined)
    renderPage()
    await fillPerson()

    expect(screen.getByLabelText('Telefone')).toHaveValue('(47) 99999-0000') // máscara aplicada enquanto digita
    await submit()

    expect(signUp).toHaveBeenCalledWith({
      name: 'Maria Souza', phone: '(47) 99999-0000', city: 'Joinville', uf: 'SC', email: 'maria@email.com', password: 'Senha@123',
    })
    expect(await screen.findByText('Home')).toBeInTheDocument()
  })

  it('instituição: exige CNPJ com 14 dígitos', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('radio', { name: /instituição/i }))
    await fillPerson('Razão social')

    await userEvent.type(screen.getByLabelText('CNPJ'), '123')
    await submit()

    expect(await screen.findByText('Informe um CNPJ válido (14 dígitos).')).toBeInTheDocument()
    expect(signUp).not.toHaveBeenCalled()
  })

  it('instituição: envia CNPJ e endereço só com dígitos', async () => {
    signUp.mockResolvedValue(undefined)
    renderPage()
    await userEvent.click(screen.getByRole('radio', { name: /instituição/i }))
    expect(screen.getByLabelText('Razão social')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Razão social'), 'Abrigo Esperança')
    await userEvent.type(screen.getByLabelText('CNPJ'), '12345678000199')
    await userEvent.type(screen.getByLabelText('Telefone'), '47988881111')
    await userEvent.type(screen.getByLabelText('CEP'), '89201000')
    await userEvent.type(screen.getByLabelText('Rua'), 'Rua XV')
    await userEvent.type(screen.getByLabelText('Número'), '100')
    await userEvent.type(screen.getByLabelText('Cidade'), 'Joinville')
    await userEvent.type(screen.getByLabelText('UF'), 'SC')
    await userEvent.type(screen.getByLabelText('E-mail'), 'abrigo@email.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'Senha@123')
    await submit()

    expect(signUp).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Abrigo Esperança', cpfCnpj: '12345678000199', cep: '89201000', street: 'Rua XV', number: '100',
      neighborhood: undefined, complement: undefined,
    }))
  })

  it('erro de campo vindo da API aparece embaixo do campo certo', async () => {
    signUp.mockRejectedValue(new ApiError(400, 'Dados inválidos.', { email: 'Este e-mail já está cadastrado.' }))
    renderPage()
    await fillPerson()

    await submit()

    expect(await screen.findByText('Este e-mail já está cadastrado.')).toBeInTheDocument()
    expect(screen.queryByText('Dados inválidos.')).toBeNull()
  })

  it('erro geral da API aparece no fim do formulário', async () => {
    signUp.mockRejectedValue(new ApiError(409, 'Este e-mail já está cadastrado.'))
    renderPage()
    await fillPerson()

    await submit()

    expect(await screen.findByRole('alert')).toHaveTextContent('Este e-mail já está cadastrado.')
  })
})
