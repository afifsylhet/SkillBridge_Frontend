import { z } from 'zod';

export const tutorProfileSchema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(1000),
  hourlyRate: z.number().int().positive('Hourly rate must be positive'),
  experience: z.number().int().min(0).default(0),
  headline: z.string().optional(),
  categoryIds: z.array(z.string().cuid()).min(1, 'Must select at least one category'),
  isPublished: z.boolean().default(false),
});

export type TutorProfileInput = z.infer<typeof tutorProfileSchema>;

export const availabilitySchema = z.object({
  weekday: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
  startMinute: z.number().int().min(0).max(1440),
  endMinute: z.number().int().min(0).max(1440),
}).refine(data => data.startMinute < data.endMinute, {
  message: 'Start time must be before end time',
  path: ['endMinute'],
});

export type AvailabilityInput = z.infer<typeof availabilitySchema>;

export const availabilityListSchema = z.object({
  availabilities: z.array(availabilitySchema),
});

export type AvailabilityListInput = z.infer<typeof availabilityListSchema>;
