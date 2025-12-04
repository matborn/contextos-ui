
import React from 'react';
import { cn } from '../../utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabBarProps {
  items: TabItem[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export const TabBar: React.FC<TabBarProps> = ({ items, activeId, onSelect, className }) => {
  return (
    <div className={cn("flex bg-slate-100 p-1 rounded-lg overflow-x-auto no-scrollbar", className)}>
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 whitespace-nowrap relative",
              isActive 
                ? "bg-white text-primary-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            )}
          >
            {item.icon}
            {item.label}
            {item.count !== undefined && item.count > 0 && (
              <span className={cn(
                "flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold",
                isActive ? "bg-primary-600 text-white" : "bg-slate-300 text-white"
              )}>
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
