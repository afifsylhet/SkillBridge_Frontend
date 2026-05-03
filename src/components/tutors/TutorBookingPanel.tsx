'use client';

import { useState } from 'react';
import Link from 'next/link';
import BookingDialog from '@/components/booking/BookingDialog';
import { useCurrentUser } from '@/lib/auth/client';
import type { AvailabilitySlot } from '@/types/tutor';

interface TutorBookingPanelProps {
  tutorProfileId: string;
  tutorName: string;
  hourlyRate: number;
  availability: AvailabilitySlot[];
  bookedRanges: { scheduledAt: string; durationMin: number }[];
}

export default function TutorBookingPanel({
  tutorProfileId,
  tutorName,
  hourlyRate,
  availability,
  bookedRanges,
}: TutorBookingPanelProps) {
  const [open, setOpen] = useState(false);
  const { data: user, isLoading } = useCurrentUser();

  const canBook = user?.role === 'STUDENT';
  const noAvailability = availability.length === 0;

  return (
    <>
      <div className="sticky top-24 rounded-2xl bg-surface p-6 shadow-card">
        <div className="mb-4">
          <p className="text-sm text-ink-muted">Hourly rate</p>
          <p className="text-3xl font-bold text-brand-600">${hourlyRate}/hr</p>
        </div>

        {isLoading ? (
          <div className="h-11 w-full animate-pulse rounded-lg bg-surface-muted" />
        ) : !user ? (
          <Link
            href="/login"
            className="block w-full rounded-lg bg-brand-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-brand-700"
          >
            Log in to book
          </Link>
        ) : !canBook ? (
          <div className="rounded-lg bg-surface-muted p-3 text-center text-sm text-ink-muted">
            Only students can book sessions.
          </div>
        ) : noAvailability ? (
          <div className="rounded-lg bg-surface-muted p-3 text-center text-sm text-ink-muted">
            This tutor hasn&apos;t set their availability yet.
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="block w-full rounded-lg bg-brand-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-brand-700"
          >
            Book a session
          </button>
        )}

        <p className="mt-3 text-center text-xs text-ink-muted">
          Confirmed instantly · No payment required
        </p>
      </div>

      {canBook && (
        <BookingDialog
          open={open}
          onClose={() => setOpen(false)}
          tutorProfileId={tutorProfileId}
          tutorName={tutorName}
          hourlyRate={hourlyRate}
          availability={availability}
          bookedRanges={bookedRanges}
        />
      )}
    </>
  );
}
