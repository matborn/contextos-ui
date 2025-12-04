
import React from 'react';
import { cn } from '../../utils';

export type QuickActionVariant = 'blue' | 'purple' | 'green' | 'orange' | 'neutral';

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  variant?: QuickActionVariant;
  onClick?: () => void;
  className?: string;
}

export const QuickAction: React.FC<QuickActionProps> = ({ 
  icon, 
  label, 
  variant = 'neutral',
  onClick, 
  className 
}) => {
  
  const styles = {
      blue: { 
          iconBg: 'bg-blue-50', 
          iconText: 'text-blue-600', 
          hoverBg: 'group-hover:bg-blue-600',
          borderHover: 'hover:border-blue-400' 
      },
      purple: { 
          iconBg: 'bg-purple-50', 
          iconText: 'text-purple-600', 
          hoverBg: 'group-hover:bg-purple-600',
          borderHover: 'hover:border-purple-400' 
      },
      green: { 
          iconBg: 'bg-green-50', 
          iconText: 'text-green-600', 
          hoverBg: 'group-hover:bg-green-600',
          borderHover: 'hover:border-green-400' 
      },
      orange: { 
          iconBg: 'bg-orange-50', 
          iconText: 'text-orange-600', 
          hoverBg: 'group-hover:bg-orange-600',
          borderHover: 'hover:border-orange-400' 
      },
      neutral: { 
          iconBg: 'bg-slate-100', 
          iconText: 'text-slate-600', 
          hoverBg: 'group-hover:bg-slate-600',
          borderHover: 'hover:border-slate-400' 
      },
  };

  const currentStyle = styles[variant];

  return (
    <button 
        onClick={onClick}
        className={cn(
            "w-full text-left bg-white p-3 rounded-lg border border-slate-200 hover:shadow-sm transition-all flex items-center gap-3 group",
            currentStyle.borderHover,
            className
        )}
    >
        <div className={cn(
            "p-1.5 rounded transition-colors group-hover:text-white", 
            currentStyle.iconBg, 
            currentStyle.iconText,
            currentStyle.hoverBg
        )}>
            {icon}
        </div>
        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{label}</span>
    </button>
  );
};
