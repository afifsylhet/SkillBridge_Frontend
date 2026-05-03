'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: (id: string) => void;
}

export function Toast({ id, type, message, onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => onClose(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-danger text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-warning text-white',
  };

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-4',
        typeStyles[type]
      )}
    >
      <span>{message}</span>
      <button
        onClick={() => onClose(id)}
        className="hover:opacity-80 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}
