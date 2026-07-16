'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, hint, id, name, ...props }, ref) => {
    const inputId = id || name;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          className={cn(
            'field field-focus:focus w-full rounded-xl border border-surface-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500',
            error && 'border-danger focus:ring-danger',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
          {...props}
        />
        {hint && !error && (
          <p id={`${name}-hint`} className="text-xs text-ink-muted">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${name}-error`} className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
