import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { getCurrentUser } from '@/lib/auth/server';
import { ROUTES } from '@/lib/constants/routes';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user) {
    const target =
      user.role === 'ADMIN'
        ? ROUTES.ADMIN
        : user.role === 'TUTOR'
          ? ROUTES.TUTOR_DASHBOARD
          : ROUTES.DASHBOARD;
    redirect(target);
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Brand panel — fixed dark palette so light/dark themes both stay readable */}
      <aside className="relative hidden w-[46%] overflow-hidden bg-[#020617] lg:block">
        <Image
          src="/images/auth-panel.jpg"
          alt=""
          fill
          priority
          sizes="46vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-[#020617]/45"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(37,99,235,0.35),transparent_55%)]"
          aria-hidden
        />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-12">
          <Link
            href={ROUTES.HOME}
            className="font-display text-2xl font-bold tracking-tight text-white transition hover:text-white/90"
          >
            SkillBridge
          </Link>

          <div className="max-w-md pb-6">
            <p className="font-display text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
              Learn from world-class tutors, on your schedule.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              Browse experts, book live sessions, and pay securely with Stripe — all in one place.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/65">
              {[
                'Verified tutors and real reviews',
                'Transparent hourly rates',
                'Secure Stripe checkout',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#60a5fa]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Form side — theme tokens for light/dark */}
      <div className="relative flex min-h-screen flex-1 flex-col bg-surface-muted">
        <header className="flex items-center justify-between border-b border-surface-border bg-surface px-5 py-3.5 lg:border-0 lg:bg-transparent lg:px-8 lg:py-5">
          <Link
            href={ROUTES.HOME}
            className="font-display text-lg font-bold tracking-tight text-brand-600 lg:invisible"
          >
            SkillBridge
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href={ROUTES.HOME}
              className="hidden text-sm font-medium text-ink-muted transition hover:text-ink sm:inline"
            >
              Back to home
            </Link>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 md:py-12">
          <div className="w-full max-w-[26rem] animate-fade-in">{children}</div>
        </main>

        <footer className="px-5 pb-6 text-center text-xs text-ink-muted sm:px-8">
          By continuing you agree to our{' '}
          <Link href={ROUTES.TERMS} className="text-brand-600 hover:underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link href={ROUTES.PRIVACY} className="text-brand-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </footer>
      </div>
    </div>
  );
}
