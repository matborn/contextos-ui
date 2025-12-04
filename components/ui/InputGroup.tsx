import React, { forwardRef } from 'react';
import { cn } from '../../utils';
import { AlertCircle, Loader2 } from '../icons/Icons';
import { fieldDescription, fieldDisabled, fieldError, fieldErrorMessage, fieldHelper, fieldLabel } from './formStyles';

export interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  description?: string;
  error?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  loading?: boolean;
}

export const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(
  (
    {
      label,
      helperText,
      description,
      error,
      leading,
      trailing,
      loading,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className={fieldLabel}>
            {label}
          </label>
        )}
        {description && <p className={fieldDescription}>{description}</p>}
        <div
          className={cn(
            'flex w-full items-stretch rounded-lg border border-slate-300 bg-white shadow-sm transition-all duration-200 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/20',
            error && fieldError,
            disabled && fieldDisabled
          )}
        >
          {leading && (
            <div className="flex items-center gap-2 border-r border-slate-200 bg-slate-50 px-3 text-sm text-slate-600">
              {leading}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'flex-1 border-0 bg-transparent px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none',
              disabled && 'cursor-not-allowed',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={helperText || error ? messageId : undefined}
            disabled={disabled}
            {...props}
          />
          {(loading || trailing) && (
            <div className="flex items-center gap-2 border-l border-slate-200 bg-slate-50 px-3 text-slate-600">
              {loading && <Loader2 size={16} className="animate-spin text-slate-400" />}
              {trailing}
            </div>
          )}
        </div>
        {error ? (
          <p id={messageId} className={fieldErrorMessage}>
            <AlertCircle size={12} className="mr-1" /> {error}
          </p>
        ) : helperText ? (
          <p id={messageId} className={fieldHelper}>
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

InputGroup.displayName = 'InputGroup';
