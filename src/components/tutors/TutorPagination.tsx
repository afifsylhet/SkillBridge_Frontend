'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import Button from '@/components/ui/Button';
import TutorsNavSpinner from '@/components/tutors/TutorsNavSpinner';
import { signalNavigationStart } from '@/lib/navigation';

interface TutorPaginationProps {
  page: number;
  pageSize: number;
  total: number;
}

export default function TutorPagination({ page, pageSize, total }: TutorPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const goTo = (next: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next <= 1) params.delete('page');
    else params.set('page', String(next));
    signalNavigationStart();
    startTransition(() => {
      router.push(`/tutors${params.toString() ? `?${params.toString()}` : ''}`);
    });
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <TutorsNavSpinner show={isPending} />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1 || isPending}
      >
        Previous
      </Button>
      <span className="min-w-[7rem] text-center text-sm text-ink-muted">
        Page {page} of {totalPages}
      </span>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages || isPending}
      >
        Next
      </Button>
    </div>
  );
}
