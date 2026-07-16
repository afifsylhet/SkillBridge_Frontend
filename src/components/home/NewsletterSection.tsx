import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';
import NewsletterForm from './NewsletterForm';

export default function NewsletterSection() {
  return (
    <section id="newsletter" className="section-y border-y border-surface-border bg-surface-muted">
      <div className="container max-w-xl text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
          Stay in the loop
        </h2>
        <p className="mt-2 mb-6 text-sm leading-relaxed text-ink-soft md:text-base">
          Get learning tips, new category launches, and platform updates — no spam.
        </p>
        <NewsletterForm />
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  return (
    <section className="section-y bg-surface">
      <div className="container">
        {/* Fixed brand gradient — stays vivid in light and dark mode */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#0f766e] px-8 py-14 text-center text-white md:px-16 md:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                'radial-gradient(circle at 12% 20%, rgba(255,255,255,0.16), transparent 42%), radial-gradient(circle at 88% 75%, rgba(15,118,110,0.5), transparent 48%)',
            }}
            aria-hidden
          />
          <div className="relative">
            <p className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Ready to start learning?
            </p>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/85 md:text-base">
              Join SkillBridge today — find a tutor, book a slot, and pay securely in minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={ROUTES.BROWSE_TUTORS}
                className="inline-flex h-12 items-center rounded-xl bg-white px-7 text-sm font-semibold text-[#1e40af] transition hover:bg-blue-50"
              >
                Browse tutors
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="inline-flex h-12 items-center rounded-xl border border-white/40 px-7 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Create free account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
