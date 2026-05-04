'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import { useToast } from '@/lib/hooks/useToast';
import { updateTutorAvailability } from '@/lib/api/tutors';
import {
  DISPLAY_TZ_LABEL,
  minutesToTimeLabel,
  ORDERED_WEEKDAYS,
  timeStringToMinutes,
  WEEKDAY_LABELS,
} from '@/lib/utils/time';
import type { AvailabilitySlot, Weekday } from '@/types/tutor';

interface TutorAvailabilityFormProps {
  initialSlots: AvailabilitySlot[];
}

interface DraftSlot {
  weekday: Weekday;
  startMinute: number;
  endMinute: number;
}

export default function TutorAvailabilityForm({ initialSlots }: TutorAvailabilityFormProps) {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [slots, setSlots] = useState<DraftSlot[]>(
    initialSlots.map((s) => ({
      weekday: s.weekday,
      startMinute: s.startMinute,
      endMinute: s.endMinute,
    })),
  );
  const [newWeekday, setNewWeekday] = useState<Weekday>('MONDAY');
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('12:00');

  const mutation = useMutation({
    mutationFn: () => updateTutorAvailability(slots),
    onSuccess: () => {
      showToast('Availability saved', 'success');
      qc.invalidateQueries({ queryKey: ['tutor', 'availability'] });
      qc.invalidateQueries({ queryKey: ['tutors'] });
    },
    onError: (err: Error) => showToast(err.message || 'Failed to save', 'error'),
  });

  const addSlot = () => {
    // Inputs are entered as Dhaka local time; helpers shift to UTC for storage.
    // We compare the original Dhaka values so the message lines up with what
    // the user typed (avoids confusion when the UTC shift wraps over midnight).
    const dhakaStart = newStart.split(':').map(Number);
    const dhakaEnd = newEnd.split(':').map(Number);
    const dhakaStartMin = (dhakaStart[0] ?? 0) * 60 + (dhakaStart[1] ?? 0);
    const dhakaEndMin = (dhakaEnd[0] ?? 0) * 60 + (dhakaEnd[1] ?? 0);
    if (dhakaStartMin >= dhakaEndMin) {
      showToast('End time must be after start time', 'error');
      return;
    }
    const start = timeStringToMinutes(newStart);
    const end = timeStringToMinutes(newEnd);
    if (slots.some((s) => s.weekday === newWeekday && s.startMinute === start)) {
      showToast('A slot already starts at that time', 'error');
      return;
    }
    setSlots((prev) => [...prev, { weekday: newWeekday, startMinute: start, endMinute: end }]);
    setNewStart('09:00');
    setNewEnd('12:00');
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-brand-200 bg-brand-50 p-4">
        <p className="text-sm text-brand-900">
          🕒 <strong>All times are in Asia/Dhaka ({DISPLAY_TZ_LABEL}).</strong> Just enter the
          hour you want to teach in your local time — we&apos;ll handle the conversion for
          students in other zones.
        </p>
      </div>
      <div className="rounded-lg border border-surface-border bg-surface-muted p-4">
        <h3 className="mb-3 text-sm font-semibold text-ink">Add availability window</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Weekday</label>
            <select
              value={newWeekday}
              onChange={(e) => setNewWeekday(e.target.value as Weekday)}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm"
            >
              {ORDERED_WEEKDAYS.map((d) => (
                <option key={d} value={d}>
                  {WEEKDAY_LABELS[d]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Start</label>
            <input
              type="time"
              value={newStart}
              onChange={(e) => setNewStart(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">End</label>
            <input
              type="time"
              value={newEnd}
              onChange={(e) => setNewEnd(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-end">
            <Button type="button" onClick={addSlot} className="w-full">
              Add
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Your weekly availability</h3>
        {slots.length === 0 ? (
          <div className="rounded-lg border border-dashed border-surface-border bg-surface-muted p-6 text-center text-sm text-ink-muted">
            No windows yet. Add your first availability above.
          </div>
        ) : (
          <ul className="space-y-2">
            {ORDERED_WEEKDAYS.map((day) => {
              const daySlots = slots
                .map((s, i) => ({ s, i }))
                .filter(({ s }) => s.weekday === day)
                .sort((a, b) => a.s.startMinute - b.s.startMinute);
              if (daySlots.length === 0) return null;
              return (
                <li
                  key={day}
                  className="rounded-lg border border-surface-border bg-surface px-4 py-3"
                >
                  <p className="mb-2 text-sm font-medium text-ink">{WEEKDAY_LABELS[day]}</p>
                  <div className="flex flex-wrap gap-2">
                    {daySlots.map(({ s, i }) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
                      >
                        {minutesToTimeLabel(s.startMinute)} – {minutesToTimeLabel(s.endMinute)}
                        <button
                          type="button"
                          onClick={() => removeSlot(i)}
                          aria-label="Remove slot"
                          className="text-brand-700 hover:text-brand-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="primary"
          onClick={() => mutation.mutate()}
          isLoading={mutation.isPending}
        >
          Save availability
        </Button>
      </div>
    </div>
  );
}
