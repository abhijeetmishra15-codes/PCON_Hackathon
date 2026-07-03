import React from 'react';
import { cn } from '../../utils/cn';

export default function Badge({
  children,
  variant = 'primary',
  className
}) {
  const baseStyles = 'inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full text-[11px] font-semibold tracking-tight leading-none';

  const variants = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-[rgba(0,0,0,0.05)] text-text-secondary',
    success: 'bg-success/10 text-success',
    danger: 'bg-danger/10 text-danger',
    outline: 'border border-[rgba(0,0,0,0.12)] text-text-secondary bg-transparent',
    warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200/60',
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
}
