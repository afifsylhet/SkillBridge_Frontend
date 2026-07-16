import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import CategoryGridSection from '@/components/home/CategoryGridSection';
import FeaturedTutorsSection from '@/components/home/FeaturedTutorsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import WhySkillBridgeSection from '@/components/home/WhySkillBridgeSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogTeaserSection from '@/components/home/BlogTeaserSection';
import FaqSection from '@/components/home/FaqSection';
import NewsletterSection, { FinalCtaSection } from '@/components/home/NewsletterSection';
import { SectionSpinner } from '@/components/LoadingSkeletons';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <Suspense
          fallback={
            <SectionSpinner
              className="border-b border-white/10 bg-[#020617] py-12 md:py-14"
              labelClassName="text-white/60"
            />
          }
        >
          <StatsSection />
        </Suspense>
        <Suspense fallback={<SectionSpinner className="section-y bg-surface" />}>
          <CategoryGridSection />
        </Suspense>
        <Suspense fallback={<SectionSpinner className="section-y bg-surface-muted" />}>
          <FeaturedTutorsSection />
        </Suspense>
        <HowItWorksSection />
        <WhySkillBridgeSection />
        <Suspense fallback={<SectionSpinner className="section-y bg-surface" />}>
          <TestimonialsSection />
        </Suspense>
        <Suspense fallback={<SectionSpinner className="section-y bg-surface-muted" />}>
          <BlogTeaserSection />
        </Suspense>
        <FaqSection />
        <NewsletterSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
