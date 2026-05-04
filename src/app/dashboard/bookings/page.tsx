'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCancelBooking, useMyBookings } from '@/lib/hooks';
import { useToast } from '@/lib/hooks/useToast';
import { formatBookingTime } from '@/lib/utils/time';
import { ROUTES } from '@/lib/constants/routes';
import EmptyState from '@/components/ui/EmptyState';
import PageLoader from '@/components/ui/PageLoader';
import ReviewForm from '@/components/forms/ReviewForm';
import type { BookingWithRelations } from '@/types/booking';

type Tab = 'upcoming' | 'pending' | 'past' | 'cancelled';

export default function BookingsPage() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const [reviewing, setReviewing] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useMyBookings();
  const cancelMutation = useCancelBooking();
  const { showToast } = useToast();

  const bookings = data ?? [];
  const now = Date.now();

  const tabs = [
    { id: 'upcoming' as const, label: 'Upcoming' },
    { id: 'pending' as const, label: 'Pending' },
    { id: 'past' as const, label: 'Past' },
    { id: 'cancelled' as const, label: 'Cancelled' },
  ];

  const filtered = bookings.filter((b) => {
    if (tab === 'upcoming') return b.status === 'CONFIRMED' && new Date(b.scheduledAt).getTime() > now;
    if (tab === 'pending') return b.status === 'PENDING';
    if (tab === 'past') return b.status === 'COMPLETED' || (b.status === 'CONFIRMED' && new Date(b.scheduledAt).getTime() <= now);
    return b.status === 'CANCELLED';
  });

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this booking? Cancellations must be at least 2 hours before the session.')) return;
    try {
      await cancelMutation.mutateAsync(id);
      showToast('Booking cancelled', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel booking';
      showToast(message, 'error');
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">My Bookings</h1>

      <div className="mb-6 flex gap-1 rounded-lg bg-surface-muted p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
              tab === t.id ? 'bg-surface text-ink shadow-card' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageLoader label="Loading your bookings…" />
      ) : error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-6 text-sm text-danger">
          Could not load your bookings: {error.message}
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-3 underline"
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          headline={
            tab === 'upcoming'
              ? "You haven't booked any sessions yet"
              : tab === 'pending'
                ? 'No pending requests'
                : tab === 'past'
                  ? 'No past sessions yet'
                  : 'No cancelled bookings'
          }
          description={
            tab === 'upcoming'
              ? 'Browse tutors to schedule your first session.'
              : tab === 'pending'
                ? 'Requests waiting for tutor confirmation will show here.'
                : undefined
          }
          action={
            tab === 'upcoming'
              ? {
                  label: 'Browse tutors',
                  onClick: () => (window.location.href = ROUTES.BROWSE_TUTORS),
                }
              : undefined
          }
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((b) => (
            <BookingItem
              key={b.id}
              booking={b}
              tab={tab}
              onCancel={() => handleCancel(b.id)}
              cancelling={cancelMutation.isPending}
              isReviewing={reviewing === b.id}
              onStartReview={() => setReviewing(b.id)}
              onCancelReview={() => setReviewing(null)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

interface BookingItemProps {
  booking: BookingWithRelations;
  tab: Tab;
  onCancel: () => void;
  cancelling: boolean;
  isReviewing: boolean;
  onStartReview: () => void;
  onCancelReview: () => void;
}

function BookingItem({
  booking,
  tab,
  onCancel,
  cancelling,
  isReviewing,
  onStartReview,
  onCancelReview,
}: BookingItemProps) {
  const scheduledMs = new Date(booking.scheduledAt).getTime();
  const cutoffOk = scheduledMs - Date.now() >= 2 * 60 * 60 * 1000;
  const isCancellable =
    booking.status === 'PENDING' ||
    (tab === 'upcoming' && booking.status === 'CONFIRMED' && cutoffOk);
  const canReview = booking.status === 'COMPLETED' && !booking.review;

  return (
    <li className="rounded-xl bg-surface p-5 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/tutors/${booking.tutorProfile.id}`}
              className="font-semibold text-ink hover:text-brand-700"
            >
              {booking.tutorProfile.user.name}
            </Link>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                booking.status === 'CONFIRMED'
                  ? 'bg-brand-50 text-brand-700'
                  : booking.status === 'PENDING'
                    ? 'bg-amber-50 text-amber-700'
                    : booking.status === 'COMPLETED'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-danger'
              }`}
            >
              {booking.status}
            </span>
          </div>
          {booking.tutorProfile.headline && (
            <p className="text-sm text-ink-muted">{booking.tutorProfile.headline}</p>
          )}
          <p className="mt-2 text-sm text-ink-soft">
            {formatBookingTime(booking.scheduledAt)} · {booking.durationMin} min · $
            {(booking.tutorProfile.hourlyRate * booking.durationMin) / 60}
          </p>
          {booking.notes && (
            <p className="mt-2 text-sm italic text-ink-muted">“{booking.notes}”</p>
          )}
          {booking.review && (
            <p className="mt-2 text-sm text-ink-soft">
              Your review: <span className="text-amber-500">{'★'.repeat(booking.review.rating)}</span>
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          {isCancellable && (
            <button
              type="button"
              onClick={onCancel}
              disabled={cancelling}
              className="rounded-lg border border-danger text-danger px-4 py-2 text-sm font-medium hover:bg-red-50 disabled:opacity-50"
            >
              {cancelling ? 'Cancelling…' : 'Cancel'}
            </button>
          )}
          {tab === 'upcoming' && booking.status === 'CONFIRMED' && !cutoffOk && (
            <p className="text-xs text-ink-muted">Cancellation requires 2h notice</p>
          )}
          {canReview && !isReviewing && (
            <button
              type="button"
              onClick={onStartReview}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Leave review
            </button>
          )}
        </div>
      </div>

      {isReviewing && (
        <div className="mt-4 border-t border-surface-border pt-4">
          <ReviewForm
            bookingId={booking.id}
            onSuccess={onCancelReview}
            onCancel={onCancelReview}
          />
        </div>
      )}
    </li>
  );
}
