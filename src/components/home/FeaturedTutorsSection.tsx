import Link from 'next/link';
import { getFeaturedTutors } from '@/lib/api/tutors';
import TutorCard from '@/components/tutors/TutorCard';
import { ROUTES } from '@/lib/constants/routes';
import type { TutorListItem } from '@/types/tutor';

async function safeFeatured(): Promise<TutorListItem[]> {
  try {
    return await getFeaturedTutors(8);
  } catch {
    return [];
  }
}

export default async function FeaturedTutorsSection() {
  const tutors = await safeFeatured();

  return (
    <section className="bg-surface-muted py-16 lg:py-24">
      <div className="container">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold text-ink md:text-4xl">Top Rated Tutors</h2>
            <p className="mt-3 text-ink-muted">
              Hand-picked from our highest-rated mentors.
            </p>
          </div>
          <Link
            href={ROUTES.BROWSE_TUTORS}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Browse all tutors →
          </Link>
        </div>

        {tutors.length === 0 ? (
          <div className="rounded-xl border border-dashed border-surface-border bg-surface p-12 text-center text-ink-muted">
            No published tutors yet. Run <code>npm run seed</code> to add demo content.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tutors.map((t) => (
              <TutorCard key={t.id} tutor={t} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
