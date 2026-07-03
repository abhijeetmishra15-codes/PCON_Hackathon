import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Toast({ 
  isVisible, 
  onClose, 
  title, 
  message, 
  type = 'info' 
}) {
  
  const icons = {
    success: <CheckCircle2 className="text-success w-5 h-5" />,
    error: <XCircle className="text-danger w-5 h-5" />,
    info: <Info className="text-primary w-5 h-5" />,
  };

  const bgStyles = {
    success: 'bg-success/5 border-success/20',
    error: 'bg-danger/5 border-danger/20',
    info: 'bg-secondary border-border',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 flex"
        >
          <div className={cn(
            "flex items-start p-4 rounded-card border shadow-floating max-w-sm w-full bg-white backdrop-blur-xl",
            bgStyles[type]
          )}>
            <div className="shrink-0 mr-3 mt-0.5">
              {icons[type]}
            </div>
            
            <div className="flex-1 mr-4">
              <h4 className="text-sm font-semibold text-text-main">{title}</h4>
              {message && (
                <p className="text-sm text-text-secondary mt-1 leading-snug">
                  {message}
                </p>
              )}
            </div>

            <button 
              onClick={onClose}
              className="shrink-0 text-text-secondary hover:text-text-main transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
