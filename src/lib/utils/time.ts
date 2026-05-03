// Time slot generation and weekday utilities. See prd.md §6.2.
import type { AvailabilitySlot, Weekday } from '@/types/tutor';

const WEEKDAY_FROM_JS: Record<number, Weekday> = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
};

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
};

export const ORDERED_WEEKDAYS: Weekday[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

/**
 * Convert minutes (as stored in DB, interpreted as UTC) to "HH:MM" display.
 * Always displays in UTC, regardless of user's timezone.
 */
export function minutesToTimeLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} UTC`;
}

export function timeStringToMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function jsWeekday(date: Date): Weekday {
  return WEEKDAY_FROM_JS[date.getDay()]!;
}

// Availability is stored as a "naive" minute-of-day that the backend
// interprets in UTC. We build the booking timestamp at UTC on the same
// calendar day the user picked locally, so the local "Monday" the user
// sees maps to UTC Monday on the server.
function setMinutesOfDay(date: Date, minutes: number): Date {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), h, m, 0, 0));
}

interface ExistingBooking {
  scheduledAt: string | Date;
  durationMin: number;
}

function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function generateSlotsForDate(
  date: Date,
  durationMin: 30 | 60 | 90 | 120,
  availability: AvailabilitySlot[],
  existingBookings: ExistingBooking[],
  stepMin = 30,
): Date[] {
  const wd = jsWeekday(date);
  const windows = availability.filter((a) => a.weekday === wd);
  const now = Date.now();

  const bookings = existingBookings.map((b) => {
    const start = new Date(b.scheduledAt).getTime();
    return { start, end: start + b.durationMin * 60_000 };
  });

  const slots: Date[] = [];
  for (const w of windows) {
    for (let m = w.startMinute; m + durationMin <= w.endMinute; m += stepMin) {
      const start = setMinutesOfDay(date, m);
      const startTs = start.getTime();
      const endTs = startTs + durationMin * 60_000;
      if (startTs <= now) continue;
      const conflict = bookings.some((b) => rangesOverlap(startTs, endTs, b.start, b.end));
      if (conflict) continue;
      slots.push(start);
    }
  }
  return slots;
}

export function isDateInAvailability(date: Date, availability: AvailabilitySlot[]): boolean {
  const wd = jsWeekday(date);
  return availability.some((a) => a.weekday === wd);
}

export function formatBookingTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatRelativeDate(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7 && diffDays > 0) return `In ${diffDays} days`;
  return target.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Backwards-compatible aliases used in older form components.
export const minutesToTime = minutesToTimeLabel;
export const timeToMinutes = timeStringToMinutes;
