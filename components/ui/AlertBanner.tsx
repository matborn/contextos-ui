import React from 'react';
import { cn } from '../../utils';
import { AlertCircle, CheckCircle, RefreshCw } from '../icons/Icons';
import { Button } from './Button';

type BannerTone = 'success' | 'error' | 'warning' | 'info';

type BannerLayout = 'card' | 'bar';

interface AlertBannerProps {
  tone?: BannerTone;
  layout?: BannerLayout;
  title: string;
  description?: string;
  className?: string;
  actionLabel?: string;
  onAction?: () => void;
  isActionLoading?: boolean;
}

const toneStyles: Record<BannerTone, { container: string; icon: JSX.Element; text: string; border: string }> = {
  success: {
    container: 'bg-green-50 border-green-200',
    icon: <CheckCircle className="text-green-600" size={20} />,
    text: 'text-green-800',
    border: 'border-green-300',
  },
  error: {
    container: 'bg-red-50 border-red-200',
    icon: <AlertCircle className="text-red-600" size={20} />,
    text: 'text-red-800',
    border: 'border-red-300',
  },
  warning: {
    container: 'bg-amber-50 border-amber-200',
    icon: <AlertCircle className="text-amber-600" size={20} />,
    text: 'text-amber-800',
    border: 'border-amber-300',
  },
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: <AlertCircle className="text-blue-600" size={20} />,
    text: 'text-blue-800',
    border: 'border-blue-300',
  },
};

export const AlertBanner: React.FC<AlertBannerProps> = ({
  tone = 'info',
  layout = 'card',
  title,
  description,
  className,
  actionLabel,
  onAction,
  isActionLoading,
}) => {
  const toneStyle = toneStyles[tone];
  const layoutClass =
    layout === 'bar'
      ? 'w-full rounded-none shadow-none border-l-4'
      : 'w-full rounded-xl shadow-sm';

  return (
    <div
      className={cn(
        'border px-4 sm:px-6 py-3 sm:py-4 flex items-start gap-3',
        toneStyle.container,
        toneStyle.border,
        layoutClass,
        className
      )}
    >
      <div className="mt-0.5 shrink-0">{toneStyle.icon}</div>
      <div className="flex-1 space-y-1">
        <div className={cn('text-sm font-semibold', toneStyle.text)}>{title}</div>
        {description && <p className={cn('text-sm', toneStyle.text)}>{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onAction}
          isLoading={isActionLoading}
          leftIcon={<RefreshCw size={14} />}
          className="shrink-0"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
