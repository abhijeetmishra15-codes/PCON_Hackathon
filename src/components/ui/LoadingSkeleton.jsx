import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export default function LoadingSkeleton({ className, type = 'text', count = 1 }) {
  const baseStyles = 'bg-border/50 rounded-md overflow-hidden relative';
  
  const types = {
    text: 'h-4 w-full rounded-md',
    avatar: 'w-10 h-10 rounded-full',
    card: 'h-32 w-full rounded-card',
    button: 'h-10 w-24 rounded-btn',
    title: 'h-8 w-1/3 rounded-md',
  };

  const SkeletonItem = ({ idx }) => (
    <div className={cn(baseStyles, types[type], className)}>
      <motion.div
        className="absolute inset-0 -translate-x-full"
        animate={{ translateX: ['-100%', '100%'] }}
        transition={{ 
          repeat: Infinity, 
          duration: 1.5, 
          ease: "linear",
          delay: idx * 0.1 
        }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
        }}
      />
    </div>
  );

  if (count === 1) return <SkeletonItem idx={0} />;

  return (
    <div className="flex flex-col gap-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i} idx={i} />
      ))}
    </div>
  );
}
