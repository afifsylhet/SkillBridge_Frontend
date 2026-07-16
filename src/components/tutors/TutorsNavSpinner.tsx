'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import Spinner from '@/components/ui/Spinner';

/** Full-viewport spinner while tutor filter / pagination transitions are pending. */
export default function TutorsNavSpinner({ show }: { show: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!show || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-surface/55 backdrop-blur-[1px]"
      role="status"
      aria-live="polite"
      aria-label="Loading tutors"
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-surface-border bg-surface px-8 py-7 shadow-card">
        <Spinner size="lg" className="h-14 w-14" />
        <p className="text-sm font-medium text-ink-muted">Loading tutors…</p>
      </div>
    </div>,
    document.body,
  );
}
