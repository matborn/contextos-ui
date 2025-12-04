
import React, { useRef, useEffect } from 'react';
import { ArrowRight, Loader2 } from '../icons/Icons';
import { cn } from '../../utils';

interface AgentInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  isDisabled?: boolean;
  isThinking?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export const AgentInput: React.FC<AgentInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Type a message...",
  isDisabled,
  isThinking,
  autoFocus,
  className
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isDisabled && !isThinking && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className={cn("relative", className)}>
        <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isDisabled || isThinking}
            autoFocus={autoFocus}
            rows={1}
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm resize-none overflow-y-auto disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ minHeight: '46px', maxHeight: '120px' }}
        />
        <div className="absolute right-2 bottom-2">
            <button
                onClick={onSubmit}
                disabled={isDisabled || isThinking || !value.trim()}
                className={cn(
                    "p-1.5 rounded-lg transition-all flex items-center justify-center",
                    !value.trim() || isDisabled || isThinking
                        ? "text-slate-300 bg-transparent cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                )}
            >
                {isThinking ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <ArrowRight size={16} />
                )}
            </button>
        </div>
    </div>
  );
};
