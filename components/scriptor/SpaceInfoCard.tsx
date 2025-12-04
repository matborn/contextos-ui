
import React from 'react';
import { cn } from '../../utils';

interface SpaceInfoCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export const SpaceInfoCard: React.FC<SpaceInfoCardProps> = ({ title, icon, children, className, action }) => {
  return (
    <div className={cn("bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm", className)}>
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <div className="text-blue-600 opacity-80">{icon}</div>
                <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
            </div>
            {action}
        </div>
        <div className="text-sm">
            {children}
        </div>
    </div>
  );
};
