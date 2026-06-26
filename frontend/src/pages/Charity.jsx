import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { charityService } from '../services/charityService';
import toast from 'react-hot-toast';

export default function Charity() {
  const [charities, setCharities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCharities();
  }, []);

  const loadCharities = async () => {
    try {
      const response = await charityService.getCharities();
      if (response.success) {
        setCharities(response.data);
      }
    } catch (error) {
      toast.error('Failed to load charities');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Search and Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search charities..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-white hover:bg-white/10 transition-colors">
          <Filter className="w-5 h-5" />
          <span>Filter</span>
        </button>
      </motion.div>

      {/* Charities Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharities.map((charity, index) => (
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
                  src={charity.coverImage || `https://source.unsplash.com/random/800x600/?charity,hope,${index}`} 
                  alt={charity.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {charity.logo && (
                  <div className="absolute bottom-4 left-6 z-20 w-16 h-16 rounded-2xl bg-white p-2 shadow-xl">
                    <img src={charity.logo} alt="logo" className="w-full h-full object-contain" />
                  </div>
                )}
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
          
          {filteredCharities.length === 0 && (
            <div className="col-span-full py-20 text-center text-text-muted">
              No charities found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
