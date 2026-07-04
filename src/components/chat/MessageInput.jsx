import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function MessageInput({ onSend, disabled }) {
  const [content, setContent] = useState('');
  const textareaRef = useRef(null);

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

  const hasContent = content.trim().length > 0;

  return (
    <div className="p-4" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', background: 'rgba(250,250,248,0.90)' }}>
      <div className={cn(
        'relative flex items-end gap-2 bg-white rounded-[18px] pr-2 pl-1',
        'border transition-all duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
        'shadow-[0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(0,0,0,0.02)]',
        hasContent
          ? 'border-[rgba(245,158,11,0.40)] shadow-[0_0_0_3px_rgba(245,158,11,0.10),0_1px_3px_rgba(0,0,0,0.04)]'
          : 'border-[rgba(0,0,0,0.09)] focus-within:border-[rgba(245,158,11,0.40)] focus-within:shadow-[0_0_0_3px_rgba(245,158,11,0.10),0_1px_3px_rgba(0,0,0,0.04)]'
      )}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type a message..."
          className={cn(
            'flex-1 bg-transparent border-none resize-none py-3 px-3 text-[14px] font-medium',
            'text-text-main focus:ring-0 focus:outline-none leading-relaxed',
            'placeholder:text-text-secondary/40 placeholder:font-normal',
            'min-h-[46px] max-h-[120px]'
          )}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!hasContent || disabled}
          className={cn(
            'p-2.5 rounded-[13px] flex-shrink-0 mb-[5px] transition-all duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
            hasContent && !disabled
              ? 'text-white hover:scale-105 active:scale-95'
              : 'bg-[rgba(0,0,0,0.05)] text-text-secondary/40 cursor-not-allowed'
          )}
          style={hasContent && !disabled ? {
            background: 'linear-gradient(145deg, #FBBF24, #F59E0B)',
            boxShadow: '0 2px 10px rgba(245,158,11,0.40)',
          } : {}}
        >
          <Send size={17} className={hasContent && !disabled ? 'translate-x-[1px]' : ''} />
        </button>
      </div>
      <p className="text-[10.5px] text-text-secondary/35 text-center mt-2 font-medium">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
