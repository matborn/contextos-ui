
import React from 'react';
import { Card } from '../ui/Card';
import { cn } from '../../utils';

interface MetricCardProps {
  title: string;
  mainValue: React.ReactNode;
  subValue?: React.ReactNode;
  icon: React.ReactNode;
  colorTheme: 'green' | 'blue' | 'orange' | 'purple' | 'teal';
  className?: string;
  children?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  mainValue, 
  subValue, 
  icon, 
  colorTheme, 
  className, 
  children 
}) => {
  
  const themeClasses = {
    green: { border: 'border-t-green-500', iconBg: 'bg-green-50', iconText: 'text-green-600' },
    blue: { border: 'border-t-blue-500', iconBg: 'bg-blue-50', iconText: 'text-blue-600' },
    orange: { border: 'border-t-orange-500', iconBg: 'bg-orange-50', iconText: 'text-orange-600' },
    purple: { border: 'border-t-purple-500', iconBg: 'bg-purple-50', iconText: 'text-purple-600' },
    teal: { border: 'border-t-teal-500', iconBg: 'bg-teal-50', iconText: 'text-teal-600' },
  };

  const theme = themeClasses[colorTheme];

  return (
    <Card className={cn("p-5 border-t-4 shadow-sm hover:shadow-md transition-shadow", theme.border, className)}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
                <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{mainValue}</span>
                    {subValue && (
                        <span className={cn("text-xs font-medium", theme.iconText)}>
                            {subValue}
                        </span>
                    )}
                </div>
            </div>
            <div className={cn("p-2 rounded-lg", theme.iconBg, theme.iconText)}>
                {icon}
            </div>
        </div>
        {children}
    </Card>
  );
};
