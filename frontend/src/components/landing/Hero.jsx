import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Sparkles,
  Calendar,
  Users,
  TrendingUp,
  Globe,
  Trophy,
  Heart,
  ArrowRight
} from 'lucide-react';
import Button from '../ui/Button';
import { statsService } from '../../services/statsService';

export default function Hero() {
  const [stats, setStats] = useState({
    activePlayers: 0,
    totalCharities: 0,
    winners: 0,
    totalDonations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await statsService.getPublicStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatDonations = (val) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val}`;
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-hidden">
      {/* Dark overlay specifically for the left side to ensure text pops */}
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(5,10,15,0.7)] via-[rgba(5,10,15,0.4)] to-transparent pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col items-start justify-center px-8 md:px-16 lg:px-24 w-full">

        {/* --- Top Heading Area --- */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 mt-12"
        >

          {/* Huge Title */}
          <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-white leading-[1.05] tracking-tight mb-4 drop-shadow-2xl">
            Play Golf.
            <br />
            Win Monthly.
          </h1>

          {/* Sub-info Icons */}
          <div className="flex items-center gap-6 text-text-secondary font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-text-primary" />
              Season 2026
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-text-primary" />
              Play for Charity
            </div>
          </div>
        </motion.div>

        {/* --- Stacked Cards Area --- */}
        <div className="flex flex-col gap-6 w-full max-w-[440px]">

          {/* Card 1: Platform Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-[2rem] p-6 backdrop-blur-2xl bg-[rgba(10,15,20,0.65)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between text-text-secondary mb-6">
              <div className="flex items-center gap-2 font-semibold text-text-primary">
                <TrendingUp className="w-5 h-5 text-white" />
                Platform Impact
              </div>
              <Globe className="w-5 h-5 opacity-50" />
            </div>

            {/* Neon outline pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/40 text-accent text-sm font-semibold mb-4 bg-accent/5">
              <Heart className="w-4 h-4" />
              Giving Through Golf
            </div>

            {/* Big Stat */}
            <div className="mb-6">
              <div className="text-[3.5rem] font-bold text-white leading-none tracking-tight">
                10%
              </div>
              <div className="text-text-secondary text-lg font-medium mt-1">
                Minimum Charity Contribution
              </div>
            </div>

            {/* Inner stat cards */}
            <div className="flex gap-4">
              <div className="flex-1 glass-card-static rounded-2xl p-4 bg-[rgba(255,255,255,0.03)] border-white/5">
                <div className="text-2xl font-bold text-white mb-1">Monthly</div>
                <div className="text-xs text-text-tertiary flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                  <Trophy className="w-3.5 h-3.5" />
                  Prize Draws
                </div>
              </div>
              <div className="flex-1 glass-card-static rounded-2xl p-4 bg-[rgba(255,255,255,0.03)] border-white/5">
                <div className="text-2xl font-bold text-white mb-1">Support</div>
                <div className="text-xs text-text-tertiary flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                  <Heart className="w-3.5 h-3.5" />
                  Your Cause
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Get Started */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card rounded-[2rem] p-6 backdrop-blur-2xl bg-[rgba(10,15,20,0.65)] relative overflow-hidden group"
          >
            {/* Glowing neon background orb inside the card */}
            <div className="absolute -bottom-24 -right-10 w-64 h-64 bg-accent rounded-full filter blur-[70px] opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

            {/* Header */}
            <div className="flex items-center justify-between text-text-secondary mb-4 relative z-10">
              <div className="flex items-center gap-2 font-semibold text-text-primary">
                <Sparkles className="w-5 h-5 text-white" />
                Get Started
              </div>
              <ArrowUpRight className="w-5 h-5 opacity-50" />
            </div>

            <p className="text-text-secondary leading-relaxed mb-6 relative z-10 text-[15px]">
              Try our <strong className="text-white">free tier</strong>. Compete in monthly challenges, track your progress, and donate winnings to causes you care about.
            </p>

            <div className="relative z-10 flex gap-3">
              <Link to="/signup" className="flex-1">
                <Button className="w-full bg-accent text-[#050A0F] hover:bg-accent-light shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                  Start Free
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <a href="#features" className="flex-1">
                <Button variant="secondary" className="w-full bg-[rgba(255,255,255,0.05)] border-white/10 hover:bg-[rgba(255,255,255,0.1)]">
                  How it Works
                </Button>
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
