import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Card = React.forwardRef(({
  className,
  variant = 'default',
  hover = false,
  children,
  ...props
}, ref) => {
  const baseStyles = 'rounded-card overflow-hidden transition-all duration-300 ease-out';

  const variants = {
    default: [
      'bg-white',
      'border border-border',
      'shadow-soft',
    ].join(' '),

    glass: [
      'border border-[rgba(255,248,242,0.6)]',
      'shadow-soft',
    ].join(' ') + ' glass-panel',

    flat: 'bg-secondary border border-border',

    primary: 'bg-primary text-white shadow-btn-primary border-none',
  };

  const hoverStyles = hover
    ? 'hover:shadow-glow hover:-translate-y-[3px] hover:border-[rgba(245,158,11,0.15)] cursor-pointer'
    : '';

  return (
    <motion.div
      ref={ref}
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

export default Card;
