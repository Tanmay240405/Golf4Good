import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  CreditCard, 
  HeartHandshake, 
  Trophy, 
  Award, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Scores', path: '/admin/scores', icon: Target },
  { name: 'Subscriptions', path: '/admin/subscriptions', icon: CreditCard },
  { name: 'Charities', path: '/admin/charities', icon: HeartHandshake },
  { name: 'Draws', path: '/admin/draws', icon: Trophy },
  { name: 'Winners', path: '/admin/winners', icon: Award },
  { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? (window.innerWidth < 768 ? 60 : 80) : (window.innerWidth < 768 ? '100%' : 260) }}
      className={`h-screen shrink-0 sticky top-0 bg-bg-secondary border-r border-white/5 flex flex-col z-50 transition-all duration-300 shadow-2xl ${window.innerWidth < 768 && !collapsed ? 'absolute inset-0' : ''}`}
    >
      <div className="p-4 md:p-6 flex items-center justify-between border-b border-white/5">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-accent to-gold flex items-center justify-center font-bold text-bg-primary">
              G
            </div>
            <span className="font-bold text-white text-lg tracking-tight whitespace-nowrap">
              Admin<span className="text-accent">Panel</span>
            </span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg bg-white/5 text-text-secondary hover:text-white hover:bg-white/10 transition-colors ${collapsed ? 'mx-auto' : ''}`}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2 custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-accent/20 to-transparent text-accent border border-accent/20' 
                    : 'text-text-secondary hover:bg-white/5 hover:text-white border border-transparent'
                }`
              }
            >
              <Icon className="w-5 h-5 min-w-[20px]" />
              {!collapsed && (
                <span className="font-medium whitespace-nowrap">{item.name}</span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/5 space-y-2">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary hover:bg-white/5 hover:text-white transition-all duration-200 border border-transparent group"
        >
          <Settings className="w-5 h-5 min-w-[20px]" />
          {!collapsed && <span className="font-medium whitespace-nowrap">Back to App</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-error/80 hover:bg-error/10 hover:text-error transition-all duration-200 border border-transparent"
        >
          <LogOut className="w-5 h-5 min-w-[20px]" />
          {!collapsed && <span className="font-medium whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
