import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Amateur Golfer, New York',
    content:
      "Golf4Good completely changed how I think about my weekend rounds. I'm not just playing for myself anymore — I'm playing for my local food bank. The monthly competitions keep me motivated, and the community is incredible.",
    rating: 5,
    avatar: 'SM',
  },
  {
    name: 'James Richardson',
    role: 'Club Captain, Austin Golf Club',
    content:
      "We enrolled our entire club on the Enterprise plan. The team dashboard and custom tournaments have transformed our member engagement. Plus, we've raised over $15,000 for local charities in just six months.",
    rating: 5,
    avatar: 'JR',
  },
  {
    name: 'Emily Chen',
    role: 'Pro Golfer & Charity Advocate',
    content:
      "As someone who's always looked for ways to combine golf with giving back, this platform is a dream. The analytics are top-notch, and the charitable impact tracking gives real transparency.",
    rating: 5,
    avatar: 'EC',
  },
  {
    name: 'Michael Torres',
    role: 'Weekend Golfer, San Diego',
    content:
      "I love that I can choose which charities receive my contributions. The Pro plan analytics helped me drop my handicap by 3 strokes, and I feel good knowing every round makes a difference.",
    rating: 5,
    avatar: 'MT',
  },
  {
    name: 'Lisa Park',
    role: 'Corporate Events Manager',
    content:
      "We used Golf4Good for our annual corporate charity tournament. The white-label options and custom reporting made it seamless. Our employees loved the competitive aspect and charitable tie-in.",
    rating: 5,
    avatar: 'LP',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const visibleCount = 3;
  const maxIndex = testimonials.length - visibleCount;

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden" ref={ref}>
      <div className="container-custom">
        <AnimatedSection className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div>
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-5xl font-bold gradient-text-white">
              Loved by golfers
              <br />
              around the world
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-hover transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              disabled={currentIndex >= maxIndex}
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-hover transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </AnimatedSection>

        {/* Testimonial cards */}
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: `-${currentIndex * (100 / visibleCount)}%` }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="flex gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-full md:w-[calc(33.333%-16px)]"
              >
                <div className="glass-card p-6 h-full flex flex-col">
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
                  <p className="text-sm text-text-secondary leading-relaxed flex-1 mb-6">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-gold flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Dots indicator (mobile) */}
        <div className="flex items-center justify-center gap-2 mt-8 md:hidden">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-accent w-6' : 'bg-text-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
