import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboardLayout from './components/layout/AdminDashboardLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Scores from './pages/Scores';
import Charity from './pages/Charity';
import CharityProfile from './pages/CharityProfile';
import Subscription from './pages/Subscription';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import Draws from './pages/Draws';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminScores from './pages/admin/AdminScores';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminCharities from './pages/admin/AdminCharities';
import AdminDraws from './pages/admin/AdminDraws';
import AdminWinners from './pages/admin/AdminWinners';
import AdminReports from './pages/admin/AdminReports';

import { Toaster } from 'react-hot-toast';

export default function App() {
  const location = useLocation();

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: 'rgba(10, 15, 20, 0.9)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        }
      }} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes with main layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
          </Route>

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/scores" element={<Scores />} />
              <Route path="/dashboard/draws" element={<Draws />} />
              <Route path="/dashboard/charity" element={<Charity />} />
              <Route path="/dashboard/charity/:id" element={<CharityProfile />} />
              <Route path="/dashboard/subscription" element={<Subscription />} />
              <Route path="/dashboard/subscription/success" element={<SubscriptionSuccess />} />
              <Route path="/dashboard/settings" element={<div className="p-8 text-white">Settings Placeholder</div>} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminDashboardLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/scores" element={<AdminScores />} />
              <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
              <Route path="/admin/charities" element={<AdminCharities />} />
              <Route path="/admin/draws" element={<AdminDraws />} />
              <Route path="/admin/winners" element={<AdminWinners />} />
              <Route path="/admin/reports" element={<AdminReports />} />
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
}
