import { motion } from 'framer-motion';
import { Trophy, Heart, Calendar, CreditCard, DollarSign, Ticket, Clock, User, Shield, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import { drawService } from '../services/drawService';
import { getScores } from '../services/scoreService';

export default function Dashboard() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [scores, setScores] = useState([]);
  const [currentScoreIndex, setCurrentScoreIndex] = useState(0);
  const [upcomingDraw, setUpcomingDraw] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadSubscription(),
          loadScores(),
          loadUpcomingDraw()
        ]);
      } catch (e) {
        console.error("Failed to load dashboard data:", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const loadUpcomingDraw = async () => {
    try {
      const res = await drawService.getUpcomingDraws();
      if (res.draws && res.draws.length > 0) {
        setUpcomingDraw(res.draws[0]);
      }
    } catch (e) {
      console.error("Failed to load upcoming draw");
    }
  };

  const loadSubscription = async () => {
    try {
      const res = await subscriptionService.getCurrentSubscription();
      if (res.success && res.data) {
        setSubscription(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadScores = async () => {
    try {
      const data = await getScores();
      const realScores = data.scores || data.data?.scores || data;
      
      if (Array.isArray(realScores) && realScores.length > 0) {
        // Map real scores to include course/entries helpers
        const mapped = realScores.map((s) => ({
          id: s.id,
          score: s.score,
          date: s.date ? s.date.split('T')[0] : '',
          course: s.course || 'Local Golf Club',
          entries: s.entries || 0,
        }));
        setScores(mapped);
      } else {
        setScores([]);
      }
    } catch (e) {
      console.error("Failed to load real scores", e);
      setScores([]);
    }
  };

  const nextScore = () => {
    if (scores.length === 0) return;
    setCurrentScoreIndex((prev) => (prev + 1) % scores.length);
  };

  const prevScore = () => {
    if (scores.length === 0) return;
    setCurrentScoreIndex((prev) => (prev - 1 + scores.length) % scores.length);
  };

  const isPro = subscription?.status === 'ACTIVE';
  const currentScoreItem = scores[currentScoreIndex] || { id: '', score: 0, date: '', course: '', entries: 0 };

  // Helper to format date into Day / Month
  const formatDateParts = (dateString) => {
    try {
      if (!dateString) return { day: '--', month: '---' };
      const dateObj = new Date(dateString);
      const day = dateObj.getDate();
      const month = dateObj.toLocaleString('en-US', { month: 'short' });
      return { day, month };
    } catch (e) {
      return { day: '--', month: '---' };
    }
  };

  const { day, month } = formatDateParts(currentScoreItem.date);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/5" />
          <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin" />
        </div>
        <p className="text-text-secondary text-sm font-semibold mt-4 animate-pulse">Loading dashboard details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-start w-full relative z-10 pb-16">

      {/* Top Heading Area (Matches Hero style) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-xl">
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Golfer'}</span>
        </h1>
        <p className="text-text-secondary font-medium">
          Here's an overview of your golf journey and charitable impact.
        </p>
      </motion.div>

      <div className="flex flex-col items-start gap-8 w-full">
        {/* Stacked Cards Area (Left Aligned, max-width constrained like Hero) */}
        <div className="flex flex-col gap-6 w-full max-w-[440px]">

        {/* Card 1: Account Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card rounded-[2rem] p-6 backdrop-blur-2xl bg-[rgba(10,15,20,0.65)]"
        >
          <div className="flex items-center justify-between text-text-secondary mb-6">
            <div className="flex items-center gap-2 font-semibold text-text-primary">
              <User className="w-5 h-5 text-white" />
              Account Overview
            </div>
            {isPro ? (
              <Link to="/dashboard/subscription" className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-success/40 text-success text-xs font-semibold bg-success/10 hover:bg-success/20 transition-colors">
                <CreditCard className="w-3.5 h-3.5" />
                Active Pro
              </Link>
            ) : (
              <Link to="/dashboard/subscription" className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-text-muted/40 text-text-muted text-xs font-semibold hover:bg-white/5 transition-colors">
                <Shield className="w-3.5 h-3.5" />
                Free Plan
              </Link>
            )}
          </div>

          <div className="mb-6">
            <div className="text-[3.5rem] font-bold text-white leading-none tracking-tight">
              ${(user?.totalWinnings || 0).toLocaleString()}
            </div>
            <div className="text-text-secondary text-lg font-medium mt-1 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gold" /> Total Winnings
            </div>
          </div>

          <div className="flex gap-4">
            <Link to="/dashboard/charity" className="flex-1 glass-card-static rounded-2xl p-4 bg-[rgba(255,255,255,0.03)] border-white/5 hover:bg-[rgba(255,255,255,0.08)] transition-colors block group">
              <div className="text-xl font-bold text-white mb-1">{user?.donationPercentage || 10}%</div>
              <div className="text-xs text-text-tertiary flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                <Heart className="w-3.5 h-3.5 text-[#f472b6] group-hover:scale-110 transition-transform" />
                Donation
              </div>
            </Link>
            <Link to="/dashboard/subscription" className="flex-1 glass-card-static rounded-2xl p-4 bg-[rgba(255,255,255,0.03)] border-white/5 hover:bg-[rgba(255,255,255,0.08)] transition-colors block group">
              <div className="text-xl font-bold text-white mb-1 whitespace-nowrap">
                {isPro && subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : 'Upgrade'}
              </div>
              <div className="text-xs text-text-tertiary flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                <Clock className="w-3.5 h-3.5 text-text-secondary group-hover:text-white transition-colors" />
                {isPro ? 'Renewal' : 'Go Pro'}
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Card 2: Active Tickets */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-[2rem] p-6 backdrop-blur-2xl bg-[rgba(10,15,20,0.65)] relative overflow-hidden group border-accent/20"
        >
          <div className="absolute -bottom-24 -right-10 w-64 h-64 bg-accent rounded-full filter blur-[70px] opacity-10 group-hover:opacity-20 transition-opacity duration-500" />

          <div className="relative z-10">
            <div className="flex items-center justify-between text-text-secondary mb-4">
              <div className="flex items-center gap-2 font-semibold text-text-primary">
                <Ticket className="w-5 h-5 text-accent" />
                Active Tickets
              </div>
            </div>

            {isPro ? (
              <>
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-5xl font-bold text-white drop-shadow-[0_0_15px_rgba(163,230,53,0.3)]">{Math.min(scores.length, 5)}</span>
                  <span className="text-text-secondary mb-1 font-medium">/ 5 max</span>
                </div>
                <p className="text-[15px] text-text-tertiary mb-6">Eligible for the upcoming draw</p>

                <Link to="/dashboard/scores" className="block text-center w-full py-2.5 bg-accent/10 border border-accent/20 hover:bg-accent hover:text-bg-primary text-accent rounded-xl font-semibold transition-all">
                  Manage Scores
                </Link>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Pro Feature</h3>
                <p className="text-sm text-text-secondary mb-6">Subscribe to Pro to participate in our monthly prize draws and support charities.</p>
                <Link to="/dashboard/subscription" className="block text-center w-full py-2.5 bg-accent hover:bg-accent-light text-bg-primary rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                  Upgrade to Pro
                </Link>
              </div>
            )}
          </div>
        </motion.div>







        {/* Card 3: Upcoming Draw (Scrollable) */}
        {isPro && upcomingDraw ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex md:hidden items-center select-none w-full"
          >
            <div 
              className="relative flex items-center w-full max-w-[440px]"
            >
              {/* Floating Title Badge */}
              <div className="absolute -top-3 left-6 bg-[#10161d] text-white text-[10px] px-3.5 py-1 rounded-full flex gap-1.5 font-semibold z-20 border border-gold/20">
                <span className="text-gold font-bold drop-shadow-md">Upcoming Draw</span>
              </div>

              {/* Seamless Container (Pill) */}
              <div className="flex items-center w-full h-20 justify-between bg-[#10161d] rounded-[2rem] px-6 relative overflow-hidden border border-gold/20 shadow-[0_10px_30px_rgba(234,179,8,0.15)] hover:shadow-[0_10px_35px_rgba(234,179,8,0.25)] transition-shadow">
                
                {/* Hexagon Honeycomb Overlay - Gold */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.15] text-gold" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="hexagons-draw" width="12" height="20.78" patternUnits="userSpaceOnUse">
                      <path d="M6 0 L12 3.46 L12 10.39 L6 13.86 L0 10.39 L0 3.46 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      <path d="M0 20.78 L6 17.32 L12 20.78" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#hexagons-draw)" />
                </svg>

                {/* Left Side (Countdown) */}
                <div className="flex flex-col items-start justify-center z-10 pt-1">
                  <span className="text-2xl font-bold text-white tracking-tight leading-none drop-shadow-md flex items-baseline">
                    {Math.max(0, Math.ceil((new Date(upcomingDraw.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))}<span className="text-sm text-gold mx-0.5">d</span>
                  </span>
                  <span className="text-[9px] uppercase text-gold tracking-[0.2em] font-black mt-1">
                    Time Left
                  </span>
                </div>

                {/* Right Side (Prize Pool) */}
                <div className="flex items-center z-10 pt-1">
                  <div className="flex flex-col items-end justify-center pr-5">
                    <span className="text-[9px] uppercase text-text-muted tracking-widest font-extrabold mb-1">Prize Pool</span>
                    <span className="text-xl font-bold text-white tracking-tight leading-none">${upcomingDraw.totalPrizePool.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col items-end justify-center border-l border-white/10 pl-5">
                    <span className="text-[9px] uppercase text-gold tracking-widest font-extrabold mb-1 whitespace-nowrap">{upcomingDraw.title}</span>
                    <span className="text-xs font-semibold text-text-secondary tracking-tight leading-none whitespace-nowrap">{new Date(upcomingDraw.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex md:hidden items-center select-none w-full"
          >
            <div className="bg-[#10161d] text-text-secondary text-sm px-6 py-4 rounded-[1.5rem] border border-white/5 flex items-center gap-3 shadow-xl backdrop-blur-md w-full max-w-[440px]">
              <Ticket className="w-5 h-5 text-text-muted" /> No upcoming draws scheduled
            </div>
          </motion.div>
        )}

        </div>
      </div>

      {/* Floating HUD - Upcoming Draw (Desktop Only) */}
      {isPro && upcomingDraw ? (
        <div className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-50 items-center select-none scale-100 w-[320px] origin-center">
          {/* Unified Shape Wrapper */}
          <div 
            className="relative flex items-center w-full"
            style={{ filter: 'drop-shadow(0 0 1.5px rgba(234,179,8,0.4)) drop-shadow(0 15px 35px rgba(0,0,0,0.5))' }}
          >
            {/* Floating Title Badge */}
            <div className="absolute -top-7 left-6 bg-[#10161d] text-white text-[10px] px-3.5 py-1 rounded-full flex gap-1.5 font-semibold z-20">
              <span className="text-gold font-bold drop-shadow-md">Upcoming Draw</span>
            </div>

            {/* Seamless Container (Pill) */}
            <div className="flex items-center w-full h-16 justify-between bg-[#10161d] rounded-full px-5 relative overflow-hidden">
              
              {/* Hexagon Honeycomb Overlay - Gold */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.15] text-gold" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="hexagons-draw" width="12" height="20.78" patternUnits="userSpaceOnUse">
                    <path d="M6 0 L12 3.46 L12 10.39 L6 13.86 L0 10.39 L0 3.46 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M0 20.78 L6 17.32 L12 20.78" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hexagons-draw)" />
              </svg>

              {/* Left Side (Countdown) */}
              <div className="flex flex-col items-start justify-center z-10 pt-1">
                <span className="text-xl font-bold text-white tracking-tight leading-none drop-shadow-md flex items-baseline">
                  {Math.max(0, Math.ceil((new Date(upcomingDraw.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))}<span className="text-sm text-gold mx-0.5">d</span>
                </span>
                <span className="text-[8px] uppercase text-gold tracking-[0.2em] font-black mt-1">
                  Time Left
                </span>
              </div>

              {/* Right Side (Prize Pool) */}
              <div className="flex items-center z-10 pt-1">
                <div className="flex flex-col items-end justify-center pr-4">
                  <span className="text-[8px] uppercase text-text-muted tracking-widest font-extrabold mb-0.5">Prize Pool</span>
                  <span className="text-lg font-bold text-white tracking-tight leading-none">${upcomingDraw.totalPrizePool.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-end justify-center border-l border-white/10 pl-4">
                  <span className="text-[8px] uppercase text-gold tracking-widest font-extrabold mb-0.5 whitespace-nowrap">{upcomingDraw.title}</span>
                  <span className="text-[10px] font-semibold text-text-secondary tracking-tight leading-none whitespace-nowrap">{new Date(upcomingDraw.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-50 items-center select-none scale-100 origin-center">
          <div className="bg-[#10161d] text-text-secondary text-xs px-4 py-2 rounded-full border border-white/5 flex items-center gap-2 shadow-xl backdrop-blur-md">
            <Ticket className="w-4 h-4 text-text-muted" /> No upcoming draws scheduled
          </div>
        </div>
      )}

      {/* Floating HUD - Latest Scores */}
      {scores.length > 0 && (
        <div className="fixed bottom-4 md:bottom-8 left-1/2 md:left-auto md:right-8 -translate-x-1/2 md:translate-x-0 z-50 flex items-center gap-1 md:gap-3 select-none scale-[0.85] md:scale-100 origin-bottom md:origin-bottom-right w-max">
          {/* Prev Button */}
          <button
            onClick={prevScore}
            className="w-10 h-10 rounded-full bg-[rgba(20,25,30,0.85)] border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shadow-lg shrink-0 backdrop-blur-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Central HUD Wrapper for Unified Shape */}
          <div
            className="relative flex flex-col items-center flex-1 w-[320px]"
            style={{ filter: 'drop-shadow(0 0 1.5px rgba(132,204,22,0.4)) drop-shadow(0 15px 35px rgba(0,0,0,0.5))' }}
          >

            {/* Floating Course Badge */}
            <div className="absolute -top-13 bg-[#10161d] text-white text-[11px] px-4 py-1.5 rounded-full flex gap-1.5 font-semibold z-20 max-w-[280px] truncate whitespace-nowrap">
              <span className="text-[#84cc16] font-bold drop-shadow-md">{currentScoreItem.course}</span>
            </div>

            {/* Seamless Dumbbell Container */}
            <div className="flex items-center w-full h-16 justify-between bg-[#10161d] rounded-full p-1 relative">

              {/* Date Pod (Left) */}
              <div className="flex flex-col items-center justify-center flex-1 py-1 pl-3">
                <span className="text-xl font-bold text-white tracking-tight leading-none">{day}</span>
                <span className="text-[10px] uppercase text-text-muted tracking-widest font-extrabold mt-0.5">{month}</span>
              </div>

              {/* Glowing Circular Points Pod (Center) */}
              <div className="relative w-24 h-24 -my-4 rounded-full bg-[#10161d] shadow-[inset_0_0_20px_rgba(132,204,22,0.15)] flex flex-col items-center justify-center overflow-hidden mx-1 z-10 shrink-0">

                {/* Hexagon Honeycomb Overlay */}
                <svg className="absolute inset-0 w-full h-full opacity-30 text-[#84cc16]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="hexagons-scores-floating" width="12" height="20.78" patternUnits="userSpaceOnUse">
                      <path d="M6 0 L12 3.46 L12 10.39 L6 13.86 L0 10.39 L0 3.46 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      <path d="M0 20.78 L6 17.32 L12 20.78" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#hexagons-scores-floating)" />
                </svg>

                {/* Content */}
                <span className="text-3xl font-bold text-white tracking-tight z-10 relative leading-none mt-1 drop-shadow-md">
                  {currentScoreItem.score}
                </span>
                <span className="text-[9px] uppercase text-[#84cc16] tracking-[0.2em] font-black mt-1 z-10 relative">
                  Points
                </span>
              </div>

              {/* Status Pod (Right) */}
              <div className="flex flex-col items-center justify-center flex-1 py-1 pr-3">
                <span className="text-lg font-bold text-[#84cc16] tracking-tight leading-none">Active</span>
                <span className="text-[10px] uppercase text-text-muted tracking-widest font-extrabold mt-1">Status</span>
              </div>

            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={nextScore}
            className="w-10 h-10 rounded-full bg-[rgba(20,25,30,0.85)] border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shadow-lg shrink-0 backdrop-blur-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Add Score Button */}
          <Link
            to="/dashboard/scores"
            className="w-10 h-10 ml-2 rounded-full bg-accent/10 border border-accent/30 hover:bg-accent/20 hover:border-accent/50 active:scale-95 flex items-center justify-center text-accent transition-all cursor-pointer shadow-[0_0_15px_rgba(132,204,22,0.15)] shrink-0 backdrop-blur-md"
            title="Add Score"
          >
            <Plus className="w-5 h-5" />
          </Link>
        </div>
      )}
    </div>
  );
}
