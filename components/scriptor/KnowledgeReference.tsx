
import React from 'react';
import { CheckCircle, AlertCircle, Database } from '../icons/Icons';
import { cn } from '../../utils';

export type ReferenceType = 'decision' | 'risk' | 'fact';

interface KnowledgeReferenceProps {
  type: ReferenceType;
  content: string;
  source: string;
  date: string;
  onClick?: () => void;
}

export const KnowledgeReference: React.FC<KnowledgeReferenceProps> = ({ type, content, source, date, onClick }) => {
  
  const getIcon = () => {
      switch (type) {
          case 'decision': return <CheckCircle size={12} className="text-green-600"/>;
          case 'risk': return <AlertCircle size={12} className="text-red-500"/>;
          case 'fact': return <Database size={12} className="text-blue-500"/>;
      }
  };

  const getLabel = () => {
      return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div 
        onClick={onClick}
        className={cn(
            "bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-xs group hover:border-blue-300 transition-all cursor-pointer",
        )}
    >
        <div className="font-semibold text-slate-700 mb-1 flex items-center gap-1">
            {getIcon()} {getLabel()}
        </div>
        <p className="text-slate-500 leading-relaxed">
            "{content}"
        </p>
        <div className="mt-2 text-[10px] text-slate-400">{source} • {date}</div>
    </div>
  );
};
