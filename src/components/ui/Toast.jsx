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
    success: 'border-success/15',
    error: 'border-danger/15',
    info: 'border-[rgba(0,0,0,0.06)]',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.94 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
          className="fixed bottom-6 right-6 z-[9999] flex"
        >
          <div className={cn(
            "flex items-start p-5 rounded-[20px] border shadow-floating max-w-sm w-full bg-white",
            bgStyles[type]
          )}>
            <div className="shrink-0 mr-3.5 mt-0.5">
              {icons[type]}
            </div>
            
            <div className="flex-1 mr-4">
              <h4 className="text-[13.5px] font-bold text-text-main tracking-tight">{title}</h4>
              {message && (
                <p className="text-[12.5px] text-text-secondary mt-1 leading-relaxed">
                  {message}
                </p>
              )}
            </div>

            <button 
              onClick={onClose}
              className="shrink-0 text-text-secondary/60 hover:text-text-main transition-colors p-0.5 rounded-lg hover:bg-secondary"
            >
              <X size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
