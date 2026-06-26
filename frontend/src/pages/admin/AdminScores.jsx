import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, Calendar } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const data = await adminService.getScores();
      setScores(data.scores || []);
    } catch (error) {
      toast.error('Failed to load scores');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this score?')) return;
    try {
      await adminService.deleteScore(id);
      toast.success('Score deleted successfully');
      fetchScores();
    } catch (error) {
      toast.error('Failed to delete score');
    }
  };

  const filteredScores = scores.filter(score => 
    score.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
    score.course?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Scores</h1>
          <p className="text-text-secondary">View and moderate user submitted scores.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search by user or course..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>
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
                  <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Score</th>
                  <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Course</th>
                  <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredScores.length > 0 ? (
                  filteredScores.map(score => (
                    <motion.tr 
                      key={score.id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="font-medium text-white">{score.user?.name || 'Unknown User'}</div>
                        <div className="text-xs text-text-secondary">{score.user?.email || ''}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-accent/10 text-accent font-bold rounded border border-accent/20">
                          {score.score} pts
                        </span>
                      </td>
                      <td className="p-4 text-white">{score.course}</td>
                      <td className="p-4 text-text-secondary text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> {new Date(score.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDelete(score.id)}
                          className="p-2 bg-error/10 hover:bg-error/20 rounded-lg text-error transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete Score"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-text-muted">No scores found.</td>
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
