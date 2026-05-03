'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Dialog = ({ open, onOpenChange, title, children, footer }: DialogProps) => {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-surface-border">
              <h2 className="text-lg font-semibold text-ink">{title}</h2>
              <button
                className="text-ink-muted hover:text-ink"
                onClick={() => onOpenChange(false)}
              >
                ✕
              </button>
            </div>
          )}

          <div className="p-6">{children}</div>

          {footer && (
            <div className="p-6 border-t border-surface-border flex gap-3 justify-end">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dialog;
