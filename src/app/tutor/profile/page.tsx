'use client';

import { useCurrentUser } from '@/lib/auth/client';
import TutorProfileForm from '@/components/forms/TutorProfileForm';
import PageLoader from '@/components/ui/PageLoader';

export default function TutorProfilePage() {
  const { data: user, isLoading, error, refetch } = useCurrentUser();

  if (isLoading) {
    return <PageLoader label="Loading your profile…" />;
  }

  if (error) {
    return (
      <div>
        <h1 className="mb-8 text-3xl font-bold">Profile</h1>
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-6 text-sm text-danger">
          Couldn&apos;t load your profile: {error.message}
          <button type="button" onClick={() => refetch()} className="ml-3 underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <h1 className="mb-8 text-3xl font-bold">Profile</h1>
        <div className="rounded-xl bg-surface p-6 shadow-card">
          <p className="text-ink-muted">You&apos;re not signed in.</p>
        </div>
      </div>
    );
  }

  if (!user.tutorProfile) {
    return (
      <div>
        <h1 className="mb-8 text-3xl font-bold">Profile</h1>
        <div className="rounded-xl bg-surface p-6 shadow-card">
          <p className="text-ink-muted">
            No tutor profile is associated with this account. Please contact support.
          </p>
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
