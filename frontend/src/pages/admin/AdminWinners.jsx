import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, DollarSign, Image as ImageIcon, Award } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminWinners() {
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      const data = await adminService.getPendingWinners();
      setPendingVerifications(data.pendingWinners || []);
    } catch (error) {
      toast.error('Failed to load pending winners');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminService.updateWinnerStatus(id, status);
      toast.success(`Winner marked as ${status}`);
      fetchWinners();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Winner Verifications</h1>
        <p className="text-text-secondary">Approve proofs, reject invalid claims, and mark payouts as completed.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : pendingVerifications.length === 0 ? (
        <div className="glass-card rounded-[2rem] p-16 text-center border border-white/5">
          <Award className="w-16 h-16 text-success mx-auto mb-6 opacity-50" />
          <h3 className="text-2xl font-bold text-white mb-2">All Caught Up!</h3>
          <p className="text-text-secondary text-lg">There are no pending verifications at the moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingVerifications.map((winner) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={winner.id}
              className="glass-card rounded-[2rem] p-6 md:p-8 border border-white/5 overflow-hidden relative group hover:border-white/20 transition-all duration-300 shadow-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-[100px] pointer-events-none group-hover:bg-accent/10 transition-colors" />
              
              <div className="flex flex-col md:flex-row gap-8 relative z-10">
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{winner.user.name}</h3>
                      <p className="text-text-secondary">{winner.user.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gold">${winner.prizeAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                      <p className="text-xs text-text-tertiary uppercase font-bold tracking-wider mt-1">{winner.matchType} Matches Found</p>
                    </div>
                  </div>
                  
                  <div className="bg-bg-secondary rounded-2xl p-4 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-text-secondary font-medium">
                      <div className="p-2 bg-white/5 rounded-lg"><ImageIcon className="w-5 h-5" /></div> 
                      Proof Uploaded
                    </div>
                    <a 
                      href={`http://localhost:5000${winner.proofImage}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-accent/20 text-accent border border-accent/30 rounded-xl hover:bg-accent hover:text-bg-primary font-bold transition-all text-sm whitespace-nowrap"
                    >
                      View Image
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 justify-center min-w-[160px] md:pl-8 md:border-l border-white/10 pt-6 md:pt-0 border-t md:border-t-0">
                  <button
                    onClick={() => handleStatusUpdate(winner.id, 'APPROVED')}
                    className="w-full py-3 px-4 rounded-xl bg-success/10 text-success border border-success/30 hover:bg-success hover:text-white font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" /> Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(winner.id, 'PAID')}
                    className="w-full py-3 px-4 rounded-xl bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-white font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <DollarSign className="w-5 h-5" /> Mark Paid
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(winner.id, 'REJECTED')}
                    className="w-full py-3 px-4 rounded-xl bg-error/10 text-error border border-error/30 hover:bg-error hover:text-white font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" /> Reject
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
