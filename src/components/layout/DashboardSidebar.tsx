'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';
import { useLogout } from '@/lib/hooks';

interface DashboardSidebarProps {
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
}

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const router = useRouter();
  const logoutMutation = useLogout();
  const isLoggingOut = logoutMutation.isPending;

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // ignore — fall through to redirect anyway so the user isn't stuck
    }
    router.push(ROUTES.HOME);
    router.refresh();
  };

  const getLinks = () => {
    if (role === 'STUDENT') {
      return [
        { label: 'Overview', href: ROUTES.DASHBOARD },
        { label: 'Bookings', href: ROUTES.DASHBOARD_BOOKINGS },
        { label: 'Profile', href: ROUTES.DASHBOARD_PROFILE },
      ];
    }
    if (role === 'TUTOR') {
      return [
        { label: 'Dashboard', href: ROUTES.TUTOR_DASHBOARD },
        { label: 'Profile', href: ROUTES.TUTOR_PROFILE },
        { label: 'Availability', href: ROUTES.TUTOR_AVAILABILITY },
      ];
    }
    if (role === 'ADMIN') {
      return [
        { label: 'Stats', href: ROUTES.ADMIN },
        { label: 'Users', href: ROUTES.ADMIN_USERS },
        { label: 'Bookings', href: ROUTES.ADMIN_BOOKINGS },
        { label: 'Categories', href: ROUTES.ADMIN_CATEGORIES },
      ];
    }
    return [];
  };

  return (
    <aside className="w-64 bg-surface-muted border-r border-surface-border h-screen sticky top-0 flex flex-col">
      <nav className="py-6 space-y-2 flex-1">
        {getLinks().map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-6 py-3 text-ink-soft hover:bg-surface hover:text-ink transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-surface-border p-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {isLoggingOut ? 'Logging out…' : 'Log out'}
        </button>
      </div>
    </aside>
  );
}
