export type UserRole = 'STUDENT' | 'TUTOR' | 'ADMIN';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatarUrl: string | null;
    isBanned?: boolean;
    createdAt?: string;
}

export interface CurrentUser extends User {
    isBanned: boolean;
    tutorProfile: CurrentUserTutorProfile | null;
}

export interface CurrentUserTutorProfile {
    id: string;
    bio: string;
    hourlyRate: number;
    experience: number;
    headline: string | null;
    isPublished: boolean;
    ratingAvg: number;
    ratingCount: number;
    categories: { id: string; name: string; slug: string }[];
}
