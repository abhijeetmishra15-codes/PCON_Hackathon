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
  const baseStyles = [
    'rounded-card overflow-hidden',
    'transition-[transform,box-shadow,border-color] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
    'will-change-transform',
  ].join(' ');

  const variants = {
    default: [
      'bg-gradient-to-br from-white via-white to-[#FAFAF8]',
      'border border-[rgba(0,0,0,0.052)]',
      'shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_20px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.030)]',
    ].join(' '),

    glass: [
      'border border-[rgba(255,248,242,0.50)]',
      'shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_20px_rgba(0,0,0,0.04)]',
    ].join(' ') + ' glass-panel',

    flat: 'bg-[#F5F0E8] border border-[rgba(0,0,0,0.05)]',

    primary: [
      'bg-gradient-to-br from-primary to-accent text-white border-none',
      'shadow-[0_2px_10px_rgba(245,158,11,0.40),0_1px_3px_rgba(0,0,0,0.10)]',
    ].join(' '),
  };

  const hoverStyles = hover ? [
    'cursor-pointer',
    'hover:shadow-[0_8px_28px_rgba(245,158,11,0.12),0_2px_8px_rgba(0,0,0,0.04),0_0_0_1px_rgba(245,158,11,0.09)]',
    'hover:-translate-y-[3px]',
    'hover:border-[rgba(245,158,11,0.11)]',
  ].join(' ') : '';

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
