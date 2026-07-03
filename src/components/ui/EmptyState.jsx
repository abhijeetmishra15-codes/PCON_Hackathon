import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className
      )}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-secondary text-primary flex items-center justify-center mb-4">
          <Icon size={32} strokeWidth={1.5} />
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-text-main mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-text-secondary max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      
      {action && (
        <div>{action}</div>
      )}
    </motion.div>
  );
}
