'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ROUTES } from '@/lib/constants/routes';
import { useRegister } from '@/lib/hooks';
import { useToast } from '@/lib/hooks/useToast';
import { registerSchema } from '@/lib/validators/auth';

export default function RegisterPage() {
  const router = useRouter();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'role' ? (value as 'STUDENT' | 'TUTOR') : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
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
    } catch (error: any) {
      const message = error?.message || 'Failed to register. Please try again.';
      showToast(message, 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-surface p-8 rounded-xl shadow-card">
        <h1 className="text-2xl font-bold mb-2">Create account</h1>
        <p className="text-ink-muted mb-6">Join SkillBridge today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            error={errors.name}
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

          {/* Role Selection */}
          <div className="py-2">
            <label className="block text-sm font-medium text-ink mb-3">I am a:</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="STUDENT"
                  checked={formData.role === 'STUDENT'}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'STUDENT' | 'TUTOR' }))}
                  className="mr-3"
                />
                <span className="text-ink">Student</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="TUTOR"
                  checked={formData.role === 'TUTOR'}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'STUDENT' | 'TUTOR' }))}
                  className="mr-3"
                />
                <span className="text-ink">Tutor</span>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={registerMutation.isPending}
          >
            Create account
          </Button>
        </form>

        <p className="text-center text-ink-muted text-sm mt-6">
          Already have an account?{' '}
          <Link href={ROUTES.LOGIN} className="text-brand-600 hover:text-brand-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
