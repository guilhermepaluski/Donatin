import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, renderHook, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from '../AuthContext'
import { api, ApiError, tokenStorage } from '../../lib/api'
import { routeApi } from '../../test/apiMock'
import { makeUser } from '../../test/factories'

vi.mock('../../lib/api', async orig => ({ ...(await orig<typeof import('../../lib/api')>()), api: vi.fn() }))
const apiMock = vi.mocked(api)

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>
const authResponse = { token: 'jwt-novo', userId: 'user-1', name: 'Maria', email: 'maria@email.com' }

describe('AuthContext', () => {
  beforeEach(() => { apiMock.mockReset() })

  it('sem token salvo: começa deslogado e não chama a API', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(apiMock).not.toHaveBeenCalled()
  })

  it('com token salvo válido: carrega o perfil', async () => {
    tokenStorage.set('jwt-salvo')
    routeApi(apiMock, { 'GET /users/me': makeUser() })

    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user?.name).toBe('Maria Souza')
  })

  it('com token salvo expirado: apaga o token e fica deslogado', async () => {
    tokenStorage.set('jwt-vencido')
    routeApi(apiMock, { 'GET /users/me': new ApiError(401, 'Não autorizado') })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toBeNull()
    expect(tokenStorage.get()).toBeNull()
  })

  it('login salva o token e carrega o perfil', async () => {
    const login = vi.fn().mockReturnValue(authResponse)
    routeApi(apiMock, { 'POST /auth/login': login, 'GET /users/me': makeUser() })
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(() => result.current.login({ email: 'maria@email.com', password: 'Senha@123' }))

    expect(login).toHaveBeenCalledWith({ email: 'maria@email.com', password: 'Senha@123' })
    expect(tokenStorage.get()).toBe('jwt-novo')
    expect(result.current.user?.email).toBe('maria@email.com')
  })

  it('register também abre a sessão', async () => {
    routeApi(apiMock, { 'POST /auth/register': authResponse, 'GET /users/me': makeUser() })
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(() => result.current.register({ name: 'Maria', phone: '(47) 99999-0000', city: 'Joinville', uf: 'SC', email: 'maria@email.com', password: 'Senha@123' }))

    expect(result.current.user).not.toBeNull()
  })

  it('se o perfil falhar logo após o login, não deixa token pendurado', async () => {
    routeApi(apiMock, { 'POST /auth/login': authResponse, 'GET /users/me': new ApiError(500, 'Erro') })
    const { result } = renderHook(() => useAuth(), { wrapper })

    await expect(result.current.login({ email: 'a@a.com', password: 'x' })).rejects.toThrow('Erro')
    expect(tokenStorage.get()).toBeNull()
  })

  it('logout apaga o token e o usuário', async () => {
    tokenStorage.set('jwt-salvo')
    routeApi(apiMock, { 'GET /users/me': makeUser() })
    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.user).not.toBeNull())

    act(() => result.current.logout())

    expect(result.current.user).toBeNull()
    expect(tokenStorage.get()).toBeNull()
  })

  it('updateUser troca os dados do usuário logado', async () => {
    tokenStorage.set('jwt-salvo')
    routeApi(apiMock, { 'GET /users/me': makeUser() })
    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.user).not.toBeNull())

    act(() => result.current.updateUser(makeUser({ name: 'Maria Silva' })))

    expect(result.current.user?.name).toBe('Maria Silva')
  })

  it('useAuth fora do AuthProvider avisa o erro', () => {
    const Broken = () => { useAuth(); return null }
    vi.spyOn(console, 'error').mockImplementation(() => {}) // o React loga o erro; aqui é esperado

    expect(() => render(<Broken />)).toThrow('useAuth deve ser usado dentro de <AuthProvider>')
    expect(screen.queryByText(/./)).toBeNull()
  })
})
