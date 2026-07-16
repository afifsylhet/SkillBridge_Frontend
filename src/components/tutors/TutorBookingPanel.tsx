'use client';

import { useState } from 'react';
import Link from 'next/link';
import BookingDialog from '@/components/booking/BookingDialog';
import MessageTutorButton from '@/components/tutors/MessageTutorButton';
import Button from '@/components/ui/Button';
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
      <div className="sticky top-24 rounded-2xl border border-surface-border bg-surface p-6 shadow-card">
        <div className="mb-5">
          <p className="text-sm text-ink-muted">Hourly rate</p>
          <p className="mt-1 font-display text-3xl font-bold tracking-tight text-brand-600">
            ${hourlyRate}
            <span className="text-base font-medium text-ink-muted">/hr</span>
          </p>
        </div>

        {isLoading ? (
          <div className="h-11 w-full animate-pulse rounded-xl bg-surface-muted" />
        ) : !user ? (
          <Link href="/login" className="block">
            <Button variant="primary" className="w-full">
              Log in to book
            </Button>
          </Link>
        ) : !canBook ? (
          <div className="rounded-xl bg-surface-muted px-3 py-3 text-center text-sm text-ink-muted">
            Only students can book sessions.
          </div>
        ) : noAvailability ? (
          <div className="rounded-xl bg-surface-muted px-3 py-3 text-center text-sm text-ink-muted">
            This tutor hasn&apos;t set their availability yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            <Button type="button" variant="primary" className="w-full" onClick={() => setOpen(true)}>
              Book a session
            </Button>
            <MessageTutorButton tutorProfileId={tutorProfileId} />
          </div>
        )}

        <p className="mt-4 text-center text-xs leading-relaxed text-ink-muted">
          Secure Stripe checkout · Tutor confirms after payment
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
