
import React from 'react';
import { cn } from '../../utils';
import { ChevronRight } from '../icons/Icons';

export interface ListItemProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightContent?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({ 
  title, 
  subtitle, 
  leftIcon, 
  rightContent, 
  onClick, 
  className,
  isActive
}) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group flex items-center p-4 border-b border-slate-50 last:border-0 transition-all",
        onClick ? "cursor-pointer hover:bg-slate-50" : "",
        isActive ? "bg-blue-50/60" : "bg-white",
        className
      )}
    >
      {/* Left Icon Area */}
      {leftIcon && (
        <div className={cn(
          "mr-4 shrink-0 flex items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors",
        )}>
          {leftIcon}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 mr-4">
        <h4 className={cn(
          "text-sm font-medium text-slate-900 truncate",
          isActive ? "text-blue-700" : ""
        )}>
          {title}
        </h4>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Actions/Content */}
      {rightContent && (
        <div className="shrink-0 flex items-center text-sm text-slate-500">
          {rightContent}
        </div>
      )}

      {/* Chevron indicator for clickable items if no specific right content prevents it */}
      {onClick && !rightContent && (
        <div className="shrink-0 text-slate-300 group-hover:text-slate-400 pl-2">
          <ChevronRight size={16} />
        </div>
      )}
    </div>
  );
};
