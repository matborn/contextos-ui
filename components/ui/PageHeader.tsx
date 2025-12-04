
import React from 'react';
import { ChevronLeft } from '../icons/Icons';
import { Button } from './Button';
import { cn } from '../../utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode; // Actions area
  onBack?: () => void;
  backLabel?: string;
  badge?: React.ReactNode;
  className?: string;
  tabBar?: React.ReactNode; // New prop for tabs/navigation
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  children, 
  onBack, 
  backLabel,
  badge,
  className,
  tabBar
}) => {
  return (
    <div className={cn("bg-white border-b border-slate-200 shrink-0 z-20 transition-all", className)}>
      <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4 min-w-0">
          {onBack && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="px-0 w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500"
                onClick={onBack}
                title={backLabel || "Go back"}
              >
                <ChevronLeft size={20} />
              </Button>
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            </>
          )}
          
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-3 truncate">
              {title}
              {badge && <span className="shrink-0">{badge}</span>}
            </h1>
            {description && (
              <p className="text-xs text-slate-500 truncate hidden sm:block">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 ml-4 shrink-0">
          {children}
        </div>
      </div>

      {/* Render Tabs inside the header container if provided */}
      {tabBar && (
        <div className="px-6 pb-4">
          {tabBar}
        </div>
      )}
    </div>
  );
};
