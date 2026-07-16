'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants/routes';
import { useAppRouter } from '@/lib/hooks/useAppRouter';

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const router = useAppRouter();
  const bookingId = searchParams.get('bookingId');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteBooking = async () => {
    if (!bookingId) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }

      router.push(ROUTES.DASHBOARD_BOOKINGS);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete booking');
    } finally {
      setDeleting(false);
    }
  };

  const handleRetryPayment = () => {
    router.push(ROUTES.DASHBOARD_BOOKINGS);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface p-8 text-center shadow-card md:p-9">
        <div className="mb-5 flex justify-center">
          <div className="rounded-full bg-amber-50 p-3.5 dark:bg-amber-950/40">
            <svg
              className="h-6 w-6 text-warning"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
          Payment cancelled
        </h1>
        <p className="mt-2 mb-6 text-sm leading-relaxed text-ink-soft">
          You cancelled the payment process. Your booking has not been confirmed yet.
        </p>

        <div className="mb-6 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
          <p className="text-sm text-ink-soft">What would you like to do next?</p>
        </div>

        {deleteError && (
          <div className="mb-4 rounded-xl border border-danger/30 bg-red-50 p-3 dark:bg-red-950/30">
            <p className="text-sm text-danger">{deleteError}</p>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <Button type="button" onClick={handleRetryPayment} disabled={deleting} className="w-full">
            Continue to dashboard
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteBooking}
            disabled={deleting || !bookingId}
            isLoading={deleting}
            className="w-full"
          >
            Delete booking
          </Button>
          <Link href={ROUTES.BROWSE_TUTORS}>
            <Button variant="secondary" className="w-full">
              Browse tutors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
