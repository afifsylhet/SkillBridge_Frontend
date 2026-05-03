'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyAvailability } from '@/lib/api/tutors';
import TutorAvailabilityForm from '@/components/forms/TutorAvailabilityForm';
import PageLoader from '@/components/ui/PageLoader';

export default function AvailabilityPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tutor', 'availability'],
    queryFn: () => getMyAvailability(),
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return <PageLoader label="Loading availability…" />;
  }

  if (error) {
    return (
      <div>
        <h1 className="mb-8 text-3xl font-bold">Weekly Availability</h1>
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-6 text-sm text-danger">
          Could not load availability: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Weekly Availability</h1>
      <p className="mb-8 text-ink-muted">
        Set your recurring weekly availability. Students can only book sessions during these times.
      </p>
      <div className="max-w-3xl rounded-xl bg-surface p-8 shadow-card">
        <TutorAvailabilityForm initialSlots={data ?? []} />
      </div>
    </div>
  );
}
