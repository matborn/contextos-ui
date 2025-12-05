import React, { forwardRef } from 'react';
import { cn } from '../../utils';
import { AlertCircle, ChevronDown, Loader2 } from '../icons/Icons';
import { fieldBase, fieldDescription, fieldDisabled, fieldError, fieldErrorMessage, fieldHelper, fieldLabel } from './formStyles';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  description?: string;
  error?: string;
  options?: SelectOption[];
  placeholder?: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      description,
      error,
      options,
      placeholder,
      loading,
      leftIcon,
      rightIcon,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    const messageId = `${selectId}-message`;

    const hasLeftIcon = Boolean(leftIcon);
    const hasRightAdornment = Boolean(rightIcon || loading);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className={fieldLabel}>
            {label}
          </label>
        )}
        {description && <p className={fieldDescription}>{description}</p>}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {leftIcon}
            </div>
          )}
          <select
            id={selectId}
            ref={ref}
            className={cn(
              fieldBase,
              'appearance-none pr-10',
              hasLeftIcon && 'pl-10',
              hasRightAdornment && 'pr-12',
              error && fieldError,
              disabled && fieldDisabled,
              className
            )}
            aria-invalid={!!error}
            aria-describedby={helperText || error ? messageId : undefined}
            aria-busy={loading || undefined}
            disabled={disabled || loading}
            {...props}
          >
            {placeholder && (
              <option value="" disabled={props.required}>
                {placeholder}
              </option>
            )}
            {options
              ? options.map((option) => (
                  <option key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                    {option.description ? ` — ${option.description}` : ''}
                  </option>
                ))
              : props.children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            {loading ? <Loader2 size={16} /> : rightIcon || <ChevronDown size={16} />}
          </div>
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

Select.displayName = 'Select';
