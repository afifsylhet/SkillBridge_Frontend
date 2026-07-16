/**
 * Centralized route strings and constants.
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  BROWSE_TUTORS: '/tutors',
  TUTOR_DETAIL: (id: string) => `/tutors/${id}`,
  ABOUT: '/about',
  CONTACT: '/contact',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  HELP: '/help',
  PRIVACY: '/privacy',
  TERMS: '/terms',

  // Student dashboard
  DASHBOARD: '/dashboard',
  DASHBOARD_BOOKINGS: '/dashboard/bookings',
  DASHBOARD_SESSIONS: '/dashboard/sessions',
  DASHBOARD_FAVORITES: '/dashboard/favorites',
  DASHBOARD_MESSAGES: '/dashboard/messages',
  DASHBOARD_PROFILE: '/dashboard/profile',

  // Tutor dashboard
  TUTOR_DASHBOARD: '/tutor/dashboard',
  TUTOR_SESSIONS: '/tutor/sessions',
  TUTOR_MESSAGES: '/tutor/messages',
  TUTOR_PROFILE: '/tutor/profile',
  TUTOR_AVAILABILITY: '/tutor/availability',

  // Admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_BLOG: '/admin/blog',
  ADMIN_CONTACTS: '/admin/contacts',
  ADMIN_NEWSLETTER: '/admin/newsletter',
};

export const DEMO_CREDENTIALS = {
  student: { email: 'student@skillbridge.com', password: 'Student@123' },
  tutor: { email: 'tutor1@skillbridge.com', password: 'Tutor@123' },
  admin: { email: 'admin@skillbridge.com', password: 'admin123' },
} as const;

export const SITE = {
  name: 'SkillBridge',
  email: 'hello@skillbridge.com',
  social: {
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
  },
} as const;

export const PROTECTED_ROUTES = {
  STUDENT: [
    ROUTES.DASHBOARD,
    ROUTES.DASHBOARD_BOOKINGS,
    ROUTES.DASHBOARD_SESSIONS,
    ROUTES.DASHBOARD_FAVORITES,
    ROUTES.DASHBOARD_MESSAGES,
    ROUTES.DASHBOARD_PROFILE,
  ],
  TUTOR: [
    ROUTES.TUTOR_DASHBOARD,
    ROUTES.TUTOR_SESSIONS,
    ROUTES.TUTOR_MESSAGES,
    ROUTES.TUTOR_PROFILE,
    ROUTES.TUTOR_AVAILABILITY,
  ],
  ADMIN: [
    ROUTES.ADMIN,
    ROUTES.ADMIN_USERS,
    ROUTES.ADMIN_BOOKINGS,
    ROUTES.ADMIN_CATEGORIES,
    ROUTES.ADMIN_BLOG,
    ROUTES.ADMIN_CONTACTS,
    ROUTES.ADMIN_NEWSLETTER,
  ],
};
