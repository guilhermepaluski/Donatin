import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import AppLayout  from './components/AppLayout'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import { GuestRoute, ProtectedRoute } from './components/ProtectedRoute'

// PROVISÓRIAS: serão trocadas nos próximos passos
const TempCampaigns = () => <h1 className="text-2xl font-bold text-dark">Campanhas (provisório)</h1>
const TempCampaign = () => <h1 className="text-2xl font-bold text-dark">Detalhe da campanha (provisório)</h1>
const TempDonations = () => <h1 className="text-2xl font-bold text-dark">Minhas doações (provisório)</h1>

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/campaigns" element={<TempCampaigns />} />
            <Route path="/campaign/:id" element={<TempCampaign />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/donations" element={<TempDonations />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}