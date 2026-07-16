import { getPublicStats } from '@/lib/api/stats';

export default async function StatsSection() {
  let stats = { tutors: 0, students: 0, sessionsCompleted: 0, categories: 0, avgRating: 0 };
  try {
    stats = await getPublicStats();
  } catch {
    // leave zeros
  }

  const items = [
    { label: 'Published tutors', value: stats.tutors.toLocaleString() },
    { label: 'Learners', value: stats.students.toLocaleString() },
    { label: 'Sessions completed', value: stats.sessionsCompleted.toLocaleString() },
    {
      label: 'Avg. tutor rating',
      value: stats.avgRating ? stats.avgRating.toFixed(1) : '—',
    },
  ];

  return (
    <section
      id="stats"
      className="border-b border-white/10 bg-[#020617] py-12 text-white md:py-14"
    >
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          {items.map((item) => (
            <div key={item.label} className="text-center md:text-left">
              <p className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                {item.value}
              </p>
              <p className="mt-1.5 text-sm text-white/50">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
