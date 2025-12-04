
import React from 'react';
import { Zap, AlertCircle, HelpCircle, CheckCircle, ThumbsUp, ArrowRight } from '../icons/Icons';
import { cn } from '../../utils';

export interface Idea {
  id: string;
  content: string;
  type: 'insight' | 'risk' | 'question' | 'solution';
  votes: number;
  status: 'draft' | 'promoted' | 'parked';
}

interface IdeaCardProps {
  idea: Idea;
  onPromote?: () => void;
  className?: string;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onPromote, className }) => {
  
  const config = {
      insight: { color: 'bg-purple-50 border-purple-200', icon: <Zap size={14} className="text-purple-600"/>, label: 'Insight' },
      risk: { color: 'bg-red-50 border-red-200', icon: <AlertCircle size={14} className="text-red-600"/>, label: 'Risk' },
      question: { color: 'bg-orange-50 border-orange-200', icon: <HelpCircle size={14} className="text-orange-600"/>, label: 'Question' },
      solution: { color: 'bg-emerald-50 border-emerald-200', icon: <CheckCircle size={14} className="text-emerald-600"/>, label: 'Solution' },
  }[idea.type];

  return (
    <div className={cn(
        "relative p-4 rounded-xl border shadow-sm transition-all hover:shadow-md group min-h-[160px] flex flex-col justify-between",
        config.color,
        idea.status === 'promoted' ? "ring-2 ring-blue-500 border-blue-500" : "",
        className
    )}>
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/60 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                {config.icon} {config.label}
            </div>
            {idea.status === 'promoted' && (
                <div className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Promoted</div>
            )}
        </div>

        {/* Content */}
        <p className="text-slate-800 text-sm font-medium leading-relaxed">
            {idea.content}
        </p>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-black/5">
            <button className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-medium transition-colors">
                <ThumbsUp size={14}/> {idea.votes}
            </button>
            
            {idea.status !== 'promoted' && (
                <button 
                    onClick={onPromote}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-white/80 px-2 py-1 rounded shadow-sm"
                >
                    Promote <ArrowRight size={12}/>
                </button>
            )}
        </div>
    </div>
  );
};
