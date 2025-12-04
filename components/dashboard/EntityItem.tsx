
import React from 'react';
import { CheckCircle, AlertCircle, Loader2 } from '../icons/Icons';
import { cn } from '../../utils';

export type EntityStatus = 'healthy' | 'warning' | 'critical' | 'syncing';

interface EntityItemProps {
  initial: string;
  name: string;
  detail: string;
  status?: EntityStatus;
  onClick?: () => void;
  className?: string;
}

export const EntityItem: React.FC<EntityItemProps> = ({ 
  initial, 
  name, 
  detail, 
  status = 'healthy',
  onClick, 
  className 
}) => {
  
  const StatusIcon = () => {
      switch (status) {
          case 'healthy': return <CheckCircle size={16} className="text-green-500"/>;
          case 'warning': return <AlertCircle size={16} className="text-orange-500"/>;
          case 'critical': return <AlertCircle size={16} className="text-red-500"/>;
          case 'syncing': return <Loader2 size={16} className="text-blue-500 animate-spin"/>;
          default: return null;
      }
  };

  return (
    <div 
        onClick={onClick}
        className={cn(
            "flex items-center justify-between p-2 hover:bg-slate-100 rounded transition-colors cursor-pointer group",
            className
        )}
    >
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:border-slate-300 transition-colors">
                {initial}
            </div>
            <div>
                <div className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{name}</div>
                <div className="text-[10px] text-slate-500">{detail}</div>
            </div>
        </div>
        <StatusIcon />
    </div>
  );
};
