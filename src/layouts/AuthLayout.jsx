import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthLayout() {
  const { user, isLoading } = useAuth();

  // If loading, you could show a spinner here, but let's just wait or let it render
  // because the context resolves very fast on initial load, or we let the routes handle it.
  
  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Warm ambient blobs */}
      <div className="pointer-events-none absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full bg-primary/[0.07] blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 rounded-full bg-accent/[0.07] blur-[140px]" />

      <main className="relative z-10 flex-1 flex items-center justify-center p-5 py-12">
        <div className="w-full max-w-[420px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
