'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants/routes';
import { useCurrentUser, useLogout } from '@/lib/hooks';
import { useToast } from '@/lib/hooks/useToast';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const logoutMutation = useLogout();
  const { showToast } = useToast();

  const dashboardHref =
    user?.role === 'ADMIN'
      ? ROUTES.ADMIN
      : user?.role === 'TUTOR'
        ? ROUTES.TUTOR_DASHBOARD
        : ROUTES.DASHBOARD;

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

  return (
    <nav className="sticky top-0 z-40 bg-surface border-b border-surface-border shadow-card">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="font-display font-bold text-xl text-brand-600">
            SkillBridge
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href={ROUTES.BROWSE_TUTORS} className="text-ink-soft hover:text-ink">
              Browse Tutors
            </Link>
            <Link href={`${ROUTES.HOME}#categories`} className="text-ink-soft hover:text-ink">
              Categories
            </Link>
            <Link href={`${ROUTES.HOME}#how-it-works`} className="text-ink-soft hover:text-ink">
              How It Works
            </Link>
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="h-9 w-32 animate-pulse rounded-lg bg-surface-muted" />
            ) : user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="text-sm text-ink-soft hover:text-ink"
                >
                  {user.name}
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  isLoading={logoutMutation.isPending}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg text-ink hover:bg-surface-muted"
                >
                  Log in
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            className="md:hidden text-ink"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-surface-border py-4 space-y-2">
            <Link
              href={ROUTES.BROWSE_TUTORS}
              className="block px-4 py-2 text-ink-soft hover:bg-surface-muted"
            >
              Browse Tutors
            </Link>
            <Link
              href={`${ROUTES.HOME}#categories`}
              className="block px-4 py-2 text-ink-soft hover:bg-surface-muted"
            >
              Categories
            </Link>
            <Link
              href={`${ROUTES.HOME}#how-it-works`}
              className="block px-4 py-2 text-ink-soft hover:bg-surface-muted"
            >
              How It Works
            </Link>
            <div className="border-t border-surface-border pt-2">
              {user ? (
                <>
                  <Link
                    href={dashboardHref}
                    className="block px-4 py-2 text-ink-soft hover:bg-surface-muted"
                  >
                    Dashboard ({user.name})
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-ink-soft hover:bg-surface-muted"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={ROUTES.LOGIN}
                    className="block px-4 py-2 text-ink-soft hover:bg-surface-muted"
                  >
                    Log in
                  </Link>
                  <Link
                    href={ROUTES.REGISTER}
                    className="block px-4 py-2 text-ink-soft hover:bg-surface-muted"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
