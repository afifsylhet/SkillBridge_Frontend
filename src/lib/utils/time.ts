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

// All availability and booking display times are presented to users in
// Asia/Dhaka (UTC+6, no DST). Storage on the backend remains UTC minute-of-day,
// so we shift at the UI boundary.
export const DISPLAY_TZ_LABEL = 'BDT (UTC+6)';
const DISPLAY_TZ_OFFSET_MIN = 6 * 60;
const DAY_MIN = 24 * 60;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

/** Shift a UTC minute-of-day into Dhaka's minute-of-day (wrapping at midnight). */
export function utcMinutesToDhakaMinutes(minutesUtc: number): number {
  return mod(minutesUtc + DISPLAY_TZ_OFFSET_MIN, DAY_MIN);
}

/** Shift a Dhaka minute-of-day into UTC minute-of-day (wrapping at midnight). */
export function dhakaMinutesToUtcMinutes(minutesDhaka: number): number {
  return mod(minutesDhaka - DISPLAY_TZ_OFFSET_MIN, DAY_MIN);
}

/**
 * Convert minutes (as stored in DB, interpreted as UTC) to "HH:MM" display
 * in Asia/Dhaka time.
 */
export function minutesToTimeLabel(minutes: number): string {
  const dhaka = utcMinutesToDhakaMinutes(minutes);
  const h = Math.floor(dhaka / 60);
  const m = dhaka % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Convert "HH:MM" form input (Dhaka local) to a UTC minute-of-day value. */
export function timeStringToMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number);
  const dhakaMinutes = (h ?? 0) * 60 + (m ?? 0);
  return dhakaMinutesToUtcMinutes(dhakaMinutes);
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
  stepMin?: number,
): Date[] {
  const wd = jsWeekday(date);
  const windows = availability.filter((a) => a.weekday === wd);
  const now = Date.now();

  // Use duration as step interval if not explicitly provided
  const step = stepMin ?? durationMin;

  const bookings = existingBookings.map((b) => {
    const start = new Date(b.scheduledAt).getTime();
    return { start, end: start + b.durationMin * 60_000 };
  });

  const slots: Date[] = [];
  for (const w of windows) {
    for (let m = w.startMinute; m + durationMin <= w.endMinute; m += step) {
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
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Dhaka',
    timeZoneName: 'short',
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
