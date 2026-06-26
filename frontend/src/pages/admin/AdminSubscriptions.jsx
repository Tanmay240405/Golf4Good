import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const data = await adminService.getSubscriptions();
      setSubscriptions(data.subscriptions || []);
    } catch (error) {
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminService.updateSubscription(id, status);
      toast.success(`Subscription marked as ${status}`);
      fetchSubscriptions();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Manage Subscriptions</h1>
        <p className="text-text-secondary">View and moderate user subscriptions.</p>
      </div>

      <div className="glass-card rounded-[2rem] border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
             <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">User</th>
                  <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Plan</th>
                  <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Created</th>
                  <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {subscriptions.length > 0 ? (
                  subscriptions.map(sub => (
                    <motion.tr 
                      key={sub.id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="font-medium text-white">{sub.user?.name || 'Unknown User'}</div>
                        <div className="text-xs text-text-secondary">{sub.user?.email || ''}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-gold">{sub.plan}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          sub.status === 'ACTIVE' ? 'bg-success/20 text-success border border-success/30' : 
                          sub.status === 'CANCELLED' ? 'bg-error/20 text-error border border-error/30' :
                          'bg-white/10 text-white border border-white/10'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-4 text-text-secondary text-sm">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {sub.status !== 'ACTIVE' && (
                          <button 
                            onClick={() => handleStatusUpdate(sub.id, 'ACTIVE')}
                            className="p-2 bg-success/10 hover:bg-success/20 rounded-lg text-success transition-colors flex items-center gap-2 text-sm font-bold"
                          >
                            <CheckCircle className="w-4 h-4" /> Activate
                          </button>
                        )}
                        {sub.status !== 'CANCELLED' && (
                          <button 
                            onClick={() => handleStatusUpdate(sub.id, 'CANCELLED')}
                            className="p-2 bg-error/10 hover:bg-error/20 rounded-lg text-error transition-colors flex items-center gap-2 text-sm font-bold"
                          >
                            <XCircle className="w-4 h-4" /> Cancel
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-text-muted">No subscriptions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
