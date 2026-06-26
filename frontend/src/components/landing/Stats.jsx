import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Trophy, Heart, DollarSign } from 'lucide-react';
import { formatNumber, formatCurrency } from '../../utils/helpers';

const stats = [
  {
    icon: Users,
    value: 12500,
    label: 'Active Players',
    prefix: '',
    suffix: '+',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: Trophy,
    value: 340,
    label: 'Monthly Winners',
    prefix: '',
    suffix: '+',
    color: 'text-gold',
    bgColor: 'bg-gold/10',
  },
  {
    icon: Heart,
    value: 85,
    label: 'Charities Supported',
    prefix: '',
    suffix: '+',
    color: 'text-[#f472b6]',
    bgColor: 'bg-[#f472b6]/10',
  },
  {
    icon: DollarSign,
    value: 2400000,
    label: 'Donated to Causes',
    prefix: '$',
    suffix: '',
    color: 'text-success',
    bgColor: 'bg-success/10',
    isCurrency: true,
  },
];

function AnimatedCounter({ value, prefix = '', suffix = '', isCurrency = false }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      className="text-3xl md:text-4xl font-bold text-text-primary"
    >
      {prefix}
      {isInView ? (
        <motion.span>
          {isCurrency ? `${(value / 1000000).toFixed(1)}M` : formatNumber(value)}
        </motion.span>
      ) : (
        '0'
      )}
      {suffix}
    </motion.span>
  );
}

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
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                isCurrency={stat.isCurrency}
              />
              <p className="text-sm text-text-tertiary mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
