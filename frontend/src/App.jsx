import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
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
import Admin from './pages/Admin';

import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: 'rgba(10, 15, 20, 0.9)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        }
      }} />
      <Routes>
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
            {/* Placeholders for other routes */}
            <Route path="/dashboard/draws" element={<Draws />} />
            <Route path="/dashboard/admin" element={<Admin />} />
            <Route path="/dashboard/charity" element={<Charity />} />
            <Route path="/dashboard/charity/:id" element={<CharityProfile />} />
            <Route path="/dashboard/subscription" element={<Subscription />} />
            <Route path="/dashboard/subscription/success" element={<SubscriptionSuccess />} />
            <Route path="/dashboard/profile" element={<div className="p-8 text-white">Profile Placeholder</div>} />
            <Route path="/dashboard/settings" element={<div className="p-8 text-white">Settings Placeholder</div>} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
