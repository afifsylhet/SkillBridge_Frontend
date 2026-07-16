'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { getPaymentBySession } from '@/lib/api/payments';
import { ROUTES } from '@/lib/constants/routes';
import { useAppRouter } from '@/lib/hooks/useAppRouter';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useAppRouter();
  const sessionId = searchParams.get('sessionId');

  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'succeeded' | 'failed' | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('Missing session ID');
        setLoading(false);
        return;
      }

      try {
        const payment = await getPaymentBySession(sessionId);
        setPaymentStatus(payment.status === 'SUCCEEDED' ? 'succeeded' : 'failed');
        setBookingId(payment.bookingId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to verify payment');
        setPaymentStatus('failed');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  useEffect(() => {
    if (paymentStatus === 'succeeded' && bookingId) {
      const timer = setTimeout(() => {
        router.push(ROUTES.DASHBOARD_BOOKINGS);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, bookingId, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-ink-soft">Verifying payment…</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'succeeded') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
        <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface p-8 text-center shadow-card md:p-9">
          <div className="mb-5 flex justify-center">
            <div className="rounded-full bg-accent-soft p-3.5">
              <svg
                className="h-6 w-6 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
            Payment successful
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Your booking has been confirmed. A confirmation email has been sent to you.
          </p>
          <div className="my-6 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3">
            <p className="text-sm text-ink-soft">Redirecting to your dashboard in a few seconds…</p>
          </div>
          <Link href={ROUTES.DASHBOARD_BOOKINGS}>
            <Button className="w-full">Go to dashboard now</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface p-8 text-center shadow-card md:p-9">
        <div className="mb-5 flex justify-center">
          <div className="rounded-full bg-red-50 p-3.5 dark:bg-red-950/40">
            <svg
              className="h-6 w-6 text-danger"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Payment failed</h1>
        <p className="mt-2 mb-6 text-sm leading-relaxed text-ink-soft">
          {error || 'There was an issue processing your payment. Please try again.'}
        </p>
        <div className="flex gap-3">
          <Link href={ROUTES.DASHBOARD_BOOKINGS} className="flex-1">
            <Button variant="secondary" className="w-full">
              Back to dashboard
            </Button>
          </Link>
          <Button type="button" onClick={() => window.location.reload()} className="flex-1">
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
