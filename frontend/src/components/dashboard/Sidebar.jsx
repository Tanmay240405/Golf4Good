import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Trophy, 
  Target, 
  Heart, 
  CreditCard, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Scores', path: '/dashboard/scores', icon: Trophy },
  { name: 'Draws', path: '/dashboard/draws', icon: Target },
  { name: 'Charity', path: '/dashboard/charity', icon: Heart },
  { name: 'Subscription', path: '/dashboard/subscription', icon: CreditCard },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isExactDashboard = location.pathname === '/dashboard';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-bg-secondary/50 backdrop-blur-xl border-r border-border z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-border/50">
          <NavLink to="/" className="text-xl font-bold gradient-text">
            Golf4Good
          </NavLink>
          <button 
            className="lg:hidden text-text-secondary hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.path === '/dashboard' 
              ? isExactDashboard 
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-accent/10 text-accent' 
                    : 'text-text-secondary hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-text-muted'}`} />
                {item.name}
              </NavLink>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-text-secondary hover:bg-error/10 hover:text-error transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
}
