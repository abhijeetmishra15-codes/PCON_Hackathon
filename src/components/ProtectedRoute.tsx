import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-text-secondary text-sm font-medium">Verifying session...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the current location to return to later
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
