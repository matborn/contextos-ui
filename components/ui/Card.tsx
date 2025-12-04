
import React from 'react';
import { cn } from '../../utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  const isInteractive = !!onClick;
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden",
        isInteractive && "cursor-pointer transition-all duration-200 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-500/5 group",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn("px-6 py-4 border-b border-slate-100", className)}>{children}</div>
);

export const CardTitle: React.FC<CardProps> = ({ children, className }) => (
  <h3 className={cn("text-lg font-semibold text-slate-900 group-hover:text-primary-700 transition-colors", className)}>{children}</h3>
);

export const CardContent: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn("p-6", className)}>{children}</div>
);

export const CardFooter: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn("px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center", className)}>{children}</div>
);
