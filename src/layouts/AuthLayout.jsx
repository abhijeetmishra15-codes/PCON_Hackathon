import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthLayout() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>

      {/* Animated floating blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Blob 1 — amber glow top-left */}
        <div
          className="absolute rounded-full opacity-30"
          style={{
            width: '55vw',
            height: '55vw',
            top: '-20vw',
            left: '-15vw',
            background: 'radial-gradient(circle, rgba(245,158,11,0.55) 0%, rgba(251,146,60,0.2) 55%, transparent 80%)',
            filter: 'blur(60px)',
            animation: 'blob-move-1 14s ease-in-out infinite alternate',
          }}
        />
        {/* Blob 2 — purple glow bottom-right */}
        <div
          className="absolute rounded-full opacity-25"
          style={{
            width: '60vw',
            height: '60vw',
            bottom: '-25vw',
            right: '-20vw',
            background: 'radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(109,40,217,0.25) 50%, transparent 80%)',
            filter: 'blur(70px)',
            animation: 'blob-move-2 18s ease-in-out infinite alternate',
          }}
        />
        {/* Blob 3 — teal center accent */}
        <div
          className="absolute rounded-full opacity-20"
          style={{
            width: '40vw',
            height: '40vw',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(20,184,166,0.45) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'blob-move-3 22s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* Noise texture overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }}
      />

      <main className="relative z-10 flex-1 flex items-center justify-center p-5 py-12">
        <div className="w-full max-w-[440px]">
          <Outlet />
        </div>
      </main>

      {/* Blob keyframe animations injected via style tag */}
      <style>{`
        @keyframes blob-move-1 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(30px, 20px) scale(1.07); }
          100% { transform: translate(-20px, 40px) scale(0.95); }
        }
        @keyframes blob-move-2 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(-40px, -25px) scale(1.1); }
          100% { transform: translate(20px, -50px) scale(0.92); }
        }
        @keyframes blob-move-3 {
          0%   { transform: translate(-50%, -50%) scale(1); }
          50%  { transform: translate(-50%, -50%) scale(1.15); }
          100% { transform: translate(-50%, -50%) scale(0.9); }
        }
        .auth-glass-card {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 8px 40px rgba(0,0,0,0.35), 0 2px 0 rgba(255,255,255,0.06) inset;
          border-radius: 24px;
        }
        .auth-input-field {
          background: rgba(255, 255, 255, 0.07) !important;
          border: 1.5px solid rgba(255, 255, 255, 0.12) !important;
          color: #ffffff !important;
          border-radius: 14px !important;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s !important;
        }
        .auth-input-field::placeholder {
          color: rgba(255, 255, 255, 0.35) !important;
        }
        .auth-input-field:focus {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(245, 158, 11, 0.7) !important;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15) !important;
          outline: none !important;
        }
        .auth-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        .auth-btn-primary {
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
          box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4), 0 1px 0 rgba(255,255,255,0.15) inset;
          border: none;
          border-radius: 14px;
          color: #fff;
          font-weight: 700;
          letter-spacing: 0.01em;
          transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
        }
        .auth-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(245, 158, 11, 0.5), 0 1px 0 rgba(255,255,255,0.15) inset;
          filter: brightness(1.05);
        }
        .auth-btn-primary:active:not(:disabled) {
          transform: translateY(0px);
          box-shadow: 0 2px 10px rgba(245, 158, 11, 0.35);
        }
        .auth-btn-outline {
          background: rgba(255, 255, 255, 0.07);
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          border-radius: 14px;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 600;
          transition: background 0.15s, border-color 0.15s, transform 0.15s;
        }
        .auth-btn-outline:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }
        .auth-divider {
          border-color: rgba(255, 255, 255, 0.1);
        }
        .auth-text-secondary {
          color: rgba(255, 255, 255, 0.5);
        }
        .auth-text-primary-link {
          color: #FCD34D;
          font-weight: 600;
          transition: color 0.15s;
        }
        .auth-text-primary-link:hover {
          color: #F59E0B;
        }
        .auth-error-box {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          color: #FCA5A5;
        }
        .auth-success-box {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 16px;
          color: #86EFAC;
        }
        .auth-tab-active {
          background: rgba(245, 158, 11, 0.2);
          border: 1px solid rgba(245, 158, 11, 0.35);
          color: #FCD34D;
          border-radius: 10px;
        }
        .auth-tab-inactive {
          color: rgba(255, 255, 255, 0.45);
          border-radius: 10px;
        }
        .auth-tab-inactive:hover {
          color: rgba(255, 255, 255, 0.75);
          background: rgba(255, 255, 255, 0.05);
        }
        .auth-role-indicator {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
        }
        .auth-icon-wrapper {
          background: linear-gradient(135deg, rgba(245,158,11,0.25) 0%, rgba(251,146,60,0.15) 100%);
          border: 1px solid rgba(245,158,11,0.3);
          box-shadow: 0 4px 16px rgba(245,158,11,0.2);
        }
        .strength-bar-bg {
          background: rgba(255,255,255,0.08);
          border-radius: 99px;
          height: 4px;
          flex: 1;
          overflow: hidden;
        }
        .strength-bar-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.35s ease;
        }
      `}</style>
    </div>
  );
}
