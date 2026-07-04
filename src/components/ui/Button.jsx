import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}, ref) => {
  const baseStyles = [
    'inline-flex items-center justify-center font-semibold tracking-tight',
    'transition-all duration-[200ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none',
    'select-none will-change-transform',
  ].join(' ');

  const variants = {
    primary: [
      // Gradient gives it depth instead of flat orange
      'bg-gradient-to-b from-[#FBBF24] to-[#F59E0B] text-white',
      'shadow-[0_2px_10px_rgba(245,158,11,0.40),0_1px_3px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.18)]',
      'border border-[rgba(180,100,0,0.15)]',
      'hover:from-[#F9B422] hover:to-[#D97706]',
      'hover:shadow-[0_4px_18px_rgba(245,158,11,0.45),0_2px_6px_rgba(0,0,0,0.12)]',
      'hover:-translate-y-[2px]',
      'active:translate-y-0 active:shadow-[0_1px_4px_rgba(245,158,11,0.30)]',
      'active:from-[#F59E0B] active:to-[#D97706]',
    ].join(' '),

    secondary: [
      'bg-[#FFF8EE] text-primary border border-primary/25',
      'shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
      'hover:bg-[#FFF3DC] hover:border-primary/45 hover:-translate-y-[1px]',
      'hover:shadow-[0_2px_10px_rgba(245,158,11,0.14)]',
      'active:translate-y-0',
    ].join(' '),

    outline: [
      'border border-[rgba(0,0,0,0.10)] bg-white text-text-main',
      'shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
      'hover:border-[rgba(245,158,11,0.35)] hover:bg-[rgba(245,158,11,0.03)] hover:text-primary',
      'hover:-translate-y-[1px] hover:shadow-[0_2px_10px_rgba(0,0,0,0.06)]',
      'active:translate-y-0 active:shadow-none',
    ].join(' '),

    ghost: [
      'bg-transparent text-text-secondary',
      'hover:bg-[rgba(245,158,11,0.07)] hover:text-primary',
      'active:bg-[rgba(245,158,11,0.12)]',
    ].join(' '),

    danger: [
      'bg-gradient-to-b from-red-500 to-[#EF4444] text-white',
      'shadow-[0_2px_10px_rgba(239,68,68,0.32),0_1px_3px_rgba(0,0,0,0.10)]',
      'border border-[rgba(180,0,0,0.12)]',
      'hover:from-red-400 hover:to-red-600',
      'hover:shadow-[0_4px_16px_rgba(239,68,68,0.38)] hover:-translate-y-[1px]',
      'active:translate-y-0',
    ].join(' '),
  };

  const sizes = {
    sm:   'text-[12.5px] px-4 py-[7px] rounded-[12px] gap-1.5',
    md:   'text-[13.5px] px-5 py-[10px] rounded-btn gap-2',
    lg:   'text-[14.5px] px-7 py-3 rounded-btn gap-2.5',
    icon: 'p-2.5 rounded-btn',
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: isLoading || props.disabled ? 1 : 1.010 }}
      whileTap={{ scale: isLoading || props.disabled ? 1 : 0.976 }}
      transition={{ type: 'spring', stiffness: 520, damping: 28 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-current shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0 flex items-center transition-transform duration-150 group-hover:scale-105">{leftIcon}</span>
      ) : null}

      <span>{children}</span>

      {!isLoading && rightIcon && (
        <span className="shrink-0 flex items-center transition-transform duration-150 group-hover:translate-x-0.5">{rightIcon}</span>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
