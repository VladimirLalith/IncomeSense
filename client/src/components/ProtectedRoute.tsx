// client/src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  // While checking local storage or auth state, show nothing or a loader
  if (loading) {
    return <div>Loading authentication...</div>; // Or a proper spinner
  }

  // If user is logged in, render the child routes (Outlet)
  // Otherwise, redirect to login page
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;