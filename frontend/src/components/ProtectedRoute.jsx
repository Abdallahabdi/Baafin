import React from 'react';
import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

/**
 * ProtectedRoute: wraps pages that require authentication.
 * If adminOnly is true, also requires role === 'admin'.
 */
export default function ProtectedRoute({ children, adminOnly=false }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  try {
    const payload = jwtDecode(token);
    // token expiry check
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />
    }
    if (adminOnly && payload.role !== "admin") {
      return <Navigate to="/unauthorized" />;
    }

    if (adminOnly && payload.role !== 'admin') {
      return <Navigate to="/" replace />
    }
    return children;
  } catch (err) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
}
