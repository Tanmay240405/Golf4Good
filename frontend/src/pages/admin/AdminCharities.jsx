import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminCharities() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', description: '', logo: '', coverImage: '', website: '' });

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const data = await adminService.getCharities();
      setCharities(data.data || []);
    } catch (error) {
      toast.error('Failed to load charities');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (charity = null) => {
    if (charity) {
      setFormData(charity);
    } else {
      setFormData({ id: null, name: '', description: '', logo: '', coverImage: '', website: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await adminService.updateCharity(formData.id, formData);
        toast.success('Charity updated successfully');
      } else {
        await adminService.createCharity(formData);
        toast.success('Charity created successfully');
      }
      handleCloseModal();
      fetchCharities();
    } catch (error) {
      toast.error('Failed to save charity');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this charity?')) return;
    try {
      await adminService.deleteCharity(id);
      toast.success('Charity deleted successfully');
      fetchCharities();
    } catch (error) {
      toast.error('Failed to delete charity');
    }
  };

  const filteredCharities = charities.filter(charity => 
    charity.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Charities</h1>
          <p className="text-text-secondary">Add, edit, and remove supported charities.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search charities..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-gold text-bg-primary font-bold rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap shadow-[0_0_15px_rgba(163,230,53,0.3)]"
          >
            <Plus className="w-5 h-5" /> Add Charity
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 flex justify-center">
             <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredCharities.length > 0 ? (
          filteredCharities.map(charity => (
            <motion.div 
              key={charity.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-[2rem] border border-white/5 overflow-hidden flex flex-col group hover:border-white/20 transition-all duration-300"
            >
              <div className="h-40 bg-white/5 relative overflow-hidden flex items-center justify-center">
                {charity.coverImage ? (
                  <img src={charity.coverImage} alt={charity.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-white/10" />
                )}
                {charity.logo && (
                  <div className="absolute bottom-4 left-4 w-16 h-16 rounded-xl overflow-hidden border-2 border-bg-primary bg-bg-secondary">
                    <img src={charity.logo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => handleOpenModal(charity)} className="p-2 bg-black/50 backdrop-blur-md text-white rounded-lg hover:bg-accent hover:text-bg-primary transition-colors">
                     <Edit className="w-4 h-4" />
                   </button>
                   <button onClick={() => handleDelete(charity.id)} className="p-2 bg-black/50 backdrop-blur-md text-white rounded-lg hover:bg-error transition-colors">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2">{charity.name}</h3>
                <p className="text-text-secondary text-sm line-clamp-3 mb-4 flex-1">{charity.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-tertiary">Donations: <span className="text-gold font-bold">${charity.donationTotal.toLocaleString()}</span></span>
                  {charity.website && (
                    <a href={charity.website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Website</a>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-text-muted">No charities found.</div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-bg-secondary border border-white/10 rounded-[2rem] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h2 className="text-2xl font-bold text-white">{formData.id ? 'Edit Charity' : 'Add New Charity'}</h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-white/10 rounded-lg text-text-secondary hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-1">Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-1">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent custom-scrollbar" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-1">Logo URL</label>
                    <input type="url" value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-1">Cover Image URL</label>
                    <input type="url" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-1">Website</label>
                  <input type="url" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent" />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={handleCloseModal} className="px-6 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-gold text-bg-primary font-bold hover:opacity-90 transition-opacity">Save Charity</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
