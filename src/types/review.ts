export interface Review {
  id: string;
  bookingId: string;
  studentId: string;
  tutorProfileId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface ReviewWithStudent extends Review {
  student: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    [key in 1 | 2 | 3 | 4 | 5]: number;
  };
}
