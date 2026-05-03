export type Weekday =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface AvailabilitySlot {
  id?: string;
  weekday: Weekday;
  startMinute: number;
  endMinute: number;
}

export interface TutorReviewSummary {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  student: { id: string; name: string; avatarUrl: string | null };
}

export interface TutorListItem {
  id: string;
  user: { id: string; name: string; avatarUrl: string | null };
  headline: string | null;
  hourlyRate: number;
  ratingAvg: number;
  ratingCount: number;
  categories: Array<{ id: string; name: string; slug: string }>;
}

export interface TutorListResponse {
  items: TutorListItem[];
  page: number;
  pageSize: number;
  total: number;
}

export interface TutorDetail {
  id: string;
  user: { id: string; name: string; avatarUrl: string | null };
  bio: string;
  headline: string | null;
  hourlyRate: number;
  experience: number;
  ratingAvg: number;
  ratingCount: number;
  categories: Array<{ id: string; name: string; slug: string }>;
  availability: AvailabilitySlot[];
  reviews: TutorReviewSummary[];
  bookedRanges: Array<{ scheduledAt: string; durationMin: number }>;
}

export interface TutorListFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: 'rating' | 'priceAsc' | 'priceDesc' | 'newest';
  page?: number;
  pageSize?: number;
}
