import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({
  className,
  type = 'text',
  error,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  return (
    <div className="w-full relative group">
      {leftIcon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50 pointer-events-none flex items-center transition-colors duration-150 group-focus-within:text-primary/70">
          {leftIcon}
        </div>
      )}

      <input
        type={type}
        className={cn(
          // Base layout
          'w-full bg-white text-text-main text-[14px] font-medium rounded-input outline-none',
          'px-4 py-[11px]',
          // Border
          'border border-[rgba(0,0,0,0.09)]',
          // Inner shadow for depth
          'shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]',
          // Placeholder
          'placeholder:text-text-secondary/45 placeholder:font-normal',
          // Transition — smooth
          'transition-[border-color,box-shadow] duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          // Hover
          'hover:border-[rgba(0,0,0,0.15)]',
          // Focus
          'focus:border-[rgba(245,158,11,0.50)] focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.02),0_0_0_3px_rgba(245,158,11,0.14)]',
          // Error state
          error && 'border-danger/60 focus:border-danger focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.02),0_0_0_3px_rgba(239,68,68,0.12)]',
          // Icon padding
          leftIcon && 'pl-[42px]',
          rightIcon && 'pr-10',
          className
        )}
        ref={ref}
        {...props}
      />

      {rightIcon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary/50 flex items-center transition-colors duration-150 group-focus-within:text-primary/70">
          {rightIcon}
        </div>
      )}

      {error && (
        <p className="mt-2 text-[12px] font-medium text-danger flex items-center gap-1.5">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
