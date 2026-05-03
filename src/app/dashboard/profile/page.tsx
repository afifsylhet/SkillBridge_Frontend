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
        <h1 className="mb-8 text-3xl font-bold">Profile</h1>
        <div className="rounded-xl bg-surface p-6 shadow-card">
          <p className="text-ink-muted">Unable to load profile. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">My Profile</h1>
      <div className="max-w-2xl rounded-xl bg-surface p-8 shadow-card">
        <StudentProfileForm user={user} />
      </div>
    </div>
  );
}
