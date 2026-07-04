import React from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AdminRoute() {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-text-secondary text-sm font-medium">Verifying admin session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="max-w-md w-full bg-white/70 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-soft text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mx-auto mb-6">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-bold text-text-main mb-2">403 Unauthorized</h1>
          <p className="text-text-secondary mb-8 text-sm">
            You do not have the required privileges to view this page. If you believe this is a mistake, please contact support.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-border rounded-xl text-text-main font-semibold hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft size={16} />
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
