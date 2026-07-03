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
    'transition-all duration-200 ease-out',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
    'select-none',
  ].join(' ');

  const variants = {
    primary: [
      'bg-primary text-white',
      'shadow-btn-primary',
      'hover:bg-primary-hover hover:shadow-glow hover:-translate-y-px',
      'active:translate-y-0 active:shadow-btn-primary',
    ].join(' '),

    secondary: [
      'bg-secondary text-primary border border-primary/20',
      'hover:bg-primary/10 hover:border-primary/40 hover:-translate-y-px',
    ].join(' '),

    outline: [
      'border border-[rgba(0,0,0,0.12)] bg-white text-text-main',
      'hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:-translate-y-px',
      'shadow-soft',
    ].join(' '),

    ghost: [
      'bg-transparent text-text-secondary',
      'hover:bg-primary/8 hover:text-primary',
    ].join(' '),

    danger: [
      'bg-danger text-white',
      'shadow-[0_2px_8px_rgba(239,68,68,0.30)]',
      'hover:bg-red-600 hover:-translate-y-px',
    ].join(' '),
  };

  const sizes = {
    sm: 'text-[13px] px-3.5 py-1.5 rounded-[11px] gap-1.5',
    md: 'text-[14px] px-5 py-2.5 rounded-btn gap-2',
    lg: 'text-[15px] px-6 py-3 rounded-btn gap-2',
    icon: 'p-2.5 rounded-btn',
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: isLoading ? 1 : 1.015 }}
      whileTap={{ scale: isLoading ? 1 : 0.975 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
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
        <span className="shrink-0 flex items-center">{leftIcon}</span>
      ) : null}

      <span>{children}</span>

      {!isLoading && rightIcon && (
        <span className="shrink-0 flex items-center">{rightIcon}</span>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
