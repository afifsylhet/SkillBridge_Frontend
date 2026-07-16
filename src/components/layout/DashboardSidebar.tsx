'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ROUTES } from '@/lib/constants/routes';
import { useCurrentUser, useLogout } from '@/lib/hooks';
import { useAppRouter } from '@/lib/hooks/useAppRouter';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface DashboardSidebarProps {
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
}

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const router = useAppRouter();
  const pathname = usePathname();
  const logoutMutation = useLogout();
  const { data: user } = useCurrentUser();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const isLoggingOut = logoutMutation.isPending;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // ignore
    }
    router.push(ROUTES.HOME);
    router.refresh();
  };

  const getLinks = () => {
    if (role === 'STUDENT') {
      return [
        { label: 'Overview', href: ROUTES.DASHBOARD },
        { label: 'My Sessions', href: ROUTES.DASHBOARD_SESSIONS },
        { label: 'Bookings', href: ROUTES.DASHBOARD_BOOKINGS },
        { label: 'Favorites', href: ROUTES.DASHBOARD_FAVORITES },
        { label: 'Messages', href: ROUTES.DASHBOARD_MESSAGES },
        { label: 'Profile', href: ROUTES.DASHBOARD_PROFILE },
      ];
    }
    if (role === 'TUTOR') {
      return [
        { label: 'Dashboard', href: ROUTES.TUTOR_DASHBOARD },
        { label: 'My Sessions', href: ROUTES.TUTOR_SESSIONS },
        { label: 'Messages', href: ROUTES.TUTOR_MESSAGES },
        { label: 'Profile', href: ROUTES.TUTOR_PROFILE },
        { label: 'Availability', href: ROUTES.TUTOR_AVAILABILITY },
      ];
    }
    return [
      { label: 'Overview', href: ROUTES.ADMIN },
      { label: 'Users', href: ROUTES.ADMIN_USERS },
      { label: 'Bookings', href: ROUTES.ADMIN_BOOKINGS },
      { label: 'Categories', href: ROUTES.ADMIN_CATEGORIES },
      { label: 'Blog', href: ROUTES.ADMIN_BLOG },
      { label: 'Contacts', href: ROUTES.ADMIN_CONTACTS },
      { label: 'Newsletter', href: ROUTES.ADMIN_NEWSLETTER },
    ];
  };

  const profileHref =
    role === 'TUTOR'
      ? ROUTES.TUTOR_PROFILE
      : role === 'ADMIN'
        ? ROUTES.ADMIN
        : ROUTES.DASHBOARD_PROFILE;

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-surface-border bg-surface">
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-4">
        <Link href={ROUTES.HOME} className="font-display text-lg font-bold tracking-tight text-brand-600">
          SkillBridge
        </Link>
        <ThemeToggle />
      </div>

      <div className="relative border-b border-surface-border p-3" ref={profileRef}>
        <button
          type="button"
          aria-expanded={profileOpen}
          aria-haspopup="menu"
          onClick={() => setProfileOpen((o) => !o)}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-surface-muted"
        >
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              user?.name?.[0]?.toUpperCase() ?? '?'
            )}
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-sm font-medium text-ink">{user?.name ?? 'Account'}</span>
            <span className="block text-xs capitalize text-ink-muted">{role.toLowerCase()}</span>
          </span>
        </button>
        {profileOpen && (
          <div
            role="menu"
            className="absolute left-4 right-4 z-20 mt-1 rounded-xl border border-surface-border bg-surface py-1 shadow-card-hover"
          >
            <Link
              href={profileHref}
              className="block px-4 py-2 text-sm text-ink-soft hover:bg-surface-muted"
              onClick={() => setProfileOpen(false)}
            >
              Profile
            </Link>
            {(role === 'STUDENT' || role === 'TUTOR') && (
              <Link
                href={role === 'TUTOR' ? ROUTES.TUTOR_MESSAGES : ROUTES.DASHBOARD_MESSAGES}
                className="block px-4 py-2 text-sm text-ink-soft hover:bg-surface-muted"
                onClick={() => setProfileOpen(false)}
              >
                Messages
              </Link>
            )}
            <button
              type="button"
              className="w-full px-4 py-2 text-left text-sm text-danger hover:bg-surface-muted"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {getLinks().map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-100 dark:text-brand-500'
                  : 'text-ink-soft hover:bg-surface-muted hover:text-ink',
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-surface-border p-3">
        <Button
          type="button"
          variant="destructive"
          className="w-full"
          size="sm"
          onClick={handleLogout}
          isLoading={isLoggingOut}
        >
          Log out
        </Button>
      </div>
    </aside>
  );
}
