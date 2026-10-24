import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, tokenStorage } from '../lib/api'
import type { AuthResponse, LoginRequest, RegisterRequest, UserProfile } from '../types'

interface AuthContextValue {
  user: UserProfile | null
  loading: boolean // true enquanto confirma o token salvo
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(() => !!tokenStorage.get())

  // ao abrir o site: se há token salvo, busca o perfil para confirmar que ainda é válido
  useEffect(() => {
    if (!tokenStorage.get())
      return
    
    api<UserProfile>('/users/me')
      .then(setUser)
      .catch(() => tokenStorage.clear()) // token expirado/inválido
      .finally(() => setLoading(false))
  }, [])

  // saves the token in localStorage and loads the complete profile
  async function startSession(auth: AuthResponse) {
    tokenStorage.set(auth.token)
    try {
      setUser(await api<UserProfile>('/users/me')) // "the session exists"
    } catch (e) {
      tokenStorage.clear()
      throw e
    }
  }

  // LOGIN function
  async function login(data: LoginRequest) {
    await startSession(await api<AuthResponse>('/auth/login', { method: 'POST', body: data }))
  }

  // REGISTER function
  async function register(data: RegisterRequest) {
    await startSession(await api<AuthResponse>('/auth/register', { method: 'POST', body: data }))
  }

  // LOGOUT function
  function logout() {
    tokenStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// hook para usar em qualquer página: const { user, login } = useAuth()
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}