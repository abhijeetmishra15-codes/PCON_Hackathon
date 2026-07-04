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
import CareerRoadmap from './pages/CareerRoadmap';
import InterviewPrep from './pages/InterviewPrep';
import Discover from './pages/Discover';
import Referrals from './pages/Referrals';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Network from './pages/Network';
import Opportunities from './pages/Opportunities';
import MyOpportunities from './pages/MyOpportunities';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserVerification from './pages/admin/UserVerification';
import UserManagement from './pages/admin/UserManagement';
import OpportunityModeration from './pages/admin/OpportunityModeration';
import EventModeration from './pages/admin/EventModeration';
import Reports from './pages/admin/Reports';
import BroadcastNotifications from './pages/admin/BroadcastNotifications';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

import SupabaseTest from './pages/SupabaseTest';
import Events from './pages/Events';
import MyEvents from './pages/MyEvents';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './layouts/AdminLayout';

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
              <Route path="/roadmap" element={<CareerRoadmap />} />
              <Route path="/interview" element={<InterviewPrep />} />
              <Route path="/network" element={<Network />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/my-opportunities" element={<MyOpportunities />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/events" element={<Events />} />
              <Route path="/my-events" element={<MyEvents />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Profile />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users/verification" element={<UserVerification />} />
                <Route path="/admin/users/management" element={<UserManagement />} />
                <Route path="/admin/opportunities" element={<OpportunityModeration />} />
                <Route path="/admin/events" element={<EventModeration />} />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/broadcast" element={<BroadcastNotifications />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
