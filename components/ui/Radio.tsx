import React, { createContext, forwardRef, useContext, useState } from 'react';
import { cn } from '../../utils';
import { AlertCircle } from '../icons/Icons';
import { fieldDescription, fieldDisabled, fieldError, fieldErrorMessage, fieldHelper, fieldLabel } from './formStyles';

interface RadioGroupContextValue {
  name: string;
  selectedValue?: string;
  disabled?: boolean;
  hasError?: boolean;
  setValue: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  label?: string;
  helperText?: string;
  description?: string;
  error?: string;
  options?: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  orientation?: 'vertical' | 'horizontal';
}

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string;
  description?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  helperText,
  description,
  error,
  options,
  value,
  defaultValue,
  onChange,
  name,
  orientation = 'vertical',
  disabled,
  children,
  className,
  ...props
}) => {
  const groupId = React.useId();
  const groupName = name || `radio-${groupId}`;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);

  const selectedValue = value !== undefined ? value : internalValue;

  const handleValueChange = (next: string) => {
    if (value === undefined) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  const content = options
    ? options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          label={option.label}
          description={option.description}
          disabled={disabled || option.disabled}
        />
      ))
    : children;

  return (
    <fieldset
      className={cn('w-full space-y-1.5', disabled && fieldDisabled, className)}
      aria-describedby={helperText || error ? `${groupName}-message` : undefined}
      {...props}
    >
      {label && (
        <legend className={cn(fieldLabel, 'mb-1')}>
          {label}
        </legend>
      )}
      {description && <p className={fieldDescription}>{description}</p>}
      <RadioGroupContext.Provider
        value={{
          name: groupName,
          selectedValue,
          disabled,
          hasError: !!error,
          setValue: handleValueChange,
        }}
      >
        <div className={orientation === 'horizontal' ? 'flex flex-wrap gap-3' : 'space-y-2'}>{content}</div>
      </RadioGroupContext.Provider>
      {error ? (
        <p id={`${groupName}-message`} className={fieldErrorMessage}>
          <AlertCircle size={12} className="mr-1" /> {error}
        </p>
      ) : helperText ? (
        <p id={`${groupName}-message`} className={fieldHelper}>
          {helperText}
        </p>
      ) : null}
    </fieldset>
  );
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className, disabled, value, name, onChange, ...props }, ref) => {
    const context = useContext(RadioGroupContext);
    const [internalChecked, setInternalChecked] = useState<boolean>(() => !!(props.defaultChecked ?? props.checked));
    const generatedName = React.useId();
    const radioName = name ?? context?.name ?? `radio-${generatedName}`;
    const isChecked = context ? context.selectedValue === value : props.checked ?? internalChecked;
    const hasError = context?.hasError;

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      context?.setValue(event.target.value);
      if (!context && props.checked === undefined) {
        setInternalChecked(event.target.checked);
      }
      onChange?.(event);
    };

    return (
      <label
        className={cn(
          'group flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm transition-all duration-200 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/20',
          hasError && fieldError,
          (disabled || context?.disabled) && fieldDisabled,
          className
        )}
      >
        <span
          className={cn(
            'relative mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-200',
            isChecked ? 'border-primary-600 bg-primary-50' : 'border-slate-300 bg-white',
            disabled || context?.disabled ? 'opacity-70' : 'group-hover:border-primary-400'
          )}
        >
          <input
            type="radio"
            ref={ref}
            name={radioName}
            value={value}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label={label}
            disabled={disabled || context?.disabled}
            onChange={handleChange}
            {...props}
          />
          <span
            className={cn(
              'flex h-2.5 w-2.5 rounded-full bg-primary-600 transition-all duration-200',
              isChecked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            )}
          />
        </span>
        <div className="flex-1 space-y-0.5">
          <span className={cn(fieldLabel, 'text-slate-800')}>{label}</span>
          {description && <p className={fieldDescription}>{description}</p>}
        </div>
      </label>
    );
  }
);

Radio.displayName = 'Radio';
