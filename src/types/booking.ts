export type BookingStatus = 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface BookingReviewSummary {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface BookingWithRelations {
  id: string;
  studentId: string;
  tutorProfileId: string;
  scheduledAt: string;
  durationMin: number;
  status: BookingStatus;
  notes: string | null;
  cancelledAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  tutorProfile: {
    id: string;
    hourlyRate: number;
    headline: string | null;
    user: { id: string; name: string; avatarUrl: string | null };
  };
  review: BookingReviewSummary | null;
}

export interface CreateBookingInput {
  tutorProfileId: string;
  scheduledAt: string;
  durationMin: 30 | 60 | 90 | 120;
  notes?: string;
}
