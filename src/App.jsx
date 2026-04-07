import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider }  from './context/ToastContext';
import { AuthProvider }   from './context/AuthContext';
import ProtectedRoute     from './components/ProtectedRoute';

import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OAuth2CallbackPage from './pages/OAuth2CallbackPage';
import DashboardPage      from './pages/DashboardPage';
import MeasurePage        from './pages/MeasurePage';
import HistoryPage        from './pages/HistoryPage';
import ProfilePage        from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public auth routes */}
            <Route path="/login"           element={<LoginPage />} />
            <Route path="/register"        element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />

            {/* Public app routes (accessible without login) */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/measure"   element={<MeasurePage />} />

            {/* Protected routes (login required) */}
            <Route path="/history"   element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/profile"   element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
