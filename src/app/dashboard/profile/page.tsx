'use client';

import { useCurrentUser } from '@/lib/auth/client';
import StudentProfileForm from '@/components/forms/StudentProfileForm';
import PageLoader from '@/components/ui/PageLoader';

export default function ProfilePage() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <PageLoader label="Loading your profile…" />;
  }

  if (!user) {
    return (
      <div>
        <h1 className="mb-6 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
          Profile
        </h1>
        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-card">
          <p className="text-sm text-ink-muted">Unable to load profile. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
        My Profile
      </h1>
      <p className="mb-8 text-sm text-ink-muted">Update your name and avatar.</p>
      <div className="max-w-2xl rounded-2xl border border-surface-border bg-surface p-6 shadow-card md:p-8">
        <StudentProfileForm user={user} />
      </div>
    </div>
  );
}
