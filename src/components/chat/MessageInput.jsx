import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function MessageInput({ onSend, disabled }) {
  const [content, setContent] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [content]);

  const handleSend = () => {
    if (content.trim() && !disabled) {
      onSend(content.trim());
      setContent('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-white/5 bg-background">
      <div className="relative flex items-end gap-2 bg-secondary rounded-2xl p-2 border border-white/5 focus-within:border-primary/50 transition-colors">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type a message..."
          className={cn(
            "flex-1 bg-transparent border-none resize-none py-2 px-3 text-[15px]",
            "text-text-main placeholder-text-muted focus:ring-0 focus:outline-none",
            "min-h-[40px] max-h-[120px]"
          )}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!content.trim() || disabled}
          className={cn(
            "p-2.5 rounded-xl flex-shrink-0 transition-all duration-200",
            content.trim() && !disabled
              ? "bg-primary text-primary-content shadow-lg shadow-primary/20 hover:bg-primary-hover active:scale-95"
              : "bg-white/5 text-text-muted cursor-not-allowed"
          )}
        >
          <Send size={18} className={content.trim() && !disabled ? "ml-0.5" : ""} />
        </button>
      </div>
    </div>
  );
}
