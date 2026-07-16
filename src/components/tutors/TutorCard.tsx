'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TutorListItem } from '@/types/tutor';
import { useCurrentUser } from '@/lib/hooks';
import { addFavorite, checkFavorite, removeFavorite } from '@/lib/api/favorites';
import { ROUTES } from '@/lib/constants/routes';

interface TutorCardProps {
  tutor: TutorListItem & { bio?: string };
  showFavorite?: boolean;
}

export default function TutorCard({ tutor, showFavorite = true }: TutorCardProps) {
  const initial = tutor.user.name?.[0]?.toUpperCase() ?? '?';
  const { data: user } = useCurrentUser();
  const qc = useQueryClient();
  const isStudent = user?.role === 'STUDENT';

  const { data: fav } = useQuery({
    queryKey: ['favorite', tutor.id],
    queryFn: () => checkFavorite(tutor.id),
    enabled: Boolean(isStudent && showFavorite),
  });

  const toggle = useMutation({
    mutationFn: async () => {
      if (fav?.favorited) await removeFavorite(tutor.id);
      else await addFavorite(tutor.id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['favorite', tutor.id] });
      qc.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const shortBio =
    tutor.bio && tutor.bio.length > 0
      ? tutor.bio.slice(0, 96) + (tutor.bio.length > 96 ? '…' : '')
      : null;

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-surface-border bg-surface p-5 shadow-card transition hover:shadow-card-hover md:p-6">
      {isStudent && showFavorite && (
        <button
          type="button"
          aria-label={fav?.favorited ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-surface-border bg-surface text-ink-muted transition hover:border-danger/30 hover:text-danger"
          onClick={(e) => {
            e.preventDefault();
            toggle.mutate();
          }}
          disabled={toggle.isPending}
        >
          <svg
            className={`h-4 w-4 ${fav?.favorited ? 'fill-danger text-danger' : ''}`}
            fill={fav?.favorited ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      )}

      <div className="mb-4 flex items-center gap-3.5 pr-8">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-50 text-lg font-semibold text-brand-700 ring-1 ring-surface-border">
          {tutor.user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tutor.user.avatarUrl} alt={tutor.user.name} className="h-full w-full object-cover" />
          ) : (
            <span>{initial}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-ink">{tutor.user.name}</h3>
          <p className="mt-0.5 truncate text-sm text-ink-muted">{tutor.headline ?? 'Tutor'}</p>
        </div>
      </div>

      {shortBio && <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-ink-soft">{shortBio}</p>}

      <div className="mb-5 flex flex-wrap gap-1.5">
        {tutor.categories.slice(0, 3).map((c) => (
          <span
            key={c.id}
            className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-ink-soft"
          >
            {c.name}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-surface-border pt-4">
        <div>
          <p className="text-xs text-ink-muted">From</p>
          <p className="text-lg font-semibold tracking-tight text-brand-600">${tutor.hourlyRate}/hr</p>
          <p className="mt-0.5 text-xs text-ink-muted">
            ★ {tutor.ratingAvg ? tutor.ratingAvg.toFixed(1) : 'New'} · {tutor.ratingCount} reviews
          </p>
        </div>
        <Link
          href={ROUTES.TUTOR_DETAIL(tutor.id)}
          className="inline-flex h-10 items-center rounded-xl bg-brand-600 px-3.5 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
