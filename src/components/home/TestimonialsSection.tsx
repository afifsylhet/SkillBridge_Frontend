import { getRecentReviews } from '@/lib/api/stats';
import SectionHeader from '@/components/ui/SectionHeader';

export default async function TestimonialsSection() {
  let reviews: Awaited<ReturnType<typeof getRecentReviews>> = [];
  try {
    reviews = await getRecentReviews(6);
  } catch {
    reviews = [];
  }

  if (reviews.length === 0) return null;

  return (
    <section id="testimonials" className="section-y bg-surface">
      <div className="container">
        <SectionHeader
          title="What learners say"
          description="Real reviews from completed SkillBridge sessions."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {reviews.map((r) => (
            <article key={r.id} className="flex h-full flex-col border-t-2 border-brand-600 pt-5">
              <div className="mb-3 flex items-center gap-0.5 text-warning" aria-label={`${r.rating} stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < r.rating ? 'opacity-100' : 'opacity-25'}>
                    ★
                  </span>
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-ink-soft md:text-base">
                &ldquo;{r.comment}&rdquo;
              </p>
              <div className="mt-5">
                <p className="font-semibold text-ink">{r.studentName}</p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  Session with {r.tutorName}
                  {r.tutorHeadline ? ` · ${r.tutorHeadline}` : ''}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
