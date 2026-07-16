import Link from 'next/link';
import { getFeaturedTutors } from '@/lib/api/tutors';
import TutorCard from '@/components/tutors/TutorCard';
import SectionHeader from '@/components/ui/SectionHeader';
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
    <section className="section-y bg-surface-muted">
      <div className="container">
        <SectionHeader
          align="left"
          title="Top rated tutors"
          description="Hand-picked from our highest-rated mentors."
          action={
            <Link
              href={ROUTES.BROWSE_TUTORS}
              className="text-sm font-medium text-brand-600 transition hover:text-brand-700"
            >
              Browse all tutors →
            </Link>
          }
        />

        {tutors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-border bg-surface px-6 py-12 text-center text-ink-muted">
            No published tutors yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tutors.map((t) => (
              <TutorCard key={t.id} tutor={t} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
