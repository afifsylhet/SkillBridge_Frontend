'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { ROUTES } from '@/lib/constants/routes';
import { useCurrentUser, useLogout } from '@/lib/hooks';
import { useToast } from '@/lib/hooks/useToast';
import { useAppRouter } from '@/lib/hooks/useAppRouter';
import { cn } from '@/lib/utils/cn';

export default function Navbar() {
  const router = useAppRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { data: user, isLoading } = useCurrentUser();
  const logoutMutation = useLogout();
  const { showToast } = useToast();

  const dashboardHref =
    user?.role === 'ADMIN'
      ? ROUTES.ADMIN
      : user?.role === 'TUTOR'
        ? ROUTES.TUTOR_DASHBOARD
        : ROUTES.DASHBOARD;

  const profileHref =
    user?.role === 'TUTOR'
      ? ROUTES.TUTOR_PROFILE
      : user?.role === 'ADMIN'
        ? ROUTES.ADMIN
        : ROUTES.DASHBOARD_PROFILE;

  const messagesHref =
    user?.role === 'TUTOR' ? ROUTES.TUTOR_MESSAGES : ROUTES.DASHBOARD_MESSAGES;

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
      showToast('Logged out', 'success');
      router.push(ROUTES.HOME);
      router.refresh();
    } catch {
      showToast('Failed to log out', 'error');
    }
  };

  const loggedOutLinks = [
    { href: ROUTES.HOME, label: 'Home' },
    { href: ROUTES.BROWSE_TUTORS, label: 'Tutors' },
    { href: ROUTES.ABOUT, label: 'About' },
    { href: ROUTES.BLOG, label: 'Blog' },
  ];

  const loggedInLinks = [
    { href: ROUTES.HOME, label: 'Home' },
    { href: ROUTES.BROWSE_TUTORS, label: 'Tutors' },
    { href: ROUTES.BLOG, label: 'Blog' },
    { href: dashboardHref, label: 'Dashboard' },
  ];

  const navLinks = user ? loggedInLinks : loggedOutLinks;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-surface-border/80 bg-surface/90 backdrop-blur-md">
      <div className="container">
        <div className="flex h-[4.25rem] items-center justify-between gap-4">
          <Link
            href={ROUTES.HOME}
            className="font-display text-xl font-bold tracking-tight text-brand-600 transition hover:text-brand-700"
          >
            SkillBridge
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-surface-muted hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            {isLoading ? (
              <div className="h-10 w-28 animate-pulse rounded-xl bg-surface-muted" />
            ) : user ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-2 py-1.5 transition hover:bg-surface-muted"
                >
                  <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                    {user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      user.name?.[0]?.toUpperCase()
                    )}
                  </span>
                  <span className="max-w-[110px] truncate text-sm font-medium text-ink">{user.name}</span>
                  <svg className="h-4 w-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-surface-border bg-surface py-1 shadow-card-hover animate-fade-in"
                  >
                    {[
                      { href: profileHref, label: 'Profile' },
                      ...(user.role !== 'ADMIN'
                        ? [{ href: messagesHref, label: 'Messages' }]
                        : []),
                      ...(user.role === 'STUDENT'
                        ? [{ href: ROUTES.DASHBOARD_FAVORITES, label: 'Favorites' }]
                        : []),
                      { href: dashboardHref, label: 'Dashboard' },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        className="block px-4 py-2.5 text-sm text-ink-soft transition hover:bg-surface-muted hover:text-ink"
                        onClick={() => setProfileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="my-1 border-t border-surface-border" />
                    <button
                      type="button"
                      role="menuitem"
                      className="w-full px-4 py-2.5 text-left text-sm text-danger transition hover:bg-surface-muted"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href={ROUTES.REGISTER}>
                  <Button variant="primary" size="sm">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Toggle menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border text-ink-soft transition hover:bg-surface-muted"
              onClick={() => setMobileMenuOpen((o) => !o)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div
          className={cn(
            'overflow-hidden border-t border-surface-border transition-[max-height,opacity] duration-200 md:hidden',
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 border-t-0',
          )}
        >
          <div className="flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-muted hover:text-ink"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href={profileHref}
                  className="rounded-lg px-3 py-2.5 text-sm text-ink-soft hover:bg-surface-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  type="button"
                  className="rounded-lg px-3 py-2.5 text-left text-sm text-danger hover:bg-surface-muted"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2 px-1">
                <Link href={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href={ROUTES.REGISTER} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full" size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
