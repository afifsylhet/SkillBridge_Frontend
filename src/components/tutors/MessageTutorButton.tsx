'use client';

import { useMutation } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import { startConversation } from '@/lib/api/messages';
import { useCurrentUser } from '@/lib/hooks';
import { useToast } from '@/lib/hooks/useToast';
import { useAppRouter } from '@/lib/hooks/useAppRouter';
import { ROUTES } from '@/lib/constants/routes';

export default function MessageTutorButton({ tutorProfileId }: { tutorProfileId: string }) {
  const { data: user } = useCurrentUser();
  const router = useAppRouter();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: () => startConversation(tutorProfileId),
    onSuccess: (data) => {
      router.push(`${ROUTES.DASHBOARD_MESSAGES}?c=${data.id}`);
    },
    onError: (err: Error) => showToast(err.message || 'Could not start conversation', 'error'),
  });

  if (!user || user.role !== 'STUDENT') return null;

  return (
    <Button
      type="button"
      variant="ghost"
      className="w-full"
      isLoading={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      Message tutor
    </Button>
  );
}
