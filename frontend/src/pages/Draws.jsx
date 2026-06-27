import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle, Clock, XCircle, Upload, DollarSign, ChevronRight, Hash } from 'lucide-react';
import { drawService } from '../services/drawService';
import toast from 'react-hot-toast';

export default function Draws() {
  const [winnings, setWinnings] = useState([]);
  const [history, setHistory] = useState([]);
  const [upcomingDraws, setUpcomingDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWinning, setSelectedWinning] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [winningsRes, historyRes, upcomingRes, subRes] = await Promise.all([
        drawService.getMyWinnings(),
        drawService.getDrawHistory(),
        drawService.getUpcomingDraws(),
        import('../services/subscriptionService').then(m => m.subscriptionService.getCurrentSubscription().catch(() => null))
      ]);
      setWinnings(winningsRes.winnings || []);
      setHistory(historyRes.draws || []);
      setUpcomingDraws(upcomingRes.draws || []);
      if (subRes && subRes.success) {
        setSubscription(subRes.data);
      }
    } catch (error) {
      toast.error('Failed to load draws data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isPro = subscription?.status === 'ACTIVE';

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (winningId) => {
    if (!file) {
      toast.error('Please select an image file first');
      return;
    }
    
    try {
      setUploading(true);
      await drawService.uploadProof(winningId, file);
      toast.success('Proof uploaded successfully!');
      setFile(null);
      setSelectedWinning(null);
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Failed to upload proof');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PAID':
        return { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Paid' };
      case 'PENDING':
        return { icon: Clock, color: 'text-gold', bg: 'bg-gold/10', label: 'Pending Review' };
      case 'REJECTED':
        return { icon: XCircle, color: 'text-error', bg: 'bg-error/10', label: 'Rejected' };
      default:
        return { icon: Clock, color: 'text-text-muted', bg: 'bg-white/5', label: status };
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
          <Trophy className="w-10 h-10 text-gold" />
          My <span className="gradient-text">Winnings</span>
        </h1>
        <p className="text-text-secondary font-medium">
          Check your draw results, upload proof, and view payout status.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !isPro ? (
        <div className="flex flex-col items-center justify-center h-96 glass-card rounded-[2rem] border border-white/5 text-center p-8">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
            <Trophy className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Pro Feature</h2>
          <p className="text-lg text-text-secondary mb-8 max-w-md">
            Subscribe to Pro to participate in our monthly prize draws and support charities with your golf scores.
          </p>
          <a href="/dashboard/subscription" className="px-8 py-3 rounded-xl bg-accent hover:bg-accent-light text-bg-primary font-bold text-lg transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:scale-105 active:scale-95">
            Upgrade to Pro
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: My Winnings */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-accent" /> Recent Winnings
            </h2>

            {winnings.length === 0 ? (
              <div className="glass-card rounded-[2rem] p-8 text-center border border-white/5">
                <Trophy className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-2">No winnings yet</h3>
                <p className="text-text-secondary">Keep playing and your luck will shine!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {winnings.map((winning, idx) => {
                  const statusConf = getStatusConfig(winning.status);
                  const StatusIcon = statusConf.icon;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={winning.id}
                      className="glass-card rounded-2xl p-5 border border-white/5 hover:border-accent/30 transition-colors group cursor-pointer"
                      onClick={() => winning.status !== 'PAID' && setSelectedWinning(selectedWinning === winning.id ? null : winning.id)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-xs text-text-tertiary mb-1">
                            {new Date(winning.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Draw
                          </div>
                          <div className="text-3xl font-bold text-white tracking-tight flex items-center gap-1">
                            <span className="text-accent">$</span>
                            {winning.prizeAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold ${statusConf.bg} ${statusConf.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConf.label}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-text-secondary border-t border-white/5 pt-4">
                        <div className="flex items-center gap-1.5">
                          <Hash className="w-4 h-4 text-text-muted" />
                          <span className="font-semibold text-white">{winning.matchType}</span> Matches
                        </div>
                      </div>

                      {/* Upload Proof Section Expanded */}
                      <AnimatePresence>
                        {selectedWinning === winning.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <h4 className="text-sm font-semibold text-white mb-2">Upload Verification Screenshot</h4>
                              <p className="text-xs text-text-tertiary mb-4">
                                Please upload a screenshot of your ID and bank details to verify this payout.
                              </p>
                              
                              <div className="flex flex-col sm:flex-row gap-3">
                                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-white/20 hover:border-accent hover:bg-accent/5 transition-all text-sm font-medium text-text-secondary hover:text-white">
                                  <Upload className="w-4 h-4" />
                                  {file && selectedWinning === winning.id ? file.name : 'Select Image'}
                                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                                
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleUpload(winning.id); }}
                                  disabled={!file || uploading}
                                  className="py-2.5 px-6 rounded-xl bg-accent text-bg-primary font-bold hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                  {uploading ? 'Uploading...' : 'Submit Proof'}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Upcoming & History */}
          <div className="space-y-8">
            
            {/* Upcoming Draws */}
            {upcomingDraws.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Clock className="w-6 h-6 text-accent" /> Upcoming Draws
                </h2>
                <div className="space-y-3">
                  {upcomingDraws.map(draw => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={draw.id} 
                      className="glass-card rounded-2xl p-5 border border-accent/20 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Trophy className="w-16 h-16 text-accent" />
                      </div>
                      <div className="relative z-10">
                        <div className="text-xs font-bold text-accent uppercase tracking-wider mb-1">Coming Soon</div>
                        <h3 className="text-xl font-bold text-white mb-2">{draw.title}</h3>
                        <div className="flex items-center gap-4 text-sm font-medium">
                          <span className="text-gold flex items-center gap-1"><DollarSign className="w-4 h-4" />{draw.totalPrizePool.toLocaleString()} Pool</span>
                          <span className="text-text-secondary">{new Date(draw.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Draw History */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Clock className="w-6 h-6 text-text-secondary" /> Past Draws
              </h2>

              <div className="glass-card rounded-[2rem] p-1 border border-white/5 overflow-hidden">
                {history.length === 0 ? (
                  <div className="p-8 text-center text-text-secondary">No previous draws found.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {history.map((draw) => (
                      <div key={draw.id} className="p-5 hover:bg-white/5 transition-colors">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-white text-lg">
                            {draw.title || new Date(draw.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                          <span className="text-sm text-text-secondary font-medium">
                            Prize Pool: <span className="text-gold">${draw.totalPrizePool.toLocaleString()}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-text-tertiary uppercase tracking-wider font-bold">Winning Numbers</span>
                          <div className="flex gap-1.5 ml-2">
                            {draw.winningNumbers.map((num, i) => (
                              <div key={i} className="w-7 h-7 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-xs font-bold text-accent">
                                {num}
                              </div>
                            ))}
                          </div>
                        </div>

                        {draw.winners && draw.winners.length > 0 && (
                          <div className="text-xs text-text-secondary">
                            <span className="text-white font-semibold">{draw.winners.length}</span> winners this month.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
