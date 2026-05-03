import { z } from 'zod';

export const reviewCreateSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z
    .string()
    .min(10, 'Please share at least a sentence (10+ characters)')
    .max(2000),
});

export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
