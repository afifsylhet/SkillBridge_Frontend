'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-ink mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-2 rounded-lg border border-surface-border bg-surface text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors resize-none',
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

Textarea.displayName = 'Textarea';

export default Textarea;
