'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview } from '@/lib/api/reviews';
import { useToast } from '@/lib/hooks/useToast';
import { reviewCreateSchema } from '@/lib/validators/review';

interface ReviewFormProps {
  bookingId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ bookingId, onSuccess, onCancel }: ReviewFormProps) {
  const qc = useQueryClient();
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => createReview({ bookingId, rating, comment }),
    onSuccess: () => {
      showToast('Review posted!', 'success');
      qc.invalidateQueries({ queryKey: ['bookings'] });
      onSuccess?.();
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to post review', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = reviewCreateSchema.safeParse({ bookingId, rating, comment });
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      setError(first?.message ?? 'Invalid input');
      return;
    }
    setError(null);
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-ink">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`Rate ${n} star${n === 1 ? '' : 's'}`}
              className={`text-2xl transition ${n <= rating ? 'text-amber-500' : 'text-surface-border hover:text-amber-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="review-comment" className="mb-2 block text-sm font-medium text-ink">
          Your feedback
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="What worked well? What could be improved?"
          className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <p className="mt-1 text-xs text-ink-muted">{comment.length}/2000 characters</p>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-surface-border bg-surface px-4 py-2 text-sm font-medium text-ink hover:bg-surface-muted"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {mutation.isPending ? 'Posting…' : 'Post review'}
        </button>
      </div>
    </form>
  );
}
