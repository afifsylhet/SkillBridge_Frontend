import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getCurrentUser } from '@/lib/auth/server';
import { ROUTES } from '@/lib/constants/routes';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user) {
    const target =
      user.role === 'ADMIN'
        ? ROUTES.ADMIN
        : user.role === 'TUTOR'
          ? ROUTES.TUTOR_DASHBOARD
          : ROUTES.DASHBOARD;
    redirect(target);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
