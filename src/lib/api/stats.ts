import { apiCallOrThrow } from './client';

export async function getPublicStats() {
  return apiCallOrThrow<{
    tutors: number;
    students: number;
    sessionsCompleted: number;
    categories: number;
    avgRating: number;
  }>('/stats/public');
}

export async function getRecentReviews(limit = 6) {
  return apiCallOrThrow<
    Array<{
      id: string;
      rating: number;
      comment: string;
      createdAt: string;
      studentName: string;
      studentAvatar: string | null;
      tutorName: string;
      tutorHeadline: string | null;
    }>
  >(`/stats/reviews/recent?limit=${limit}`);
}

export async function getStudentAnalytics() {
  return apiCallOrThrow<{
    byStatus: Record<string, number>;
    byMonth: Array<{ month: string; count: number }>;
    totalHours: number;
  }>('/analytics/student');
}

export async function getTutorAnalytics() {
  return apiCallOrThrow<{
    byStatus: Record<string, number>;
    byMonth: Array<{ month: string; sessions: number; earnings: number }>;
    totalEarnings: number;
    ratingAvg: number;
    ratingCount: number;
  }>('/analytics/tutor');
}
