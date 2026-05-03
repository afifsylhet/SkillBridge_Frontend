import type { TutorReviewSummary } from '@/types/tutor';

interface ReviewListProps {
  reviews: TutorReviewSummary[];
  ratingAvg: number;
  ratingCount: number;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span aria-label={`Rated ${rating} out of 5`} className="text-amber-500">
      {'★'.repeat(full)}
      <span className="text-surface-border">{'★'.repeat(Math.max(0, 5 - full))}</span>
    </span>
  );
}

export default function ReviewList({ reviews, ratingAvg, ratingCount }: ReviewListProps) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl font-bold text-ink">
          {ratingCount > 0 ? ratingAvg.toFixed(1) : '—'}
        </span>
        <div>
          <Stars rating={ratingAvg} />
          <p className="text-sm text-ink-muted">
            {ratingCount} {ratingCount === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-ink-muted">No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-surface-border bg-surface p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink">{r.student.name}</span>
                  <Stars rating={r.rating} />
                </div>
                <span className="text-xs text-ink-muted">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-ink-soft">{r.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
