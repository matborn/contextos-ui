
import React from 'react';
import { ArrowRight } from '../icons/Icons';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '../../utils';

interface GovernanceAction {
    label: string;
    onClick?: () => void;
    variant?: 'secondary' | 'primary' | 'danger' | 'ghost' | 'outline' | 'warning';
    className?: string;
}

interface GovernanceItemProps {
  type: string;
  typeColor: 'error' | 'warning' | 'info' | 'success' | 'neutral';
  date: string;
  title: string;
  description: string;
  actions: GovernanceAction[];
  className?: string;
  isBordered?: boolean; // If true, applies specific border styling from the original design
}

export const GovernanceItem: React.FC<GovernanceItemProps> = ({ 
  type, 
  typeColor, 
  date, 
  title, 
  description, 
  actions, 
  className,
  isBordered = true
}) => {
  
  const borderColors = {
      error: 'border-l-red-500',
      warning: 'border-l-orange-400',
      info: 'border-l-blue-500',
      success: 'border-l-green-500',
      neutral: 'border-l-slate-400',
  };

  return (
    <div className={cn(
        "bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group",
        isBordered ? `border-l-4 ${borderColors[typeColor]}` : "",
        className
    )}>
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
                <Badge status={typeColor} className="text-[10px] px-1.5 py-0">{type}</Badge>
                <span className="text-xs text-slate-400">{date}</span>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500"/>
        </div>
        <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {description}
        </p>
        <div className="mt-3 flex gap-2">
            {actions.map((action, index) => (
                <Button 
                    key={index}
                    size="sm" 
                    variant={action.variant || 'secondary'} 
                    className={cn("h-7 text-xs", action.className)}
                    onClick={(e) => {
                        e.stopPropagation();
                        action.onClick?.();
                    }}
                >
                    {action.label}
                </Button>
            ))}
        </div>
    </div>
  );
};
