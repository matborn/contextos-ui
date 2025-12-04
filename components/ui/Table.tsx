import React from 'react';
import { cn } from '../../utils';
import { Loader2 } from '../icons/Icons';

export interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export interface TableSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export interface TableBodyProps extends TableSectionProps {
  isLoading?: boolean;
  emptyMessage?: string;
  colSpan?: number;
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  interactive?: boolean;
}

export const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <div className={cn('relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">{children}</table>
      </div>
    </div>
  );
};

export const TableHeader: React.FC<TableSectionProps> = ({ children, className, ...props }) => (
  <thead className={cn('bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500', className)} {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<TableBodyProps> = ({ children, className, isLoading, emptyMessage = 'No data available', colSpan = 1, ...props }) => {
  const hasRows = React.Children.count(children) > 0;

  return (
    <tbody className={cn('divide-y divide-slate-100', className)} {...props}>
      {isLoading ? (
        <tr>
          <td colSpan={colSpan} className="px-4 py-6 text-center text-sm text-slate-500">
            <div className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin text-primary-600" />
              Loading rows...
            </div>
          </td>
        </tr>
      ) : hasRows ? (
        children
      ) : (
        <tr>
          <td colSpan={colSpan} className="px-4 py-6 text-center text-sm text-slate-500">
            {emptyMessage}
          </td>
        </tr>
      )}
    </tbody>
  );
};

export const TableFooter: React.FC<TableSectionProps> = ({ children, className, ...props }) => (
  <tfoot className={cn('bg-slate-50 text-xs text-slate-500', className)} {...props}>
    {children}
  </tfoot>
);

export const TableRow: React.FC<TableRowProps> = ({ children, className, interactive, onClick, onKeyDown, ...props }) => {
  const handleKeyDown: React.KeyboardEventHandler<HTMLTableRowElement> = (event) => {
    if (interactive && onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      // Trigger click-like behavior for keyboard users
      onClick(event as unknown as React.MouseEvent<HTMLTableRowElement>);
    }
    onKeyDown?.(event);
  };

  return (
    <tr
      className={cn(
        'border-b border-slate-100 last:border-b-0',
        interactive && 'cursor-pointer transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20',
        className
      )}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ children, className, ...props }) => (
  <th className={cn('px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500', className)} {...props}>
    {children}
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, className, ...props }) => (
  <td className={cn('px-4 py-3 text-sm text-slate-700', className)} {...props}>
    {children}
  </td>
);

export const TableCaption: React.FC<React.HTMLAttributes<HTMLTableCaptionElement>> = ({ children, className, ...props }) => (
  <caption className={cn('px-4 py-2 text-left text-xs text-slate-500', className)} {...props}>
    {children}
  </caption>
);
