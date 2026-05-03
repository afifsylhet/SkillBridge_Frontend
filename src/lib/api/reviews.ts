import { apiCallOrThrow } from './client';

export interface ReviewItem {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    student: { id: string; name: string; avatarUrl: string | null };
}

export async function getReviews(tutorProfileId?: string): Promise<ReviewItem[]> {
    const qs = tutorProfileId ? `?tutorProfileId=${tutorProfileId}` : '';
    return apiCallOrThrow<ReviewItem[]>(`/reviews${qs}`, { method: 'GET' });
}

export async function createReview(payload: {
    bookingId: string;
    rating: number;
    comment: string;
}): Promise<ReviewItem> {
    return apiCallOrThrow<ReviewItem>('/reviews', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}
