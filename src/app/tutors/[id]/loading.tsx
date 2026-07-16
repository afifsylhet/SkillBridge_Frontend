import { TutorDetailSkeleton } from '@/components/LoadingSkeletons';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TutorDetailLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-surface-muted">
        <div className="container py-8 md:py-10">
          <TutorDetailSkeleton />
        </div>
      </main>
      <Footer />
    </div>
  );
}
