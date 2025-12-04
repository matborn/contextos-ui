import React, { forwardRef, useState } from 'react';
import { cn } from '../../utils';
import { AlertCircle } from '../icons/Icons';
import { fieldBase, fieldDescription, fieldDisabled, fieldError, fieldErrorMessage, fieldHelper, fieldLabel } from './formStyles';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  description?: string;
  error?: string;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, description, error, showCount, id, disabled, onChange, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    const messageId = `${textareaId}-message`;
    const [internalLength, setInternalLength] = useState(
      typeof props.defaultValue === 'string' ? props.defaultValue.length : 0
    );

    const valueLength =
      typeof props.value === 'string'
        ? props.value.length
        : typeof props.defaultValue === 'string'
          ? props.defaultValue.length
          : internalLength;

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
      setInternalLength(event.target.value.length);
      onChange?.(event);
    };

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className={fieldLabel}>
            {label}
          </label>
        )}
        {description && <p className={fieldDescription}>{description}</p>}
        <div className="relative">
          <textarea
            id={textareaId}
            ref={ref}
            className={cn(
              fieldBase,
              'min-h-[120px] resize-y',
              error && fieldError,
              disabled && fieldDisabled,
              className
            )}
            aria-invalid={!!error}
            aria-describedby={helperText || error ? messageId : undefined}
            disabled={disabled}
            onChange={handleChange}
            {...props}
          />
          {showCount && props.maxLength && (
            <div className="absolute bottom-2 right-3 text-[10px] font-medium text-slate-400">
              {valueLength}/{props.maxLength}
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

Textarea.displayName = 'Textarea';
