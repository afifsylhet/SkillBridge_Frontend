'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
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
              className={`text-2xl transition ${
                n <= rating ? 'text-warning' : 'text-surface-border hover:text-warning/50'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <Textarea
          id="review-comment"
          label="Your feedback"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="What worked well? What could be improved?"
        />
        <p className="mt-1 text-xs text-ink-muted">{comment.length}/2000 characters</p>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={mutation.isPending}>
          Post review
        </Button>
      </div>
    </form>
  );
}
