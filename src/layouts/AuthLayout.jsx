import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
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
