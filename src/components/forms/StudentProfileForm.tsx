'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/lib/hooks/useToast';
import { updateCurrentUser } from '@/lib/api/auth';
import type { CurrentUser } from '@/types/user';

interface StudentProfileFormProps {
  user: CurrentUser;
}

export default function StudentProfileForm({ user }: StudentProfileFormProps) {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? '');

  const mutation = useMutation({
    mutationFn: () =>
      updateCurrentUser({
        name: name.trim() || undefined,
        avatarUrl: avatarUrl.trim() || null,
      }),
    onSuccess: () => {
      showToast('Profile updated', 'success');
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to update profile', 'error');
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="space-y-6"
    >
      <Input
        label="Name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        required
      />

      <Input label="Email" type="email" value={user.email} disabled />

      <Input
        label="Avatar URL"
        name="avatarUrl"
        type="url"
        value={avatarUrl}
        onChange={(e) => setAvatarUrl(e.target.value)}
        placeholder="https://example.com/avatar.jpg"
      />

      <Button type="submit" variant="primary" isLoading={mutation.isPending}>
        Save changes
      </Button>
    </form>
  );
}
