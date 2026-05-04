'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/lib/hooks/useToast';
import { updateTutorProfile } from '@/lib/api/tutors';
import { getCategories } from '@/lib/api/categories';
import type { CurrentUserTutorProfile } from '@/types/user';

interface TutorProfileFormProps {
  profile: CurrentUserTutorProfile;
}

export default function TutorProfileForm({ profile }: TutorProfileFormProps) {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
    staleTime: 5 * 60 * 1000,
  });

  const [isEditing, setIsEditing] = useState(false);

  const [bio, setBio] = useState(profile.bio);
  const [headline, setHeadline] = useState(profile.headline ?? '');
  const [hourlyRate, setHourlyRate] = useState(String(profile.hourlyRate));
  const [experience, setExperience] = useState(String(profile.experience));
  const [isPublished, setIsPublished] = useState(profile.isPublished);
  const [categoryIds, setCategoryIds] = useState<string[]>(
    profile.categories.map((c) => c.id),
  );

  // Re-sync local form state if a fresh profile is provided (e.g. after invalidation).
  useEffect(() => {
    setBio(profile.bio);
    setHeadline(profile.headline ?? '');
    setHourlyRate(String(profile.hourlyRate));
    setExperience(String(profile.experience));
    setIsPublished(profile.isPublished);
    setCategoryIds(profile.categories.map((c) => c.id));
  }, [profile]);

  const mutation = useMutation({
    mutationFn: () =>
      updateTutorProfile({
        bio: bio.trim(),
        headline: headline.trim() || undefined,
        hourlyRate: Number(hourlyRate) || 0,
        experience: Number(experience) || 0,
        categoryIds,
        isPublished,
      }),
    onSuccess: () => {
      showToast('Profile saved successfully', 'success');
      setIsEditing(false);
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
      qc.invalidateQueries({ queryKey: ['tutors'] });
    },
    onError: (err: Error) => showToast(err.message || 'Failed to update profile', 'error'),
  });

  const toggleCategory = (id: string) => {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const cancelEdit = () => {
    setBio(profile.bio);
    setHeadline(profile.headline ?? '');
    setHourlyRate(String(profile.hourlyRate));
    setExperience(String(profile.experience));
    setIsPublished(profile.isPublished);
    setCategoryIds(profile.categories.map((c) => c.id));
    setIsEditing(false);
  };

  if (!isEditing) {
    return <ReadOnlyView profile={profile} onEdit={() => setIsEditing(true)} />;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (categoryIds.length === 0) {
          showToast('Select at least one category', 'error');
          return;
        }
        if (!bio.trim()) {
          showToast('Bio is required', 'error');
          return;
        }
        mutation.mutate();
      }}
      className="space-y-6"
    >
      {!isPublished && (
        <div className="rounded-lg border border-warning/40 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Your profile is hidden</p>
          <p>Publish to start receiving bookings from students.</p>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-ink">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={6}
          maxLength={2000}
          required
          placeholder="Tell students about your experience and teaching style..."
          className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <p className="mt-1 text-xs text-ink-muted">{bio.length}/2000 characters</p>
      </div>

      <Input
        label="Headline"
        name="headline"
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
        placeholder="e.g. Senior React Engineer · 10+ years experience"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Hourly rate ($)"
          type="number"
          name="hourlyRate"
          min="0"
          step="5"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          required
        />
        <Input
          label="Years of experience"
          type="number"
          name="experience"
          min="0"
          max="80"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-ink">Subjects you teach</label>
        {categoriesLoading ? (
          <p className="text-sm text-ink-muted">Loading categories…</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-ink-muted">No categories available.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {categories.map((c) => {
              const checked = categoryIds.includes(c.id);
              return (
                <label
                  key={c.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition ${
                    checked
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-surface-border bg-surface text-ink hover:bg-surface-muted'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCategory(c.id)}
                    className="h-4 w-4 rounded border-surface-border"
                  />
                  <span>{c.name}</span>
                </label>
              );
            })}
          </div>
        )}
        <p className="mt-2 text-xs text-ink-muted">Select at least one category.</p>
      </div>

      <label className="flex items-start gap-3 rounded-lg border border-surface-border bg-surface p-4">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-surface-border"
        />
        <span>
          <span className="block text-sm font-medium text-ink">Publish profile</span>
          <span className="block text-xs text-ink-muted">
            Makes your profile visible in search and lets students book you.
          </span>
        </span>
      </label>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" isLoading={mutation.isPending}>
          Save changes
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={cancelEdit}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function ReadOnlyView({
  profile,
  onEdit,
}: {
  profile: CurrentUserTutorProfile;
  onEdit: () => void;
}) {
  return (
    <div className="space-y-6">
      {!profile.isPublished && (
        <div className="rounded-lg border border-warning/40 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Your profile is hidden</p>
          <p>Click Edit and toggle Publish to start receiving bookings.</p>
        </div>
      )}

      <Field label="Headline">
        {profile.headline ? (
          <p className="text-ink">{profile.headline}</p>
        ) : (
          <p className="text-ink-muted italic">Not set</p>
        )}
      </Field>

      <Field label="Bio">
        {profile.bio ? (
          <p className="whitespace-pre-wrap text-ink">{profile.bio}</p>
        ) : (
          <p className="text-ink-muted italic">Not set</p>
        )}
      </Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Hourly rate">
          <p className="text-ink">${profile.hourlyRate}/hr</p>
        </Field>
        <Field label="Years of experience">
          <p className="text-ink">{profile.experience} years</p>
        </Field>
      </div>

      <Field label="Subjects you teach">
        {profile.categories.length === 0 ? (
          <p className="text-ink-muted italic">No categories selected</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.categories.map((c) => (
              <span
                key={c.id}
                className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
              >
                {c.name}
              </span>
            ))}
          </div>
        )}
      </Field>

      <Field label="Status">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            profile.isPublished
              ? 'bg-green-50 text-success'
              : 'bg-surface-muted text-ink-muted'
          }`}
        >
          {profile.isPublished ? 'Published' : 'Hidden'}
        </span>
      </Field>

      {profile.ratingCount > 0 && (
        <Field label="Rating">
          <p className="text-ink">
            <span className="text-amber-500">★</span> {profile.ratingAvg.toFixed(1)} (
            {profile.ratingCount} review{profile.ratingCount === 1 ? '' : 's'})
          </p>
        </Field>
      )}

      <div className="pt-2">
        <Button type="button" variant="primary" onClick={onEdit}>
          Edit profile
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      {children}
    </div>
  );
}
