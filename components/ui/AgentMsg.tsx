
import React from 'react';
import { Bot } from '../icons/Icons';
import { Button } from './Button';
import { cn } from '../../utils';
import { AgentMessage } from '../../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface AgentMsgProps {
  message: AgentMessage;
  attachment?: React.ReactNode;
}

export const AgentMsg: React.FC<AgentMsgProps> = ({ message, attachment }) => {
  const isSystem = message.role === 'system';
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
        "flex gap-3 animate-fadeIn", 
        isUser ? "flex-row-reverse" : "",
        isSystem ? "opacity-75 justify-center" : ""
    )}>
      {/* Avatar */}
      {!isSystem && (
        <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1", 
            message.role === 'assistant' ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
        )}>
          {message.role === 'assistant' ? <Bot size={16} /> : <div className="text-xs font-bold">You</div>}
        </div>
      )}
      
      {/* Message Body */}
      <div className={cn(
          "flex-1 space-y-3 max-w-[85%]",
          isUser ? "text-right" : "",
          isSystem ? "text-center max-w-lg" : ""
      )}>
          {message.content && (
            <div className={cn(
                "p-3 rounded-2xl shadow-sm text-sm leading-relaxed border inline-block text-left",
                // User: White bubble with slate text (Clean)
                isUser ? "bg-white text-slate-800 rounded-tr-none border-slate-200" : 
                // Assistant: White bubble with slate text (Clean), or optional blue tint if preferred
                // Keeping consistent with Atlas:
                "bg-white text-slate-800 rounded-tl-none border-slate-200",
                isSystem ? "bg-transparent border-transparent shadow-none italic text-slate-500" : ""
            )}>
                <MarkdownRenderer content={message.content} />
            </div>
          )}
          
          {attachment && (
              <div className={cn("animate-fadeIn", isUser ? "flex justify-end" : "")}>
                  {attachment}
              </div>
          )}

          {message.actions && message.actions.length > 0 && (
              <div className={cn("flex flex-wrap gap-2", isUser ? "justify-end" : "")}>
                  {message.actions.map(action => (
                      <Button 
                        key={action.actionId} 
                        size="sm" 
                        variant={action.variant || 'secondary'}
                        className="text-xs h-7"
                      >
                          {action.label}
                      </Button>
                  ))}
              </div>
          )}
          <div className={cn("text-[10px] text-slate-300 px-1", isUser ? "text-right" : "")}>
              {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
      </div>
    </div>
  );
};
