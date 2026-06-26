import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Trophy, Image as ImageIcon, CheckCircle, XCircle, DollarSign, Calendar, Type, Play, Clock } from 'lucide-react';
import { drawService } from '../services/drawService';
import toast from 'react-hot-toast';

export default function Admin() {
  const [title, setTitle] = useState('Monthly Mega Draw');
  const [prizePool, setPrizePool] = useState(1000);
  const [date, setDate] = useState('');
  
  const [creating, setCreating] = useState(false);
  const [upcomingDraws, setUpcomingDraws] = useState([]);
  const [pastDraws, setPastDraws] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingRes, upcomingRes, historyRes] = await Promise.all([
        drawService.getPendingVerifications(),
        drawService.getUpcomingDraws(),
        drawService.getDrawHistory()
      ]);
      setPendingVerifications(pendingRes.pendingWinners || []);
      setUpcomingDraws(upcomingRes.draws || []);
      setPastDraws(historyRes.draws || []);
    } catch (error) {
      toast.error('Failed to load admin data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDraw = async () => {
    try {
      setCreating(true);
      await drawService.createUpcomingDraw({ title, prizePool: Number(prizePool), date });
      toast.success('Upcoming draw announced!');
      setTitle('Monthly Mega Draw');
      setPrizePool(1000);
      setDate('');
      fetchData();
    } catch (error) {
      toast.error('Failed to create draw');
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  const handleRunDraw = async (id) => {
    if (!window.confirm("Are you sure you want to run this draw? Winners will be finalized.")) return;
    try {
      await drawService.runDraw(id);
      toast.success('Draw executed successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to execute draw');
      console.error(error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await drawService.updateWinnerStatus(id, status);
      toast.success(`Winner marked as ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col w-full relative z-10 pb-16">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-xl flex items-center gap-4">
          <LayoutDashboard className="w-10 h-10 text-accent" />
          Admin <span className="gradient-text">Panel</span>
        </h1>
        <p className="text-text-secondary font-medium">
          Announce upcoming draws, execute them, and verify payouts.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Actions & Upcoming */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[2rem] p-6 border border-white/5"
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-gold" /> Announce Draw
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

              <button onClick={handleCreateDraw} disabled={creating} className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 disabled:opacity-50 transition-all">
                {creating ? 'Posting...' : 'Create Upcoming Draw'}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-[2rem] p-6 border border-white/5"
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-accent" /> Ready to Run
            </h2>
            {upcomingDraws.length === 0 ? (
              <p className="text-text-secondary text-sm">No upcoming draws. Create one above!</p>
            ) : (
              <div className="space-y-3">
                {upcomingDraws.map(draw => (
                  <div key={draw.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="font-bold text-white">{draw.title}</div>
                    <div className="text-xs text-gold mb-3">${draw.totalPrizePool.toLocaleString()}</div>
                    <button onClick={() => handleRunDraw(draw.id)} className="w-full py-2 rounded-lg bg-gradient-to-r from-accent to-gold text-bg-primary font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm shadow-[0_0_15px_rgba(163,230,53,0.2)]">
                      <Play className="w-4 h-4 fill-current" /> Execute Draw
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Pending Verifications & Past Draws */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Pending Verifications */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-text-secondary" /> Pending Verifications
            </h2>

            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : pendingVerifications.length === 0 ? (
              <div className="glass-card rounded-[2rem] p-12 text-center border border-white/5">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
                <p className="text-text-secondary">There are no pending verifications at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingVerifications.map((winner) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={winner.id}
                    className="glass-card rounded-2xl p-6 border border-white/5"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white">{winner.user.name}</h3>
                            <p className="text-sm text-text-secondary">{winner.user.email}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-accent">${winner.prizeAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                            <p className="text-xs text-text-tertiary uppercase font-bold tracking-wider">{winner.matchType} Matches</p>
                          </div>
                        </div>
                        
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-2 mb-2 text-sm text-text-secondary font-medium">
                            <ImageIcon className="w-4 h-4" /> Proof Uploaded
                          </div>
                          <a 
                            href={`http://localhost:5000${winner.proofImage}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-accent text-sm hover:underline"
                          >
                            View Image
                          </a>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-row md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                        <button
                          onClick={() => handleStatusUpdate(winner.id, 'APPROVED')}
                          className="flex-1 py-2 px-4 rounded-xl bg-success/10 text-success border border-success/30 hover:bg-success hover:text-white font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(winner.id, 'PAID')}
                          className="flex-1 py-2 px-4 rounded-xl bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-white font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <DollarSign className="w-4 h-4" /> Mark Paid
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(winner.id, 'REJECTED')}
                          className="flex-1 py-2 px-4 rounded-xl bg-error/10 text-error border border-error/30 hover:bg-error hover:text-white font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Past Draws */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-text-secondary" /> Recent Draws
            </h2>

            <div className="glass-card rounded-[2rem] p-1 border border-white/5 overflow-hidden">
              {pastDraws.length === 0 ? (
                <div className="p-8 text-center text-text-secondary">No recent draws found.</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {pastDraws.map((draw) => (
                    <div key={draw.id} className="p-5 hover:bg-white/5 transition-colors">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-white text-lg">
                          {draw.title || new Date(draw.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <span className="text-sm text-text-secondary font-medium">
                          Prize Pool: <span className="text-gold">${draw.totalPrizePool.toLocaleString()}</span>
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
                          {draw.status}
                        </span>
                      </div>

                      <div className="text-xs text-text-secondary bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-white font-semibold">{draw.winners?.length || 0}</span> winners found. 
                        {(draw.winners?.length || 0) > 0 && (
                          <div className="mt-2 text-text-tertiary flex gap-2 overflow-x-auto pb-1">
                            {draw.winners.map(w => (
                              <span key={w.id} className="bg-white/10 px-2 py-1 rounded whitespace-nowrap">
                                {w.user?.name || 'User'} - {w.matchType} Matches
                              </span>
                            ))}
                          </div>
                        )}
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
