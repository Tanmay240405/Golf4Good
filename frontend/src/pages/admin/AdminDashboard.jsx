import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Users, DollarSign, Trophy, Award, Activity, Flag, ShieldCheck } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    monthlyRevenue: 0,
    prizePool: 0,
    totalDonations: 0,
    pendingWinners: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Artificial delay to show the "Entering Admin Mode" animation
    const timer = setTimeout(() => {
      fetchStats();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data.stats);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, prefix = '', suffix = '', delay = 0, colorClass = 'text-accent' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity bg-current ${colorClass}`} />
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            {prefix}{value.toLocaleString()}{suffix}
          </h3>
        </div>
        <div className={`p-3 rounded-xl bg-white/5 border border-white/5 ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Platform Overview</h1>
        <p className="text-text-secondary">Welcome back to the command center.</p>
      </div>

      {loading ? createPortal(
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-primary/95 backdrop-blur-xl">
           <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                y: [0, -10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative mb-6"
           >
             <div className="absolute inset-0 bg-accent/30 blur-2xl rounded-full scale-150" />
             <Flag className="w-24 h-24 text-accent relative z-10" />
           </motion.div>
           
           <div className="flex flex-col items-center">
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="flex items-center gap-2 text-white text-2xl font-bold tracking-[0.2em] uppercase mb-4"
             >
               <ShieldCheck className="w-7 h-7 text-gold" />
               Entering Admin Mode
             </motion.div>
             <div className="flex gap-2">
               {[0, 1, 2].map(i => (
                 <motion.div
                   key={i}
                   animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                   transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                   className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(163,230,53,0.5)]"
                 />
               ))}
             </div>
           </div>
        </div>,
        document.body
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} delay={0.1} colorClass="text-blue-400" />
            <StatCard title="Active Subscribers" value={stats?.activeSubscribers || 0} icon={Activity} delay={0.2} colorClass="text-success" />
            <StatCard title="Monthly Revenue" value={stats?.monthlyRevenue || 0} icon={DollarSign} prefix="$" delay={0.3} colorClass="text-gold" />
            <StatCard title="Total Prize Pool" value={stats?.prizePool || 0} icon={Trophy} prefix="$" delay={0.4} colorClass="text-purple-400" />
            <StatCard title="Total Donations" value={stats?.totalDonations || 0} icon={HeartIcon} prefix="$" delay={0.5} colorClass="text-rose-400" />
            <StatCard title="Pending Winners" value={stats?.pendingWinners || 0} icon={Award} delay={0.6} colorClass="text-orange-400" />
          </div>
          
          {/* Recent Activity / Chart Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass-card rounded-[2rem] p-6 border border-white/5 min-h-[300px]"
            >
               <h2 className="text-xl font-bold text-white mb-4">Revenue Growth</h2>
               <div className="h-full flex items-center justify-center text-text-muted border border-dashed border-white/10 rounded-xl">
                 Chart Integration Coming Soon
               </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass-card rounded-[2rem] p-6 border border-white/5 min-h-[300px]"
            >
               <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
               <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-sm">
                    <div className="font-bold text-accent mb-1">Latest Completed Draw</div>
                    {stats?.latestCompletedDraw ? (
                      <div className="text-text-secondary">
                        <span className="text-white">"{stats.latestCompletedDraw.title}"</span> completed on {new Date(stats.latestCompletedDraw.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        <div className="text-xs text-text-tertiary mt-1">
                          Winning Numbers: {stats.latestCompletedDraw.winningNumbers.join(', ')}
                        </div>
                      </div>
                    ) : (
                      <div className="text-text-secondary">No draws completed yet.</div>
                    )}
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-sm">
                    <div className="font-bold text-purple-400 mb-1">Latest Winners</div>
                    {stats?.winners && stats.winners.length > 0 ? (
                      <div className="text-text-secondary">
                        {stats.winners.join(', ')}
                      </div>
                    ) : (
                      <div className="text-text-secondary">No winners in the latest draw.</div>
                    )}
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-sm">
                    <div className="font-bold text-success mb-1">New Subscriptions (Last 30 Days)</div>
                    <div className="text-text-secondary">
                      {stats?.newSubscribersLastMonth || 0} active subscriber{(stats?.newSubscribersLastMonth === 1) ? '' : 's'} added.
                    </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}

// Temporary Heart icon for the stat card
function HeartIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
