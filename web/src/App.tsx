import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import AppLayout  from './components/AppLayout'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import CampaignsPage from './pages/CampaignsPage'
import CampaignDetailsPage from './pages/CampaignDetailsPage'
import CreateCampaignPage, { EditCampaignPage } from './pages/CreateCampaignPage'
import DonatePage from './pages/DonatePage'
import MyCampaignsAndDonationsPage from './pages/MyCampaignsAndDonationsPage'
import ProfilePage from './pages/ProfilePage'
import HowItWorksPage from './pages/HowItWorksPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
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
            <Route path="/users/:id" element={<ProfilePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/create-campaign" element={<CreateCampaignPage />} />
              <Route path="/campaigns/:id/edit" element={<EditCampaignPage />} />
              <Route path="/campaigns/:id/donate" element={<DonatePage />} />
              <Route path="/my-donations" element={<MyCampaignsAndDonationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}