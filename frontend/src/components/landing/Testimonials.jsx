import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, X } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedSection from '../ui/AnimatedSection';
import { testimonialService } from '../../services/testimonialService';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Responsive visibleCount
  const [visibleCount, setVisibleCount] = useState(2);

  // Modal states for writing own feedback
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Monitor window width to adjust visibleCount
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else {
        setVisibleCount(2);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch testimonials from database
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await testimonialService.getTestimonials();
      if (res.success) {
        setTestimonialsList(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
      toast.error('Failed to load testimonials from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const maxIndex = Math.max(0, testimonialsList.length - visibleCount);

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  // Constrain currentIndex when testimonialsList changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [testimonialsList.length]);

  // Submit feedback to database
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.length < 10) {
      toast.error('Feedback must be at least 10 characters long');
      return;
    }

    try {
      setSubmitting(true);
      
      // Generate initials for avatar
      const avatar = name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'G';

      const res = await testimonialService.createTestimonial({
        name,
        role,
        content,
        rating,
        avatar,
      });

      if (res.success) {
        toast.success('Thank you for your feedback!');
        setIsModalOpen(false);
        // Reset form
        setName('');
        setRole('');
        setContent('');
        setRating(5);
        // Refresh testimonials from database
        await fetchTestimonials();
      }
    } catch (err) {
      console.error('Failed to save testimonial:', err);
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Left aligned container to match Hero and Steps sections */}
      <div className="relative z-10 h-full flex flex-col items-start justify-center px-8 md:px-16 lg:px-24 w-full">
        <div className="flex flex-col w-full max-w-[880px]">
          
          <AnimatedSection className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6 w-full">
            <div>
              <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Testimonials
              </p>
              <h2 className="text-3xl md:text-5xl font-bold gradient-text-white">
                Loved by golfers
                <br />
                around the world
              </h2>
            </div>
            
            {/* Header Action & Navigation Controls */}
            <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-hover text-bg-primary font-bold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.25)] hover:shadow-[0_0_35px_rgba(251,191,36,0.5)] flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                Share Feedback
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  disabled={currentIndex === 0}
                  className="w-10 h-10 rounded-xl bg-bg-elevated/80 border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:border-accent hover:text-bg-primary transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none cursor-pointer shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  disabled={currentIndex >= maxIndex}
                  className="w-10 h-10 rounded-xl bg-bg-elevated/80 border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:border-accent hover:text-bg-primary transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none cursor-pointer shadow-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* Testimonial cards wrapper with horizontal scroll/carousel */}
          <div className="overflow-hidden w-full">
            {loading ? (
              <div className="flex gap-6 w-full">
                {[1, 2].map((i) => (
                  <div key={i} className="flex-shrink-0 w-full md:w-[calc(50%-12px)] h-[280px] glass-card p-6 animate-pulse flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <div key={s} className="w-4 h-4 rounded-full bg-border" />
                        ))}
                      </div>
                      <div className="w-3/4 h-4 bg-border rounded" />
                      <div className="w-5/6 h-4 bg-border rounded" />
                      <div className="w-2/3 h-4 bg-border rounded" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-border" />
                      <div className="space-y-2 flex-1">
                        <div className="w-1/3 h-3 bg-border rounded" />
                        <div className="w-1/2 h-2.5 bg-border rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : testimonialsList.length === 0 ? (
              <div className="glass-card p-10 text-center w-full">
                <p className="text-text-secondary mb-4">No feedback shared yet. Be the first to write one!</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-hover text-bg-primary font-bold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.25)] hover:shadow-[0_0_35px_rgba(251,191,36,0.5)] cursor-pointer hover:scale-105 active:scale-95"
                >
                  Write Testimonial
                </button>
              </div>
            ) : (
              <motion.div
                animate={{ x: `-${currentIndex * (100 / visibleCount)}%` }}
                transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                className="flex gap-6 w-full"
              >
                {testimonialsList.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex-shrink-0 w-full md:w-[calc(50%-12px)]"
                  >
                    <div className="glass-card p-6 h-full flex flex-col justify-between min-h-[280px]">
                      <div>
                        {/* Quote icon */}
                        <Quote className="w-8 h-8 text-accent/20 mb-4" />

                        {/* Stars */}
                        <div className="flex items-center gap-1 mb-4">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-gold fill-gold"
                            />
                          ))}
                        </div>

                        {/* Content */}
                        <p className="text-sm text-text-secondary leading-relaxed mb-6">
                          "{testimonial.content}"
                        </p>
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center gap-3 pt-4 border-t border-border mt-auto">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-gold flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-white">
                            {testimonial.avatar}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {testimonial.name}
                          </p>
                          <p className="text-xs text-text-tertiary truncate">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Dots indicator (mobile) */}
          {testimonialsList.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-8 md:hidden">
              {testimonialsList.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-accent w-6' : 'bg-text-muted'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Write Feedback Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div 
              className="absolute inset-0" 
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-lg p-8 relative overflow-hidden z-10"
            >
              {/* Glowing spot background */}
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-accent/10 blur-[60px] pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-2xl font-bold text-white">Share Your Experience</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Mitchell"
                    className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-border text-white focus:outline-none focus:border-accent transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">Your Role / Location</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Amateur Golfer, New York"
                    className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-border text-white focus:outline-none focus:border-accent transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setRating(val)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            val <= rating ? 'text-gold fill-gold' : 'text-text-muted hover:text-gold/50'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">Your Feedback</label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tell us what you think about Golf4Good..."
                    className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-border text-white focus:outline-none focus:border-accent transition-all text-sm resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-light text-bg-primary font-bold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(163,230,53,0.25)] hover:shadow-[0_0_35px_rgba(163,230,53,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 active:scale-98"
                  >
                    {submitting ? 'Saving Feedback...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
