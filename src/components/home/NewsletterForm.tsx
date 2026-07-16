'use client';

import { useState } from 'react';
import { subscribeNewsletter } from '@/lib/api/blog';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      await subscribeNewsletter(email);
      setStatus('success');
      setMessage('You are subscribed. Welcome aboard!');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Subscription failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={compact ? 'space-y-2' : 'flex flex-col gap-3 sm:flex-row sm:items-start'}>
      <div className={compact ? '' : 'flex-1'}>
        <Input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          aria-label="Email for newsletter"
          className={compact ? 'text-sm' : ''}
        />
      </div>
      <Button type="submit" variant="primary" isLoading={status === 'loading'} className={compact ? 'w-full' : ''}>
        Subscribe
      </Button>
      {message && (
        <p
          className={`text-sm ${status === 'success' ? 'text-success' : 'text-danger'} ${compact ? '' : 'w-full sm:basis-full'}`}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}
