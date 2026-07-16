'use client';

import { useQuery } from '@tanstack/react-query';
import TutorCard from '@/components/tutors/TutorCard';
import EmptyState from '@/components/ui/EmptyState';
import PageLoader from '@/components/ui/PageLoader';
import { listFavorites } from '@/lib/api/favorites';
import { ROUTES } from '@/lib/constants/routes';
import type { TutorListItem } from '@/types/tutor';

function toTutorListItem(fav: Awaited<ReturnType<typeof listFavorites>>[number]): TutorListItem & {
  bio?: string;
} {
  const t = fav.tutor;
  return {
    id: t.id,
    user: t.user,
    headline: t.headline,
    hourlyRate: t.hourlyRate,
    ratingAvg: t.ratingAvg,
    ratingCount: t.ratingCount,
    categories: t.categories,
    bio: t.bio,
  };
}

export default function FavoritesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['favorites'],
    queryFn: listFavorites,
  });

  if (isLoading) {
    return <PageLoader label="Loading favorites…" />;
  }

  if (error) {
    return (
      <div>
        <h1 className="mb-2 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
          Favorites
        </h1>
        <div className="mt-6 rounded-2xl border border-danger/30 bg-danger/10 p-6 text-sm text-danger">
          Could not load favorites: {error.message}
        </div>
      </div>
    );
  }

  const favorites = data ?? [];

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
        Favorites
      </h1>
      <p className="mb-8 text-sm text-ink-muted">Tutors you have saved for quick access.</p>

      {favorites.length === 0 ? (
        <EmptyState
          headline="No favorites yet"
          description="Save tutors you like from their profile or the browse page."
          action={{
            label: 'Browse tutors',
            onClick: () => {
              window.location.href = ROUTES.BROWSE_TUTORS;
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {favorites.map((fav) => (
            <TutorCard key={fav.id} tutor={toTutorListItem(fav)} />
          ))}
        </div>
      )}
    </div>
  );
}
