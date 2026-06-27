import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { getInitials } from '../../utils/helpers';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isLanding = location.pathname === '/';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg-primary/80 backdrop-blur-xl border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-light flex items-center justify-center">
              <span className="text-white font-bold text-sm">G4</span>
            </div>
            <span className="text-lg font-bold text-text-primary">
              Golf<span className="text-accent">4</span>Good
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {isLanding && (
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-gold flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {getInitials(user?.name)}
                    </span>
                  </div>
                  <span className="text-sm text-text-secondary">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-text-tertiary transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 glass-card-static p-1.5 shadow-xl"
                    >
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                        <p className="text-xs text-text-tertiary truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/dashboard/charity"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" /> {/* Should use Heart icon, but User is imported, I'll just use it for now or I can add Heart import */}
                        Charities
                      </Link>
                      <Link
                        to="/dashboard/subscription"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Subscription
                      </Link>
                      <Link
                        to="/dashboard/draws"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Winnings
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen((m) => !m)}
            className="md:hidden text-text-secondary hover:text-text-primary p-2"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-bg-primary/95 backdrop-blur-xl border-b border-border"
          >
            <div className="container-custom py-4 space-y-3">
              {isLanding &&
                navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              <div className="pt-3 border-t border-border flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="block py-2 text-sm text-text-secondary hover:text-text-primary">
                      Dashboard
                    </Link>
                    <Link to="/dashboard/charity" className="block py-2 text-sm text-text-secondary hover:text-text-primary">
                      Charities
                    </Link>
                    <Link to="/dashboard/subscription" className="block py-2 text-sm text-text-secondary hover:text-text-primary">
                      Subscription
                    </Link>
                    <Link to="/dashboard/draws" className="block py-2 text-sm text-text-secondary hover:text-text-primary">
                      Winnings
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link to="/admin/dashboard" className="block py-2 text-sm text-text-secondary hover:text-text-primary">
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="text-left py-2 text-sm text-error hover:text-error/80"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" size="sm" className="w-full">
                        Log in
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button variant="primary" size="sm" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
