import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider, { useAuth } from './AuthProvider'
import { MetricsProvider } from './context/MetricsContext'

import Accounts from './pages/Accounts.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Homepage from './pages/Homepage.jsx'
import MetricsHistory from './pages/MetricsHistory.jsx'
import Servers from './pages/Servers.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AppShell from './layouts/AppShell.jsx'
// import Accounts from './pages/Accounts.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="text-white text-center mt-10">Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/LandingPage" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
      <Route path="/Homepage" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/operations" element={<Dashboard />} />
        <Route path="/history" element={<MetricsHistory />} />
        <Route path="/servers" element={<Servers />} />
        {/* <Route path="/alerts" element={<div className="text-white">Alerts Page</div>} /> */}
       <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
      </Route>

      <Route path="/" element={<Navigate to="/LandingPage" replace />} />
      <Route path="*" element={<Navigate to="/LandingPage" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <MetricsProvider>
          <AppRoutes />
        </MetricsProvider>
      </AuthProvider>
    </Router>
  )
}