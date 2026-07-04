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
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-text-main/20 backdrop-blur-md z-[999] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.32 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "bg-gradient-to-br from-white to-[#FAFAF8] w-full shadow-floating rounded-modal overflow-hidden flex flex-col max-h-[90vh] border border-[rgba(0,0,0,0.06)]",
                maxWidth,
                className
              )}
            >
              {title && (
                <div className="px-7 py-5 border-b border-[rgba(0,0,0,0.05)] flex items-center justify-between shrink-0">
                  <h2 className="text-[16px] font-bold text-text-main tracking-tight">{title}</h2>
                  <button 
                    onClick={onClose}
                    className="p-2 text-text-secondary hover:text-text-main hover:bg-secondary rounded-xl transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              
              <div className="p-7 overflow-y-auto">
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
