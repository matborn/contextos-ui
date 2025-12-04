import React from 'react';
import { cn } from '../../utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  status?: 'active' | 'away' | 'busy' | 'offline';
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className, status }) => {
  
  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-3xl",
  };

  const statusColors = {
    active: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-slate-400'
  };

  return (
    <div className="relative inline-block">
      <div 
        className={cn(
          "rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br from-primary-500 to-primary-600 shadow-sm shrink-0 overflow-hidden",
          sizes[size],
          className
        )}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {status && (
        <span className={cn(
          "absolute bottom-0 right-0 rounded-full border-2 border-white",
          statusColors[status],
          size === 'sm' ? "w-2.5 h-2.5" : 
          size === 'md' ? "w-3 h-3" : 
          "w-4 h-4"
        )} />
      )}
    </div>
  );
};