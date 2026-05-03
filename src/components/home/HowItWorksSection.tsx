import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

const STEPS = [
  {
    n: 1,
    title: 'Search',
    body: 'Filter tutors by subject, price, and rating to find your match.',
  },
  {
    n: 2,
    title: 'Book',
    body: 'Pick a slot from the tutor’s availability and confirm instantly.',
  },
  {
    n: 3,
    title: 'Learn',
    body: 'Join your session, mark it complete, and leave a review.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 lg:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-ink md:text-4xl">How It Works</h2>
          <p className="mt-3 text-ink-muted">Three steps from sign-up to your first session.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
                {s.n}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-ink">{s.title}</h3>
              <p className="text-ink-muted">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href={ROUTES.REGISTER}
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-6 py-3 text-lg font-medium text-white shadow-card transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Get started for free
          </Link>
        </div>
      </div>
    </section>
  );
}
