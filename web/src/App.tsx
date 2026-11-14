import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import AppLayout  from './components/AppLayout'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import CampaignsPage from './pages/CampaignsPage'
import CampaignDetailsPage from './pages/CampaignDetailsPage'
import CreateCampaignPage from './pages/CreateCampaignPage'
import DonatePage from './pages/DonatePage'
import MyCampaignsAndDonationsPage from './pages/MyCampaignsAndDonationsPage'
import { GuestRoute, ProtectedRoute } from './components/ProtectedRoute'

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
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/campaigns/:id" element={<CampaignDetailsPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/create-campaign" element={<CreateCampaignPage />} />
              <Route path="/campaigns/:id/donate" element={<DonatePage />} />
              <Route path="/my-donations" element={<MyCampaignsAndDonationsPage />} />
              <Route path="/my-donations/:id" element={<MyCampaignsAndDonationsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}