import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AvailabilityCalendar from '@/components/tutors/AvailabilityCalendar';
import ReviewList from '@/components/tutors/ReviewList';
import TutorBookingPanel from '@/components/tutors/TutorBookingPanel';
import { getTutorById } from '@/lib/api/tutors';
import { ApiError } from '@/lib/api/client';
import type { TutorDetail } from '@/types/tutor';

async function safeGet(id: string): Promise<TutorDetail | null> {
  try {
    return await getTutorById(id);
  } catch (err) {
    if (err instanceof ApiError && err.code === 'NOT_FOUND') return null;
    throw err;
  }
}

export default async function TutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = await safeGet(id);

  if (!tutor) notFound();

  const initial = tutor.user.name?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-surface-muted">
        <div className="container py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_22rem]">
            <div className="space-y-6">
              <section className="rounded-2xl bg-surface p-6 shadow-card md:p-8">
                <div className="flex flex-col items-start gap-6 sm:flex-row">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-2xl font-semibold text-brand-700">
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
                    <h1 className="text-3xl font-bold text-ink">{tutor.user.name}</h1>
                    {tutor.headline && (
                      <p className="mt-1 text-ink-muted">{tutor.headline}</p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-ink">
                      <span>
                        <span className="text-amber-500">★</span>{' '}
                        {tutor.ratingCount > 0 ? tutor.ratingAvg.toFixed(1) : 'New'}
                        <span className="text-ink-muted">
                          {' '}
                          ({tutor.ratingCount} {tutor.ratingCount === 1 ? 'review' : 'reviews'})
                        </span>
                      </span>
                      <span className="text-ink-muted">·</span>
                      <span>{tutor.experience} years experience</span>
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
              </section>

              <section className="rounded-2xl bg-surface p-6 shadow-card md:p-8">
                <h2 className="mb-3 text-xl font-semibold text-ink">About</h2>
                <p className="whitespace-pre-line text-ink-soft">
                  {tutor.bio || 'No bio yet.'}
                </p>
              </section>

              <section className="rounded-2xl bg-surface p-6 shadow-card md:p-8">
                <h2 className="mb-4 text-xl font-semibold text-ink">Weekly Availability</h2>
                <AvailabilityCalendar slots={tutor.availability} />
              </section>

              <section className="rounded-2xl bg-surface p-6 shadow-card md:p-8">
                <h2 className="mb-4 text-xl font-semibold text-ink">Reviews</h2>
                <ReviewList
                  reviews={tutor.reviews}
                  ratingAvg={tutor.ratingAvg}
                  ratingCount={tutor.ratingCount}
                />
              </section>
            </div>

            <aside>
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
