import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import Discover from './pages/Discover';
import Referrals from './pages/Referrals';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Network from './pages/Network';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected App Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/assistant" element={<AIAssistant />} />
          <Route path="/network" element={<Network />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/settings" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
