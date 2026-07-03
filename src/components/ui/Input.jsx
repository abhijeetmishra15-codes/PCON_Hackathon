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
    <div className="w-full relative">
      {leftIcon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none flex items-center">
          {leftIcon}
        </div>
      )}

      <input
        type={type}
        className={cn(
          // Base
          'w-full bg-white text-text-main text-[14px] font-medium rounded-input outline-none',
          'px-4 py-[11px]',
          // Border — visible but soft
          'border border-[rgba(0,0,0,0.10)]',
          // Placeholder
          'placeholder:text-text-secondary/60 placeholder:font-normal',
          // Transition
          'transition-all duration-200 ease-out',
          // Focus — warm ring + border
          'focus:border-primary/60 focus:shadow-focus-ring',
          // Hover
          'hover:border-[rgba(0,0,0,0.18)]',
          // Error
          error && 'border-danger/60 focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]',
          // Icon padding
          leftIcon && 'pl-10',
          rightIcon && 'pr-10',
          className
        )}
        ref={ref}
        {...props}
      />

      {rightIcon && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary flex items-center">
          {rightIcon}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-[12px] font-medium text-danger flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
