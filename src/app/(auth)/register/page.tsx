'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { ROUTES } from '@/lib/constants/routes';
import { useRegister } from '@/lib/hooks';
import { useToast } from '@/lib/hooks/useToast';
import { useAppRouter } from '@/lib/hooks/useAppRouter';
import { registerSchema } from '@/lib/validators/auth';
import { getGoogleOAuthStatus } from '@/lib/api/blog';

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function RegisterForm() {
  const router = useAppRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'TUTOR' ? 'TUTOR' : 'STUDENT';
  const { showToast } = useToast();
  const registerMutation = useRegister();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: initialRole as 'STUDENT' | 'TUTOR',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [googleEnabled, setGoogleEnabled] = useState(false);

  useEffect(() => {
    getGoogleOAuthStatus()
      .then((d) => setGoogleEnabled(d.enabled))
      .catch(() => setGoogleEnabled(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'role' ? (value as 'STUDENT' | 'TUTOR') : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (typeof path === 'string') {
          newErrors[path] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    try {
      const user = await registerMutation.mutateAsync(formData);
      showToast('Account created successfully!', 'success');
      const redirectPath = user.role === 'TUTOR' ? ROUTES.TUTOR_DASHBOARD : ROUTES.DASHBOARD;
      router.push(redirectPath);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to register. Please try again.';
      showToast(message, 'error');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">Get started</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Create account
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Join SkillBridge as a learner or tutor in minutes.
        </p>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-card sm:p-7">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Alex Rivera"
            error={errors.name}
            autoComplete="name"
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.password}
            autoComplete="new-password"
            hint="At least 8 characters"
            required
          />

          <div>
            <p className="mb-2.5 text-sm font-medium text-ink">I want to</p>
            <div className="grid grid-cols-2 gap-2.5">
              {(
                [
                  { role: 'STUDENT' as const, title: 'Learn', subtitle: 'Book tutors' },
                  { role: 'TUTOR' as const, title: 'Teach', subtitle: 'Offer sessions' },
                ] as const
              ).map((option) => {
                const selected = formData.role === option.role;
                return (
                  <label
                    key={option.role}
                    className={`cursor-pointer rounded-xl border px-3.5 py-3.5 transition ${
                      selected
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-surface-border bg-surface text-ink hover:bg-surface-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.role}
                      checked={selected}
                      onChange={() => setFormData((prev) => ({ ...prev, role: option.role }))}
                      className="sr-only"
                    />
                    <span className="block text-sm font-semibold">{option.title}</span>
                    <span
                      className={`mt-0.5 block text-xs ${
                        selected ? 'text-brand-600/80' : 'text-ink-muted'
                      }`}
                    >
                      {option.subtitle}
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.role && <p className="mt-1.5 text-sm text-danger">{errors.role}</p>}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="mt-1 w-full"
            size="lg"
            isLoading={registerMutation.isPending}
          >
            Create account
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-surface-border" />
          <span className="text-xs text-ink-muted">or</span>
          <div className="h-px flex-1 bg-surface-border" />
        </div>

        {googleEnabled ? (
          <a
            href="/api/oauth/google"
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-surface-border bg-surface px-4 text-sm font-medium text-ink transition hover:bg-surface-muted"
          >
            <GoogleIcon />
            Continue with Google
          </a>
        ) : (
          <button
            type="button"
            disabled
            title="Configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable"
            className="flex h-11 w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-xl border border-surface-border px-4 text-sm text-ink-muted opacity-60"
          >
            <GoogleIcon />
            Google (not configured)
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have an account?{' '}
        <Link href={ROUTES.LOGIN} className="font-semibold text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
