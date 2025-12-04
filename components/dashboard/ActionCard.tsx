
import React from 'react';
import { cn } from '../../utils';

export type ActionCardVariant = 'general' | 'technical' | 'strategy' | 'legal' | 'creative';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: ActionCardVariant;
  onClick?: () => void;
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({ 
  icon, 
  title, 
  description, 
  variant = 'general', 
  onClick, 
  className 
}) => {
  
  const variants = {
    general: {
      container: "hover:border-blue-400",
      iconBg: "bg-slate-100 group-hover:bg-blue-50",
      iconColor: "text-slate-600 group-hover:text-blue-600"
    },
    technical: {
      container: "hover:border-indigo-400",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
    strategy: {
      container: "hover:border-purple-400",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    legal: {
      container: "hover:border-emerald-400",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    creative: {
      container: "hover:border-pink-400",
      iconBg: "bg-pink-50",
      iconColor: "text-pink-600"
    }
  };

  const style = variants[variant];

  return (
    <button 
      onClick={onClick}
      className={cn(
        "group flex flex-col items-start p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all text-left w-full",
        style.container,
        className
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors",
        style.iconBg,
        style.iconColor
      )}>
        {icon}
      </div>
      <div className="font-semibold text-slate-900 mb-1">{title}</div>
      <p className="text-xs text-slate-500">{description}</p>
    </button>
  );
};
