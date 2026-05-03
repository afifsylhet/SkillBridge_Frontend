import { getCurrentUser } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Server-side role guard
  if (!user || user.role !== 'STUDENT') {
    redirect('/login');
  }

  return (
    <div className="flex h-screen">
      <DashboardSidebar role="STUDENT" />
      <main className="flex-1 overflow-y-auto bg-surface-muted">
        <div className="container py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
