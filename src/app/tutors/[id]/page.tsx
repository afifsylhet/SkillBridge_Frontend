import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AvailabilityCalendar from '@/components/tutors/AvailabilityCalendar';
import ReviewList from '@/components/tutors/ReviewList';
import TutorBookingPanel from '@/components/tutors/TutorBookingPanel';
import TutorCard from '@/components/tutors/TutorCard';
import { getRelatedTutors, getTutorById } from '@/lib/api/tutors';
import { ApiError } from '@/lib/api/client';
import type { TutorDetail, TutorListItem } from '@/types/tutor';

async function safeGet(id: string): Promise<TutorDetail | null> {
  try {
    return await getTutorById(id);
  } catch (err) {
    if (err instanceof ApiError && err.code === 'NOT_FOUND') return null;
    throw err;
  }
}

function Panel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-surface-border bg-surface p-6 shadow-card md:p-8 ${className}`}
    >
      {children}
    </section>
  );
}

export default async function TutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = await safeGet(id);

  if (!tutor) notFound();

  let related: TutorListItem[] = [];
  try {
    related = await getRelatedTutors(id);
  } catch {
    related = [];
  }

  const initial = tutor.user.name?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-surface-muted">
        <div className="container py-8 md:py-10">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem] lg:gap-8">
            <div className="space-y-5 md:space-y-6">
              <Panel>
                <div className="flex flex-col items-start gap-5 sm:flex-row sm:gap-6">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-2xl font-semibold text-brand-700 ring-4 ring-brand-50">
                    {tutor.user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={tutor.user.avatarUrl}
                        alt={tutor.user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{initial}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
                      {tutor.user.name}
                    </h1>
                    {tutor.headline && (
                      <p className="mt-1.5 text-base leading-relaxed text-ink-soft">{tutor.headline}</p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-ink">
                      <span>
                        <span className="text-warning">★</span>{' '}
                        {tutor.ratingCount > 0 ? tutor.ratingAvg.toFixed(1) : 'New'}
                        <span className="text-ink-muted">
                          {' '}
                          ({tutor.ratingCount} {tutor.ratingCount === 1 ? 'review' : 'reviews'})
                        </span>
                      </span>
                      <span className="text-ink-muted">·</span>
                      <span className="text-ink-soft">{tutor.experience} years experience</span>
                      <span className="text-ink-muted">·</span>
                      <span className="font-semibold text-brand-600">${tutor.hourlyRate}/hr</span>
                    </div>
                    {tutor.categories.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {tutor.categories.map((c) => (
                          <span
                            key={c.id}
                            className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <Panel>
                <h2 className="mb-3 font-display text-xl font-semibold tracking-tight text-ink">
                  Overview
                </h2>
                <p className="whitespace-pre-line leading-relaxed text-ink-soft">
                  {tutor.bio || 'No bio yet.'}
                </p>
              </Panel>

              <Panel>
                <h2 className="mb-4 font-display text-xl font-semibold tracking-tight text-ink">
                  Key information
                </h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { label: 'Hourly rate', value: `$${tutor.hourlyRate}` },
                    { label: 'Experience', value: `${tutor.experience} years` },
                    {
                      label: 'Rating',
                      value:
                        tutor.ratingCount > 0
                          ? `${tutor.ratingAvg.toFixed(1)} / 5`
                          : 'New tutor',
                    },
                    {
                      label: 'Categories',
                      value: tutor.categories.map((c) => c.name).join(', ') || '—',
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-surface-border bg-surface-muted/60 px-4 py-3"
                    >
                      <dt className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        {item.label}
                      </dt>
                      <dd className="mt-1 font-semibold text-ink">{item.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold text-ink">Weekly availability</h3>
                  <AvailabilityCalendar slots={tutor.availability} />
                </div>
              </Panel>

              <Panel>
                <h2 className="mb-4 font-display text-xl font-semibold tracking-tight text-ink">
                  Reviews
                </h2>
                <ReviewList
                  reviews={tutor.reviews}
                  ratingAvg={tutor.ratingAvg}
                  ratingCount={tutor.ratingCount}
                />
              </Panel>

              {related.length > 0 && (
                <section className="pt-2">
                  <h2 className="mb-4 font-display text-xl font-semibold tracking-tight text-ink">
                    Related tutors
                  </h2>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {related.map((t) => (
                      <TutorCard key={t.id} tutor={t} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <TutorBookingPanel
                tutorProfileId={tutor.id}
                tutorName={tutor.user.name}
                hourlyRate={tutor.hourlyRate}
                availability={tutor.availability}
                bookedRanges={tutor.bookedRanges}
              />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
