import React from 'react';
import { cn } from '../../utils/cn';

export default function Badge({
  children,
  variant = 'primary',
  className
}) {
  const baseStyles = 'inline-flex items-center gap-1 px-2.5 py-[4px] rounded-full text-[11px] font-semibold tracking-wide leading-none';

  const variants = {
    primary: 'bg-primary/[0.09] text-primary',
    secondary: 'bg-[rgba(0,0,0,0.05)] text-text-secondary',
    success: 'bg-success/[0.09] text-success',
    danger: 'bg-danger/[0.09] text-danger',
    outline: 'border border-[rgba(0,0,0,0.10)] text-text-secondary bg-transparent',
    warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200/50',
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
}
