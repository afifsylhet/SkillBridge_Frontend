'use client';

import React from 'react';
import Button from './Button';
import { cn } from '@/lib/utils/cn';

interface EmptyStateProps {
  icon?: React.ReactNode;
  /** Preferred prop */
  headline?: string;
  /** Alias used by some pages */
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon,
  headline,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const heading = headline || title || 'Nothing here yet';

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-border bg-surface-muted/50 px-6 py-14 text-center',
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-2xl text-ink-muted shadow-card">
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-ink">{heading}</h3>
      {description && <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">{description}</p>}
      {action && (
        <div className="mt-6">
          <Button onClick={action.onClick} variant="primary" size="sm">
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
