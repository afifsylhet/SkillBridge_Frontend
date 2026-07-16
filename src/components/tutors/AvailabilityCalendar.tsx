import { minutesToTimeLabel, ORDERED_WEEKDAYS, WEEKDAY_LABELS } from '@/lib/utils/time';
import type { AvailabilitySlot } from '@/types/tutor';

interface AvailabilityCalendarProps {
  slots: AvailabilitySlot[];
}

export default function AvailabilityCalendar({ slots }: AvailabilityCalendarProps) {
  if (slots.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        This tutor hasn&apos;t set weekly availability yet.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {ORDERED_WEEKDAYS.map((day) => {
        const daySlots = slots
          .filter((s) => s.weekday === day)
          .sort((a, b) => a.startMinute - b.startMinute);
        if (daySlots.length === 0) return null;
        return (
          <li
            key={day}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-surface-border bg-surface-muted/50 px-4 py-2.5"
          >
            <span className="w-28 text-sm font-medium text-ink">{WEEKDAY_LABELS[day]}</span>
            <div className="flex flex-wrap gap-2">
              {daySlots.map((s, i) => (
                <span
                  key={`${day}-${i}`}
                  className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
                >
                  {minutesToTimeLabel(s.startMinute)} – {minutesToTimeLabel(s.endMinute)}
                </span>
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
