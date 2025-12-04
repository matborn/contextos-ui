
import React from 'react';
import { cn } from '../../utils';
import { FileText } from '../icons/Icons';

interface ResourceCardProps {
  initial?: string;
  title: string;
  description: string;
  statLabel: string;
  statIcon?: React.ReactNode;
  colorTheme?: string;
  onClick?: () => void;
  className?: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ 
  initial, 
  title, 
  description, 
  statLabel, 
  statIcon = <FileText size={12}/>, 
  colorTheme = 'blue', 
  onClick,
  className 
}) => {

  const getColorClasses = (theme: string) => {
    switch (theme) {
      case 'blue': return "bg-blue-500 hover:border-blue-300";
      case 'purple': return "bg-purple-500 hover:border-purple-300";
      case 'red': return "bg-red-500 hover:border-red-300";
      case 'green': return "bg-green-500 hover:border-green-300";
      case 'orange': return "bg-orange-500 hover:border-orange-300";
      default: return "bg-slate-500 hover:border-slate-300";
    }
  };

  const themeClass = getColorClasses(colorTheme);

  return (
    <div 
        onClick={onClick}
        className={cn(
            "group p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer",
            `hover:border-${colorTheme}-300`, // Dynamic hover border attempt, fallback handled in CSS/Tailwind usually requires safelist or explicit map
            className
        )}
        style={{ borderColor: undefined }} // Clean up inline style if previously used
    >
        <div className="flex justify-between items-start mb-2">
            <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm transition-transform group-hover:scale-110", 
                colorTheme === 'blue' ? "bg-blue-500" :
                colorTheme === 'purple' ? "bg-purple-500" :
                colorTheme === 'red' ? "bg-red-500" :
                colorTheme === 'green' ? "bg-green-500" :
                colorTheme === 'orange' ? "bg-orange-500" : "bg-slate-500"
            )}>
                {initial || title.charAt(0)}
            </div>
            <span className={cn(
                "text-xs font-medium transition-colors opacity-0 group-hover:opacity-100",
                colorTheme === 'blue' ? "text-blue-500" :
                colorTheme === 'purple' ? "text-purple-500" :
                colorTheme === 'red' ? "text-red-500" :
                "text-slate-500"
            )}>
                Open &rarr;
            </span>
        </div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{description}</p>
        <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-2 text-xs text-slate-400 font-medium">
            {statIcon} {statLabel}
        </div>
    </div>
  );
};
