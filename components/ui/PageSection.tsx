import React from 'react';
import { cn } from '../../utils';

interface PageSectionProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'card' | 'plain';
}

export const PageSection: React.FC<PageSectionProps> = ({ 
  title, 
  description, 
  action, 
  children, 
  className,
  variant = 'default'
}) => {
  return (
    <section className={cn("space-y-4 animate-fadeIn", className)}>
      {(title || description || action) && (
        <div className="flex items-end justify-between mb-2">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-slate-500 mt-1">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      
      <div className={cn(
        variant === 'card' && "bg-white border border-slate-200 rounded-xl shadow-sm p-6"
      )}>
        {children}
      </div>
    </section>
  );
};