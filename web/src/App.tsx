import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// PROVISÓRIO: só para testar o login. Será trocada pela HomePage.
function TempHome() {
  const { user, logout } = useAuth()
  return (
    <div className="p-8">
      <p className="text-xl">{user ? `Logado como ${user.name}` : 'Você não está logado'}</p>
      <button onClick={logout} className="mt-4 cursor-pointer underline">Sair</button>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<TempHome />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}