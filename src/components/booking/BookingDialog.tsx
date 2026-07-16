'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStripe } from '@stripe/react-stripe-js';
import { useCreateBooking } from '@/lib/hooks';
import { useToast } from '@/lib/hooks/useToast';
import { initiateCheckout } from '@/lib/api/payments';
import {
  formatRelativeDate,
  generateSlotsForDate,
  isDateInAvailability,
  jsWeekday,
  WEEKDAY_LABELS,
} from '@/lib/utils/time';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import type { AvailabilitySlot } from '@/types/tutor';

const DURATION_OPTIONS = [30, 60, 90, 120] as const;
type Duration = (typeof DURATION_OPTIONS)[number];

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  tutorProfileId: string;
  tutorName: string;
  hourlyRate: number;
  availability: AvailabilitySlot[];
  bookedRanges: { scheduledAt: string; durationMin: number }[];
}

function nextAvailableDate(availability: AvailabilitySlot[]): Date {
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const candidate = new Date(today);
    candidate.setDate(today.getDate() + i);
    if (isDateInAvailability(candidate, availability)) return candidate;
  }
  return today;
}

function nextNDays(n: number): Date[] {
  const out: Date[] = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push(d);
  }
  return out;
}

function formatTimeOfDay(date: Date): string {
  // Slots are stored as UTC minute-of-day; show them to users in Dhaka time.
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Dhaka',
    hour12: true,
  });
}

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function BookingDialog({
  open,
  onClose,
  tutorProfileId,
  tutorName,
  hourlyRate,
  availability,
  bookedRanges,
}: BookingDialogProps) {
  const router = useRouter();
  const stripe = useStripe();
  const { showToast } = useToast();
  const createBooking = useCreateBooking();

  const [duration, setDuration] = useState<Duration>(60);
  const [selectedDate, setSelectedDate] = useState<Date>(() => nextAvailableDate(availability));
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedSlot(null);
      setNotes('');
    } else {
      setSelectedDate(nextAvailableDate(availability));
    }
  }, [open, availability]);

  const days = useMemo(() => nextNDays(14), []);

  const slots = useMemo(
    () => generateSlotsForDate(selectedDate, duration, availability, bookedRanges),
    [selectedDate, duration, availability, bookedRanges],
  );

  if (!open) return null;

  const handleConfirm = async () => {
    if (!selectedSlot) {
      showToast('Pick a time slot first', 'error');
      return;
    }

    if (!stripe) {
      showToast('Payment system not ready. Please refresh the page.', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create the booking
      const booking = await createBooking.mutateAsync({
        tutorProfileId,
        scheduledAt: selectedSlot.toISOString(),
        durationMin: duration,
        notes: notes.trim() || undefined,
      });

      showToast('Booking created. Redirecting to payment...', 'success');

      // Step 2: Initiate payment checkout
      const paymentResponse = await initiateCheckout(booking.id);

      // Step 3: Redirect to Stripe checkout
      if (paymentResponse.checkoutUrl) {
        window.location.href = paymentResponse.checkoutUrl;
      } else {
        showToast('Failed to initiate payment. Please try again.', 'error');
        setIsProcessing(false);
      }

      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to book. Please try again.';
      showToast(message, 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-surface-border bg-surface shadow-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-surface-border p-6">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
              Book a session
            </h2>
            <p className="mt-0.5 text-sm text-ink-muted">with {tutorName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking dialog"
            className="rounded-xl p-2 text-ink-muted transition hover:bg-surface-muted"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Duration</label>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDuration(d);
                    setSelectedSlot(null);
                  }}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    duration === d
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-surface-border bg-surface text-ink hover:bg-surface-muted'
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-ink-muted">
              Estimated cost: ${(hourlyRate * duration) / 60} ({duration} min × ${hourlyRate}/hr)
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Date</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {days.map((d) => {
                const isSelected = dateKey(d) === dateKey(selectedDate);
                const hasAvailability = isDateInAvailability(d, availability);
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    disabled={!hasAvailability}
                    onClick={() => {
                      setSelectedDate(d);
                      setSelectedSlot(null);
                    }}
                    className={`flex min-w-[5.5rem] shrink-0 flex-col items-center rounded-xl border px-3 py-2.5 text-center text-sm transition ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : hasAvailability
                          ? 'border-surface-border bg-surface text-ink hover:bg-surface-muted'
                          : 'cursor-not-allowed border-surface-border bg-surface-muted text-ink-muted/60'
                    }`}
                  >
                    <span className="text-xs uppercase tracking-wider">
                      {formatRelativeDate(d)}
                    </span>
                    <span className="text-base font-semibold">{WEEKDAY_LABELS[jsWeekday(d)]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Time (Asia/Dhaka)</label>
            {slots.length === 0 ? (
              <div className="rounded-xl border border-surface-border bg-surface-muted px-4 py-4 text-sm text-ink-muted">
                No available slots for this day. Try another date or duration.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.map((slot) => {
                  const isSelected =
                    selectedSlot && selectedSlot.getTime() === slot.getTime();
                  return (
                    <button
                      key={slot.toISOString()}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                        isSelected
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-surface-border bg-surface text-ink hover:bg-surface-muted'
                      }`}
                    >
                      {formatTimeOfDay(slot)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <Textarea
            id="booking-notes"
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="What would you like to focus on?"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-surface-border p-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedSlot || isProcessing}
            isLoading={isProcessing}
          >
            {isProcessing ? 'Processing payment…' : 'Book & pay'}
          </Button>
        </div>
      </div>
    </div>
  );
}
