import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[88vh] items-end overflow-hidden bg-[#020617] md:min-h-[92vh]">
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_30%]"
      />
      {/* Fixed dark overlay — readable in light and dark theme */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/75 to-[#020617]/30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_40%,rgba(37,99,235,0.35),transparent_50%)]"
        aria-hidden
      />

      <div className="container relative z-10 pb-16 pt-32 md:pb-20 md:pt-40">
        <p className="animate-slide-up font-display text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          SkillBridge
        </p>
        <h1 className="mt-5 max-w-2xl animate-fade-in text-xl font-medium leading-snug text-white/95 md:mt-6 md:text-2xl lg:text-[1.75rem]">
          Learn from world-class tutors, on your schedule.
        </h1>
        <p className="mt-4 max-w-lg animate-fade-in text-base leading-relaxed text-white/70 md:text-lg">
          Browse experts across development, design, languages, and more. Book in minutes and pay
          securely with Stripe.
        </p>
        <div className="mt-8 flex animate-slide-up flex-col gap-3 sm:flex-row">
          <Link
            href={ROUTES.BROWSE_TUTORS}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#2563eb] px-7 text-base font-medium text-white transition hover:bg-[#1d4ed8]"
          >
            Find a tutor
          </Link>
          <Link
            href={`${ROUTES.REGISTER}?role=TUTOR`}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-7 text-base font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Become a tutor
          </Link>
        </div>
        <a
          href="#stats"
          className="mt-10 inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white/90"
        >
          Explore SkillBridge
          <svg className="h-4 w-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
