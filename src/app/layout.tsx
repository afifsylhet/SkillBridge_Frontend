import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { StripeProvider } from '@/providers/StripeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'SkillBridge - Find Your Perfect Tutor',
  description: 'Connect with expert tutors for personalized learning experiences.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="bg-surface text-ink font-sans">
        <ErrorBoundary>
          <ToastProvider>
            <StripeProvider>
              <QueryProvider>
                {children}
              </QueryProvider>
            </StripeProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
