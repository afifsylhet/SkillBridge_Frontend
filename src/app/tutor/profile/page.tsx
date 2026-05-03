'use client';

import { useCurrentUser } from '@/lib/auth/client';
import TutorProfileForm from '@/components/forms/TutorProfileForm';
import PageLoader from '@/components/ui/PageLoader';

export default function TutorProfilePage() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <PageLoader label="Loading your profile…" />;
  }

  if (!user || !user.tutorProfile) {
    return (
      <div>
        <h1 className="mb-8 text-3xl font-bold">Profile</h1>
        <div className="rounded-xl bg-surface p-6 shadow-card">
          <p className="text-ink-muted">Unable to load tutor profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">My Profile</h1>
      <div className="max-w-2xl rounded-xl bg-surface p-8 shadow-card">
        <TutorProfileForm profile={user.tutorProfile} />
      </div>
    </div>
  );
}
