'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ROUTES } from '@/lib/constants/routes';
import { useLogin } from '@/lib/hooks';
import { useToast } from '@/lib/hooks/useToast';
import { loginSchema } from '@/lib/validators/auth';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const loginMutation = useLogin();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const validation = loginSchema.safeParse(formData);
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
      const user = await loginMutation.mutateAsync(formData);
      showToast('Successfully logged in!', 'success');
      const target =
        user.role === 'ADMIN'
          ? ROUTES.ADMIN
          : user.role === 'TUTOR'
            ? ROUTES.TUTOR_DASHBOARD
            : ROUTES.DASHBOARD;
      router.push(target);
      router.refresh();
    } catch (error: any) {
      const message = error?.message || 'Failed to log in. Please try again.';
      showToast(message, 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-surface p-8 rounded-xl shadow-card">
        <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
        <p className="text-ink-muted mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
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
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={loginMutation.isPending}
          >
            Sign in
          </Button>
        </form>

        <p className="text-center text-ink-muted text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link href={ROUTES.REGISTER} className="text-brand-600 hover:text-brand-700 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
