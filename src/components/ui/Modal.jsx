import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  className,
  maxWidth = 'max-w-lg'
}) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-text-main/20 backdrop-blur-sm z-[999] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "bg-white w-full shadow-floating rounded-modal overflow-hidden flex flex-col max-h-[90vh]",
                maxWidth,
                className
              )}
            >
              {title && (
                <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
                  <h2 className="text-lg font-semibold text-text-main">{title}</h2>
                  <button 
                    onClick={onClose}
                    className="p-2 text-text-secondary hover:text-text-main hover:bg-secondary rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              
              <div className="p-6 overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
