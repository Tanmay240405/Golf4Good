import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { charityService } from '../services/charityService';
import toast from 'react-hot-toast';

export default function Charity() {
  const [charities, setCharities] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCharities();
  }, []);

  const loadCharities = async () => {
    try {
      const [response, subRes] = await Promise.all([
        charityService.getCharities(),
        import('../services/subscriptionService').then(m => m.subscriptionService.getCurrentSubscription().catch(() => null))
      ]);
      
      if (response.success) {
        setCharities(response.data);
      }
      
      if (subRes && subRes.success) {
        setSubscription(subRes.data);
      }
    } catch (error) {
      toast.error('Failed to load charities');
    } finally {
      setIsLoading(false);
    }
  };

  const isPro = subscription?.status === 'ACTIVE';

  return (
    <div className="flex flex-col w-full relative z-10 pb-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Play for <span className="text-[#f472b6]">Good</span>
        </h1>
        <p className="text-text-secondary font-medium">
          Discover and support incredible causes through your golf journey.
        </p>
      </motion.div>

      {/* Charities Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !isPro ? (
        <div className="flex flex-col items-center justify-center h-96 glass-card rounded-[2rem] border border-white/5 text-center p-8">
          <div className="w-16 h-16 rounded-full bg-[#f472b6]/10 flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-[#f472b6] fill-[#f472b6]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Pro Feature</h2>
          <p className="text-lg text-text-secondary mb-8 max-w-md">
            Subscribe to Pro to choose a charity and start making an impact with your golf scores.
          </p>
          <a href="/dashboard/subscription" className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#db2777] text-white font-bold text-lg transition-all shadow-[0_0_20px_rgba(244,114,182,0.3)] hover:scale-105 active:scale-95">
            Upgrade to Pro
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charities.map((charity, index) => (
            <motion.div
              key={charity.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="glass-card rounded-[2rem] overflow-hidden group border border-white/5 hover:border-[#f472b6]/30 transition-all duration-300 bg-[rgba(10,15,20,0.65)]"
            >
              <div className="h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent z-10" />
                <img 
                  src={charity.coverImage || 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=800&h=600'} 
                  alt={charity.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              <div className="p-6 relative z-20">
                <h3 className="text-xl font-bold text-white mb-2">{charity.name}</h3>
                <p className="text-text-secondary text-sm line-clamp-2 mb-6">
                  {charity.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#f472b6]">
                    <Heart className="w-4 h-4 fill-[#f472b6]" />
                    <span>${(charity.donationTotal || 0).toLocaleString()} raised</span>
                  </div>
                  
                  <Link 
                    to={`/dashboard/charity/${charity.id}`}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-[#f472b6] group-hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
          
          {charities.length === 0 && (
            <div className="col-span-full py-20 text-center text-text-muted">
              No charities found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
