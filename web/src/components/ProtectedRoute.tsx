import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function Loading() {
  return <div className="grid min-h-screen place-items-center text-neutral-500">Carregando...</div>
}

// só deixa passar quem está logado; senão manda para o login
export function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

// login e cadastro: quem já está logado vai direto para a home
export function GuestRoute() {
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  return user ? <Navigate to="/" replace /> : <Outlet />
}