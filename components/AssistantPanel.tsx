import React from 'react';
import { AgentMessage, ValidationItem } from '../types';
import { AgentMsg } from './ui/AgentMsg';
import { Check, ChevronRight, AlertCircle, Loader2 } from './icons/Icons';
import { cn } from '../utils';

interface AssistantPanelProps {
  messages: AgentMessage[];
  validationItems: ValidationItem[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({ 
  messages, 
  validationItems, 
  onSendMessage,
  isLoading 
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="w-80 border-l border-slate-200 bg-white flex flex-col h-full">
       {/* Tab Navigation */}
       <div className="flex border-b border-slate-100">
           <button className="flex-1 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-blue-50/50">Assistant</button>
           <button className="flex-1 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">History</button>
       </div>

       {/* Validation Status Widget */}
       <div className="p-5 bg-slate-50/50 border-b border-slate-100">
           <div className="flex items-center justify-between mb-3">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Validation Status</h3>
               <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">2 Issues</span>
           </div>
           <div className="space-y-2.5">
               {validationItems.map(item => (
                   <div key={item.id} className="flex items-start gap-2.5 text-sm group cursor-pointer">
                       {item.status === 'passed' ? (
                           <div className="text-green-500 mt-0.5"><Check size={14} /></div>
                       ) : item.status === 'failed' ? (
                           <div className="text-red-500 mt-0.5"><AlertCircle size={14} /></div>
                       ) : (
                           <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 mt-0.5 group-hover:border-blue-400 transition-colors"></div>
                       )}
                       <div className="flex-1">
                           <span className={cn(
                               "transition-colors",
                               item.status === 'passed' ? "text-slate-400 line-through decoration-slate-300" : "text-slate-700 font-medium",
                               item.status === 'failed' && "text-red-700"
                           )}>
                               {item.label}
                           </span>
                           {item.description && item.status !== 'passed' && (
                               <p className="text-xs text-slate-500 mt-0.5 leading-snug">{item.description}</p>
                           )}
                       </div>
                   </div>
               ))}
           </div>
       </div>

       {/* Chat Stream */}
       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white scroll-smooth">
           {messages.map(msg => (
               <AgentMsg key={msg.id} message={msg} />
           ))}
           {isLoading && (
               <div className="flex gap-2 items-center text-xs text-slate-400 ml-10">
                   <Loader2 size={12} className="animate-spin" /> Thinking...
               </div>
           )}
       </div>

       {/* Input Area */}
       <div className="p-4 border-t border-slate-100 bg-white">
           <div className="relative">
               <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask ContextOS..." 
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
               />
               <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="absolute right-2 top-2 p-1 text-slate-400 hover:text-blue-600 disabled:opacity-50 disabled:hover:text-slate-400 transition-colors"
               >
                   <ChevronRight size={18} />
               </button>
           </div>
           <div className="text-[10px] text-center text-slate-300 mt-2">
               AI can make mistakes. Verify critical info.
           </div>
       </div>
    </div>
  );
};