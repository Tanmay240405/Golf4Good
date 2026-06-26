import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="orb orb-teal w-[400px] h-[400px] -top-40 -left-40 animate-float-slow" />
      <div className="orb orb-gold w-[300px] h-[300px] -bottom-32 -right-32 animate-float-delayed" />
      <div className="orb orb-blue w-[250px] h-[250px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float opacity-10" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center">
            <span className="text-white font-bold">G4</span>
          </div>
          <span className="text-xl font-bold text-text-primary">
            Golf<span className="text-accent">4</span>Good
          </span>
        </Link>

        {/* Auth Card */}
        <div className="glass-card-static p-8">
          <Outlet />
        </div>

        {/* Back to home */}
        <p className="text-center mt-6 text-xs text-text-muted">
          <Link to="/" className="hover:text-text-secondary transition-colors">
            &larr; Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
