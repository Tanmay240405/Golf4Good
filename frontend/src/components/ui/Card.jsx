import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export default function Card({
  children,
  className = '',
  hover = true,
  padding = 'p-6',
  ...props
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      className={cn(
        hover ? 'glass-card' : 'glass-card-static',
        padding,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
