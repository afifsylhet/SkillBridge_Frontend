import { apiCallOrThrow } from './client';

export type FavoriteItem = {
  id: string;
  createdAt: string;
  tutor: {
    id: string;
    bio: string;
    headline: string | null;
    hourlyRate: number;
    experience: number;
    ratingAvg: number;
    ratingCount: number;
    user: { id: string; name: string; avatarUrl: string | null };
    categories: Array<{ id: string; name: string; slug: string }>;
  };
};

export async function listFavorites() {
  return apiCallOrThrow<FavoriteItem[]>('/favorites');
}

export async function checkFavorite(tutorProfileId: string) {
  return apiCallOrThrow<{ favorited: boolean }>(`/favorites/check/${tutorProfileId}`);
}

export async function addFavorite(tutorProfileId: string) {
  return apiCallOrThrow('/favorites', {
    method: 'POST',
    body: JSON.stringify({ tutorProfileId }),
  });
}

export async function removeFavorite(tutorProfileId: string) {
  return apiCallOrThrow(`/favorites/${tutorProfileId}`, { method: 'DELETE' });
}
