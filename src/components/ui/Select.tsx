'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  options: Array<{ value: string; label: string }>;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-ink mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2 rounded-lg border border-surface-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors',
            error && 'border-danger focus:ring-danger',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.name}-error` : undefined}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${props.name}-error`} className="text-danger text-sm mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
