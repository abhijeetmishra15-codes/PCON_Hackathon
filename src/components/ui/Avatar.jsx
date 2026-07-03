import React from 'react';
import { cn } from '../../utils/cn';
import { User } from 'lucide-react';

export default function Avatar({ 
  src, 
  alt, 
  fallback, 
  size = 'md', 
  className,
  status
}) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-lg',
  };

  const statusStyles = {
    online: 'bg-success',
    offline: 'bg-text-secondary',
    busy: 'bg-danger',
  };

  return (
    <div className="relative inline-block">
      <div 
        className={cn(
          "relative flex items-center justify-center rounded-full overflow-hidden bg-secondary border border-border text-primary font-semibold uppercase shrink-0",
          sizes[size],
          className
        )}
      >
        {src ? (
          <img 
            src={src} 
            alt={alt || "Avatar"} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : fallback ? (
          fallback
        ) : (
          <User className="w-1/2 h-1/2 text-text-secondary opacity-50" />
        )}
      </div>

      {status && (
        <span 
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-white",
            statusStyles[status],
            size === 'sm' ? 'w-2 h-2' : size === 'xl' ? 'w-4 h-4' : 'w-3 h-3'
          )}
        />
      )}
    </div>
  );
}
