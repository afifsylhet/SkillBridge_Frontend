import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TutorsLoadingFallback from '@/components/tutors/TutorsLoadingFallback';

export default function TutorsLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-surface-muted">
        <div className="container py-8 md:py-10">
          <header className="mb-8 md:mb-10">
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Browse tutors
            </h1>
          </header>
          <TutorsLoadingFallback />
        </div>
      </main>
      <Footer />
    </div>
  );
}
