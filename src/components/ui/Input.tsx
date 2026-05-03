'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-ink mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2 rounded-lg border border-surface-border bg-surface text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors',
            error && 'border-danger focus:ring-danger',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.name}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${props.name}-error`} className="text-danger text-sm mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
