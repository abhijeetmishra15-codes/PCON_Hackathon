import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import Discover from './pages/Discover';
import Referrals from './pages/Referrals';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Network from './pages/Network';
import Opportunities from './pages/Opportunities';
import MyOpportunities from './pages/MyOpportunities';
import AdminDashboard from './pages/AdminDashboard';
import SupabaseTest from './pages/SupabaseTest';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/test-supabase" element={<SupabaseTest />} />
          
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Protected App Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="/network" element={<Network />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/my-opportunities" element={<MyOpportunities />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/settings" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
