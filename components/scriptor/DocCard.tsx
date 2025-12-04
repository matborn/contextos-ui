

import React from 'react';
import { ScriptorDoc } from '../../types';
import { Badge } from '../ui/Badge';
import { FileText } from '../icons/Icons';
import { cn } from '../../utils';

interface DocCardProps {
  doc: ScriptorDoc;
  onClick?: () => void;
  className?: string;
}

export const DocCard: React.FC<DocCardProps> = ({ doc, onClick, className }) => {
  
  // Domain logic for visual states
  const getStatusColor = (status: ScriptorDoc['status']) => {
    switch (status) {
      case 'approved': return "bg-green-50 text-green-600";
      case 'review': return "bg-blue-50 text-blue-600";
      case 'outdated': return "bg-red-50 text-red-600";
      default: return "bg-slate-100 text-slate-500"; // draft
    }
  };

  const statusVariant = (status: ScriptorDoc['status']) => {
      switch (status) {
          case 'approved': return 'success';
          case 'review': return 'info';
          case 'outdated': return 'error';
          default: return 'neutral';
      }
  };

  return (
    <div 
        onClick={onClick}
        className={cn(
            "bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between group",
            className
        )}
    >
        <div className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center shrink-0", getStatusColor(doc.status))}>
                <FileText size={24}/>
            </div>
            <div>
                <h3 className="font-semibold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                    {doc.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>Edited {new Date(doc.lastModified).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Author: {doc.authorId === 'ai' ? 'AI Agent' : 'You'}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <Badge status={statusVariant(doc.status)} className="capitalize">
                {doc.status}
            </Badge>
        </div>
    </div>
  );
};