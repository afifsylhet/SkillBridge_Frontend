'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { submitContact } from '@/lib/api/blog';
import { SITE } from '@/lib/constants/routes';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  body: z.string().min(10, 'Message must be at least 10 characters'),
});

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', body: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (typeof path === 'string') fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await submitContact(result.data);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', body: '' });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-surface-muted py-12 md:py-16">
        <div className="container max-w-xl">
          <div className="rounded-2xl border border-surface-border bg-surface p-7 shadow-card md:p-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Contact us</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft md:text-base">
            Questions about bookings, payments, or your account? Send us a message and we will
            respond within one business day. You can also email{' '}
            <a href={`mailto:${SITE.email}`} className="font-medium text-brand-600 hover:underline">
              {SITE.email}
            </a>
            .
          </p>

          {success ? (
            <div className="mt-8 rounded-xl border border-success/30 bg-accent-soft/40 p-6">
              <h2 className="font-semibold text-success">Message sent</h2>
              <p className="mt-2 text-sm text-ink-soft">
                Thanks for reaching out. Our team will get back to you shortly.
              </p>
              <Button
                type="button"
                variant="secondary"
                className="mt-4"
                onClick={() => setSuccess(false)}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <Input
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <Input
                label="Subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                error={errors.subject}
                required
              />
              <Textarea
                label="Message"
                name="body"
                rows={6}
                value={form.body}
                onChange={handleChange}
                error={errors.body}
                required
              />

              {submitError && (
                <div className="rounded-lg border border-danger/30 bg-red-50 p-3 text-sm text-danger dark:bg-red-950/30">
                  {submitError}
                </div>
              )}

              <Button type="submit" isLoading={loading} className="w-full">
                Send message
              </Button>
            </form>
          )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
