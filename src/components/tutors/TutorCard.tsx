import Link from 'next/link';
import type { TutorListItem } from '@/types/tutor';

interface TutorCardProps {
  tutor: TutorListItem;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const initial = tutor.user.name?.[0]?.toUpperCase() ?? '?';
  return (
    <Link
      href={`/tutors/${tutor.id}`}
      className="group flex h-full flex-col rounded-2xl bg-surface p-6 shadow-card transition hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-lg font-semibold text-brand-700">
          {tutor.user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tutor.user.avatarUrl}
              alt={tutor.user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{initial}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-ink">{tutor.user.name}</h3>
          <p className="truncate text-sm text-ink-muted">
            {tutor.headline ?? 'Tutor'}
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {tutor.categories.slice(0, 3).map((c) => (
          <span
            key={c.id}
            className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
          >
            {c.name}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-end justify-between">
        <div>
          <p className="text-xs text-ink-muted">From</p>
          <p className="text-lg font-semibold text-brand-600">${tutor.hourlyRate}/hr</p>
        </div>
        <div className="text-right text-sm">
          <p className="font-semibold text-ink">
            <span aria-hidden>★</span> {tutor.ratingAvg ? tutor.ratingAvg.toFixed(1) : 'New'}
          </p>
          <p className="text-xs text-ink-muted">
            {tutor.ratingCount} {tutor.ratingCount === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>
    </Link>
  );
}
