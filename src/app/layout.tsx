import type { Metadata } from 'next';
import { Outfit, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { StripeProvider } from '@/providers/StripeProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import NavigationProgress from '@/components/layout/NavigationProgress';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-display-family',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SkillBridge - Find Your Perfect Tutor',
  description: 'Connect with expert tutors for personalized learning experiences. Book sessions securely with Stripe.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${sourceSerif.variable}`}>
      <body className="bg-surface text-ink font-sans antialiased">
        <ErrorBoundary>
          <ThemeProvider>
            <ToastProvider>
              <StripeProvider>
                <QueryProvider>
                  <NavigationProgress />
                  {children}
                </QueryProvider>
              </StripeProvider>
            </ToastProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
