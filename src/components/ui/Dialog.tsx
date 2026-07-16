'use client';

import { cn } from '@/lib/utils/cn';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export default function Dialog({ open, onOpenChange, title, children, footer, className }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-surface-border bg-surface shadow-card-hover animate-fade-in',
          className,
        )}
      >
        {title && (
          <div className="flex items-center justify-between gap-4 border-b border-surface-border px-5 py-4 md:px-6">
            <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition hover:bg-surface-muted hover:text-ink"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
        <div className="px-5 py-5 md:px-6">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-surface-border px-5 py-4 md:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
