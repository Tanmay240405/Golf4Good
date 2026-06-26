import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, DollarSign, Type, Play, Clock, Sparkles } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminDraws() {
  const [title, setTitle] = useState('Monthly Mega Draw');
  const [prizePool, setPrizePool] = useState(1000);
  const [date, setDate] = useState('');
  
  const [creating, setCreating] = useState(false);
  const [upcomingDraws, setUpcomingDraws] = useState([]);
  const [pastDraws, setPastDraws] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      setLoading(true);
      const [upcomingRes, historyRes] = await Promise.all([
        adminService.getUpcomingDraws(),
        adminService.getDrawsHistory()
      ]);
      setUpcomingDraws(upcomingRes.draws || []);
      setPastDraws(historyRes.draws || []);
    } catch (error) {
      toast.error('Failed to load draws');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDraw = async () => {
    try {
      setCreating(true);
      await adminService.createDraw({ title, prizePool: Number(prizePool), date });
      toast.success('Upcoming draw announced!');
      setTitle('Monthly Mega Draw');
      setPrizePool(1000);
      setDate('');
      fetchDraws();
    } catch (error) {
      toast.error('Failed to create draw');
    } finally {
      setCreating(false);
    }
  };

  const handleRunDraw = async (id) => {
    if (!window.confirm("Are you sure you want to run this draw? Winners will be finalized instantly.")) return;
    try {
      await adminService.runDraw(id);
      toast.success('Draw executed successfully!');
      fetchDraws();
    } catch (error) {
      toast.error('Failed to execute draw');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Manage Draws</h1>
        <p className="text-text-secondary">Create upcoming draws, run simulations, and publish results.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Draw */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[2rem] p-6 border border-white/5 sticky top-24"
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-gold" /> Announce Draw
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Draw Title</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Prize Pool ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input type="number" value={prizePool} onChange={(e) => setPrizePool(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Target Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors" />
                </div>
              </div>

              <button onClick={handleCreateDraw} disabled={creating} className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-accent to-gold text-bg-primary font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(163,230,53,0.2)]">
                {creating ? 'Creating...' : 'Create Draw'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Draw Management */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Draws */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-accent" /> Ready to Run
            </h2>
            
            {loading ? (
               <div className="p-8 flex justify-center"><div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>
            ) : upcomingDraws.length === 0 ? (
               <div className="glass-card rounded-[2rem] p-8 text-center text-text-secondary border border-white/5">No upcoming draws. Create one!</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingDraws.map(draw => (
                  <motion.div key={draw.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-accent/5 group-hover:bg-accent/10 transition-colors" />
                    <h3 className="font-bold text-white text-lg mb-1 relative z-10">{draw.title}</h3>
                    <p className="text-gold font-bold text-xl mb-4 relative z-10">${draw.totalPrizePool.toLocaleString()}</p>
                    <div className="flex gap-2 relative z-10">
                      <button onClick={() => toast('Simulation preview not implemented yet.', { icon: '🧪' })} className="flex-1 py-2 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-all text-sm">
                        Simulate
                      </button>
                      <button onClick={() => handleRunDraw(draw.id)} className="flex-1 py-2 rounded-lg bg-accent/20 text-accent border border-accent/30 font-bold hover:bg-accent hover:text-bg-primary transition-all flex items-center justify-center gap-2 text-sm">
                        <Play className="w-4 h-4 fill-current" /> Run Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Past Draws */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-text-secondary" /> History
            </h2>

            <div className="glass-card rounded-[2rem] p-2 border border-white/5 overflow-hidden">
              {loading ? null : pastDraws.length === 0 ? (
                <div className="p-8 text-center text-text-secondary">No history found.</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {pastDraws.map((draw) => (
                    <div key={draw.id} className="p-5 hover:bg-white/5 transition-colors">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-white text-lg">
                          {draw.title || new Date(draw.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-text-secondary font-medium">
                          Pool: <span className="text-gold">${draw.totalPrizePool.toLocaleString()}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-text-tertiary uppercase tracking-wider font-bold">Winning Numbers</span>
                          <div className="flex gap-1.5 ml-2">
                            {draw.winningNumbers.map((num, i) => (
                              <div key={i} className="w-7 h-7 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-xs font-bold text-accent">
                                {num}
                              </div>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-success font-bold px-2 py-1 bg-success/10 rounded border border-success/20">
                          COMPLETED
                        </span>
                      </div>

                      <div className="text-xs text-text-secondary bg-white/5 p-3 rounded-xl border border-white/5 flex flex-wrap gap-2 items-center">
                        <span className="text-white font-semibold">{draw.winners?.length || 0} winners</span> 
                        {draw.winners?.map(w => (
                          <span key={w.id} className="bg-white/10 px-2 py-1 rounded">
                            {w.user?.name} ({w.matchType} Matches)
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
