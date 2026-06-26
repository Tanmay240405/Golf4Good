import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Trophy, Award, Activity } from 'lucide-react';
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
    fetchStats();
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

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
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
                    <span className="text-accent font-bold">Draw Completed</span> - The Monthly Mega Draw just finished with 12 winners.
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-sm">
                    <span className="text-success font-bold">New Subscription</span> - John Doe subscribed to Yearly Plan.
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
