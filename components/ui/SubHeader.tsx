
import React from 'react';
import { cn } from '../../utils';

interface SubHeaderProps {
  children?: React.ReactNode; // Left aligned content (Tabs, Breadcrumbs, Status text)
  actions?: React.ReactNode;  // Right aligned content (Buttons, Toggles)
  className?: string;
}

export const SubHeader: React.FC<SubHeaderProps> = ({ children, actions, className }) => {
  return (
    <div className={cn(
      "h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 z-10",
      className
    )}>
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar min-w-0">
        {children}
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-4">
        {actions}
      </div>
    </div>
  );
};
