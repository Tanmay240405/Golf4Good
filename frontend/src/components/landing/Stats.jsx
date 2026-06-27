import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Trophy, Heart, DollarSign } from 'lucide-react';

const stats = [
  {
    icon: Users,
    text: 'Growing',
    label: 'Community',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: Trophy,
    text: 'Regular',
    label: 'Winners',
    color: 'text-gold',
    bgColor: 'bg-gold/10',
  },
  {
    icon: Heart,
    text: 'Multiple',
    label: 'Charities Supported',
    color: 'text-[#f472b6]',
    bgColor: 'bg-[#f472b6]/10',
  },
  {
    icon: DollarSign,
    text: 'Impactful',
    label: 'Donations',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
];

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-20 relative" ref={ref}>
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card text-center p-6 md:p-8"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bgColor} mb-4`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-text-primary">
                {stat.text}
              </div>
              <p className="text-sm text-text-tertiary mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
