import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Spinner from '@/components/ui/Spinner';

const HERO_IMAGE = '/images/blog-hero.jpg';

export default function BlogLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative flex min-h-[58vh] items-end overflow-hidden bg-[#020617] md:min-h-[64vh]">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_40%] opacity-60"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/75 to-[#020617]/35"
            aria-hidden
          />
          <div className="container relative z-10 pb-14 pt-28 md:pb-16 md:pt-36">
            <p className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
              SkillBridge
            </p>
            <p className="mt-4 text-xl text-white/80 md:text-2xl">Ideas for better learning.</p>
          </div>
        </section>
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 py-16">
          <Spinner size="lg" className="h-12 w-12" />
          <p className="text-sm font-medium text-ink-muted">Loading articles…</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
