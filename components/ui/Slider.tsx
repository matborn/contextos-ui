import React, { forwardRef, useState } from 'react';
import { cn } from '../../utils';
import { AlertCircle } from '../icons/Icons';
import { fieldDescription, fieldDisabled, fieldError, fieldErrorMessage, fieldHelper, fieldLabel } from './formStyles';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  description?: string;
  error?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      label,
      helperText,
      description,
      error,
      showValue = true,
      formatValue,
      disabled,
      id,
      min = 0,
      max = 100,
      step = 1,
      onChange,
      defaultValue,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const sliderId = id ?? generatedId;
    const messageId = `${sliderId}-message`;
    const [internalValue, setInternalValue] = useState<number>(Number(defaultValue ?? min));

    const currentValue = value !== undefined ? Number(value) : internalValue;

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      const next = Number(event.target.value);
      if (value === undefined) {
        setInternalValue(next);
      }
      onChange?.(event);
    };

    const displayValue = formatValue ? formatValue(currentValue) : currentValue;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={sliderId} className={fieldLabel}>
            {label}
          </label>
        )}
        {description && <p className={fieldDescription}>{description}</p>}
        <div
          className={cn(
            'rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm transition-all duration-200 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/20',
            error && fieldError,
            disabled && fieldDisabled
          )}
        >
          <div className="flex items-center gap-3">
            <input
              id={sliderId}
              ref={ref}
              type="range"
              min={min}
              max={max}
              step={step}
              value={currentValue}
              onChange={handleChange}
              className={cn(
                'w-full cursor-pointer rounded-full bg-slate-200 accent-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                disabled && 'cursor-not-allowed opacity-60',
                className
              )}
              aria-invalid={!!error}
              aria-describedby={helperText || error ? messageId : undefined}
              disabled={disabled}
              {...props}
            />
            {showValue && (
              <span className="w-14 text-right text-sm font-medium text-slate-700">{displayValue}</span>
            )}
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-wide text-slate-400">
            <span>{min}</span>
            <span>{max}</span>
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

Slider.displayName = 'Slider';
