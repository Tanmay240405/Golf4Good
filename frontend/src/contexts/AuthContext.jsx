import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('g4g_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('g4g_token'));
  const [loading, setLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = !!token && !!user;

  // Persist user data
  useEffect(() => {
    if (user) {
      localStorage.setItem('g4g_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('g4g_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('g4g_token', token);
    } else {
      localStorage.removeItem('g4g_token');
    }
  }, [token]);

  const confirmLogoutAction = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    setShowLogoutConfirm(false);
    navigate('/login');
  }, [navigate]);

  const logout = useCallback((confirm = true) => {
    if (confirm) {
      setShowLogoutConfirm(true);
    } else {
      authService.logout();
      setToken(null);
      setUser(null);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.signup(credentials);
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch latest user data from database on mount or when token changes
  useEffect(() => {
    const refreshUser = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.user) {
            setUser(res.user);
          }
        } catch (e) {
          console.error('Session verification failed:', e);
          if (e.response?.status === 401) {
            logout(false);
          }
        }
      }
    };
    refreshUser();
  }, [token, logout]);

  const updateUser = useCallback((userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}

      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div 
              className="absolute inset-0" 
              onClick={() => setShowLogoutConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-sm p-6 relative overflow-hidden z-10 text-center flex flex-col items-center"
            >
              {/* Glowing spot background */}
              <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-error/10 blur-[50px] pointer-events-none" />
              
              {/* Logout Icon */}
              <div className="w-14 h-14 rounded-full bg-error/10 border border-error/20 flex items-center justify-center text-error mb-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <LogOut className="w-6 h-6" />
              </div>

              {/* Title & Desc */}
              <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
              <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                You will be signed out of your account and will need to log back in.
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-text-secondary hover:text-white font-semibold text-sm transition-all flex-1 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogoutAction}
                  className="px-4 py-2.5 rounded-xl bg-error hover:bg-red-600 text-white font-semibold text-sm transition-all flex-1 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  Yes, Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
