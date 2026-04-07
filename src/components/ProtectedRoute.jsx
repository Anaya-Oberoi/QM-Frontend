import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getToken } from '../api/client';

export default function ProtectedRoute({ children }) {
  const { loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!getToken()) {
    return <Navigate to="/login" state={{ next: location.pathname }} replace />;
  }

  return children;
}
