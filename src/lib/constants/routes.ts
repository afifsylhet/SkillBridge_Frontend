/**
 * Centralized route strings and constants.
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  BROWSE_TUTORS: '/tutors',
  TUTOR_DETAIL: (id: string) => `/tutors/${id}`,

  // Student dashboard
  DASHBOARD: '/dashboard',
  DASHBOARD_BOOKINGS: '/dashboard/bookings',
  DASHBOARD_SESSIONS: '/dashboard/sessions',
  DASHBOARD_PROFILE: '/dashboard/profile',

  // Tutor dashboard
  TUTOR_DASHBOARD: '/tutor/dashboard',
  TUTOR_SESSIONS: '/tutor/sessions',
  TUTOR_PROFILE: '/tutor/profile',
  TUTOR_AVAILABILITY: '/tutor/availability',

  // Admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_CATEGORIES: '/admin/categories',
};

export const PROTECTED_ROUTES = {
  STUDENT: [
    ROUTES.DASHBOARD,
    ROUTES.DASHBOARD_BOOKINGS,
    ROUTES.DASHBOARD_SESSIONS,
    ROUTES.DASHBOARD_PROFILE,
  ],
  TUTOR: [
    ROUTES.TUTOR_DASHBOARD,
    ROUTES.TUTOR_SESSIONS,
    ROUTES.TUTOR_PROFILE,
    ROUTES.TUTOR_AVAILABILITY,
  ],
  ADMIN: [ROUTES.ADMIN, ROUTES.ADMIN_USERS, ROUTES.ADMIN_BOOKINGS, ROUTES.ADMIN_CATEGORIES],
};
