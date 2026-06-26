import { cn } from '../../utils/helpers';

const variants = {
  accent: 'bg-accent/10 text-accent border-accent/20',
  gold: 'bg-gold/10 text-gold border-gold/20',
  success: 'bg-success/10 text-success border-success/20',
  error: 'bg-error/10 text-error border-error/20',
  neutral: 'bg-white/5 text-text-secondary border-white/10',
};

export default function Badge({
  children,
  variant = 'accent',
  className = '',
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
