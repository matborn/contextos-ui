import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '../../utils';
import { AlertCircle, Check, Minus } from '../icons/Icons';
import { fieldDescription, fieldDisabled, fieldError, fieldErrorMessage, fieldHelper, fieldLabel } from './formStyles';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  helperText?: string;
  error?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, helperText, error, indeterminate, className, id, disabled, onChange, defaultChecked, checked, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id ?? generatedId;
    const messageId = `${checkboxId}-message`;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [internalChecked, setInternalChecked] = useState<boolean>(!!defaultChecked);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);

    const isChecked = typeof checked === 'boolean' ? checked : internalChecked;

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      if (checked === undefined) {
        setInternalChecked(event.target.checked);
      }
      onChange?.(event);
    };

    return (
      <div className="w-full space-y-1.5">
        <label
          htmlFor={checkboxId}
          className={cn(
            'group flex w-full cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm transition-all duration-200 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/20',
            error && fieldError,
            disabled && fieldDisabled,
            className
          )}
        >
          <span
            className={cn(
              'relative mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border transition-all duration-200',
              isChecked || indeterminate ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-slate-300',
              disabled ? 'opacity-70' : 'group-hover:border-primary-400'
            )}
          >
            <input
              id={checkboxId}
              ref={(node) => {
                inputRef.current = node;
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref) {
                  (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
                }
              }}
              type="checkbox"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-invalid={!!error}
              aria-label={label}
              aria-describedby={helperText || error ? messageId : undefined}
              disabled={disabled}
              onChange={handleChange}
              defaultChecked={defaultChecked}
              checked={checked}
              {...props}
            />
            {indeterminate ? (
              <Minus size={12} className="pointer-events-none" />
            ) : isChecked ? (
              <Check size={12} className="pointer-events-none" />
            ) : null}
          </span>
          <div className="flex-1 space-y-0.5">
            <span className={cn(fieldLabel, 'text-slate-800')}>{label}</span>
            {description && <p className={fieldDescription}>{description}</p>}
          </div>
        </label>
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

Checkbox.displayName = 'Checkbox';
