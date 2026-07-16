import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TutorsBrowseContent, {
  tutorsSearchKey,
  type TutorsSearchParams,
} from '@/components/tutors/TutorsBrowseContent';
import TutorsLoadingFallback from '@/components/tutors/TutorsLoadingFallback';

export const dynamic = 'force-dynamic';

export default async function BrowseTutorsPage({
  searchParams,
}: {
  searchParams: Promise<TutorsSearchParams>;
}) {
  const sp = await searchParams;
  const key = tutorsSearchKey(sp);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-surface-muted">
        <div className="container py-8 md:py-10">
          <header>
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Browse tutors
            </h1>
          </header>

          <Suspense key={key} fallback={<TutorsLoadingFallback />}>
            <TutorsBrowseContent sp={sp} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
