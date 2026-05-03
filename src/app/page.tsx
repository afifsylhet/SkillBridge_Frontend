import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoryGridSection from '@/components/home/CategoryGridSection';
import FeaturedTutorsSection from '@/components/home/FeaturedTutorsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';

// Home page fetches live data (categories + featured tutors) on each request.
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoryGridSection />
        <FeaturedTutorsSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
}
