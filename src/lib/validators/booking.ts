import { z } from 'zod';

export const ALLOWED_DURATIONS = [30, 60, 90, 120] as const;

export const bookingCreateSchema = z.object({
  tutorProfileId: z.string().min(1),
  scheduledAt: z
    .string()
    .datetime({ message: 'Invalid date/time' })
    .refine((s) => new Date(s).getTime() > Date.now(), {
      message: 'Booking must be in the future',
    }),
  durationMin: z.number().int().refine((d) => (ALLOWED_DURATIONS as readonly number[]).includes(d), {
    message: 'Duration must be 30, 60, 90, or 120 minutes',
  }),
  notes: z.string().max(2000).optional(),
});

export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
