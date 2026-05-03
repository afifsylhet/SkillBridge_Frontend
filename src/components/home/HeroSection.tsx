import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-brand-50 via-surface to-surface py-20 lg:py-32">
      <div className="container text-center">
        <p className="mb-4 inline-flex items-center rounded-full border border-brand-200 bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
          Live tutors · No payment required
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight text-ink md:text-5xl lg:text-6xl">
          Learn from world-class tutors,
          <br className="hidden sm:block" /> on your schedule.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-soft md:text-xl">
          Browse expert tutors across web development, design, languages, and more.
          Book a session in minutes — confirmed instantly, no payment gateway required.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={ROUTES.BROWSE_TUTORS}
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-6 py-3 text-lg font-medium text-white shadow-card transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Find a tutor
          </Link>
          <Link
            href={`${ROUTES.REGISTER}?role=TUTOR`}
            className="inline-flex items-center justify-center rounded-lg border border-ink/20 bg-surface px-6 py-3 text-lg font-medium text-ink transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Become a tutor
          </Link>
        </div>
      </div>
    </section>
  );
}
