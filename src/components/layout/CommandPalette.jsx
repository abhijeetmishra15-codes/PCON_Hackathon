import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Briefcase, Command } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function CommandPalette({ isOpen, onClose }) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        isOpen ? onClose() : onClose(true);
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const allResults = [
    { id: 1, type: 'people', title: 'John Doe', subtitle: 'Software Engineer at Apple', icon: <User size={16}/> },
    { id: 2, type: 'jobs', title: 'Frontend Developer', subtitle: 'Linear • San Francisco', icon: <Briefcase size={16}/> },
  ];

  const results = search.trim() === '' 
    ? allResults 
    : allResults.filter(item => 
        item.title.toLowerCase().includes(search.toLowerCase()) || 
        item.subtitle.toLowerCase().includes(search.toLowerCase())
      );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-text-main/20 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-modal shadow-floating overflow-hidden border border-border"
          >
            <div className="flex items-center px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-text-secondary mr-3" />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search people, jobs, companies..."
                className="flex-1 bg-transparent border-none outline-none text-text-main text-lg placeholder:text-text-secondary"
              />
              <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-xs font-medium text-text-secondary">
                <Command size={12} /> K
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      className="w-full flex items-center p-3 rounded-card hover:bg-secondary transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                        {result.icon}
                      </div>
                      <div className="ml-3 flex-1">
                        <h4 className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors">
                          {result.title}
                        </h4>
                        <p className="text-xs text-text-secondary">
                          {result.subtitle}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-text-secondary">
                  No results found for "{search}"
                </div>
              )}
            </div>
            
            <div className="px-4 py-3 bg-background/50 border-t border-border flex items-center gap-4 text-xs text-text-secondary">
              <span className="flex items-center gap-1">Use <kbd className="bg-white px-1.5 py-0.5 rounded border border-border shadow-sm">↑</kbd> <kbd className="bg-white px-1.5 py-0.5 rounded border border-border shadow-sm">↓</kbd> to navigate</span>
              <span className="flex items-center gap-1">Use <kbd className="bg-white px-1.5 py-0.5 rounded border border-border shadow-sm">Enter</kbd> to select</span>
              <span className="flex items-center gap-1">Use <kbd className="bg-white px-1.5 py-0.5 rounded border border-border shadow-sm">Esc</kbd> to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
