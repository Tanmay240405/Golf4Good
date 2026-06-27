import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Globe, Calendar as CalendarIcon, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { charityService } from '../services/charityService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function CharityProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [charity, setCharity] = useState(null);
  const [percentage, setPercentage] = useState(user?.donationPercentage || 10);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCharity();
  }, [id]);

  const loadCharity = async () => {
    try {
      const response = await charityService.getCharityById(id);
      if (response.success) {
        setCharity(response.data);
      }
    } catch (error) {
      toast.error('Failed to load charity details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await charityService.selectCharity(id, parseInt(percentage));
      if (response.success) {
        toast.success('Donation settings updated!');
        updateUser(response.data);
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!window.confirm('Are you sure you want to remove your support for this charity?')) return;
    setIsSaving(true);
    try {
      const response = await charityService.unsubscribeCharity();
      if (response.success) {
        toast.success('Successfully removed support');
        updateUser(response.data);
      }
    } catch (error) {
      toast.error('Failed to remove support');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!charity) return <div className="text-white text-center py-20">Charity not found</div>;

  const isCurrentSelection = user?.selectedCharityId === charity.id;

  return (
    <div className="flex flex-col w-full relative z-10 pb-20 max-w-4xl mx-auto">
      <Link to="/dashboard/charity" className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Charities
      </Link>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 mb-8"
      >
        <div className="h-64 md:h-80 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent z-10" />
          <img 
            src={charity.coverImage || 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=1200&h=600'} 
            alt={charity.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 px-6 pb-8 md:px-10 -mt-16">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl font-bold text-white">{charity.name}</h1>
                {isCurrentSelection && (
                  <span className="bg-[#f472b6]/20 text-[#f472b6] text-xs font-bold px-3 py-1 rounded-full border border-[#f472b6]/30 uppercase tracking-wider flex items-center gap-1">
                    <Check className="w-3 h-3" /> Selected
                  </span>
                )}
              </div>
              {charity.website && (
                <a href={charity.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-accent hover:underline text-sm font-medium">
                  <Globe className="w-4 h-4" />
                  Visit Website
                </a>
              )}
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-text-secondary text-lg leading-relaxed">
              {charity.description}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Donation Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 glass-card rounded-[2rem] p-8 border border-white/5"
        >
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-6 h-6 text-[#f472b6] fill-[#f472b6]" />
            <h2 className="text-2xl font-bold text-white">Your Contribution</h2>
          </div>
          
          <p className="text-text-secondary mb-8">
            Choose what percentage of your Golf4Good winnings will be automatically donated to {charity.name}.
          </p>

          <div className="mb-10">
            <div className="flex justify-between items-end mb-4">
              <span className="text-text-tertiary font-medium uppercase tracking-wide text-sm">Donation Amount</span>
              <span className="text-5xl font-bold text-white tracking-tight">{percentage}%</span>
            </div>
            
            <div className="relative pt-6 pb-2">
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#f472b6] hover:accent-[#db2777] transition-all"
              />
              <div className="flex justify-between mt-3 text-xs text-text-muted font-medium">
                <span>10% (Min)</span>
                <span>50%</span>
                <span>100% (Max)</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#db2777] text-white font-bold text-lg shadow-lg shadow-[#f472b6]/20 hover:shadow-[#f472b6]/40 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Save Support Settings <ArrowRight className="w-5 h-5" /></>
            )}
          </button>

          {isCurrentSelection && (
            <button 
              onClick={handleUnsubscribe}
              disabled={isSaving}
              className="w-full mt-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-error/10 hover:text-error hover:border-error/30 transition-all disabled:opacity-50 flex justify-center items-center"
            >
              Remove Support
            </button>
          )}
        </motion.div>

        {/* Sidebar Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          <div className="glass-card rounded-[2rem] p-6 border border-white/5 bg-[rgba(10,15,20,0.6)] text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f472b6]/10 to-transparent pointer-events-none" />
            <p className="text-text-secondary text-sm mb-2 relative z-10">Total Raised on Golf4Good</p>
            <p className="text-3xl font-bold text-white relative z-10">
              ${(charity.donationTotal || 0).toLocaleString()}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
