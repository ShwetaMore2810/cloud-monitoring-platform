import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './AuthProvider';
import { MetricsProvider } from './context/MetricsContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import LandingPage from "./pages/LandingPage";
import MetricsHistory from './pages/MetricsHistory';
import Servers from './pages/Servers.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/LandingPage" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
      <Route path="/Homepage" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><MetricsHistory /></ProtectedRoute>} />
      <Route path="/servers" element={<ProtectedRoute><Servers /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/LandingPage" replace />} />
    </Routes>
  );
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
  );
}
