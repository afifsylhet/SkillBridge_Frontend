import Spinner from '@/components/ui/Spinner';

/** Spinner shown while tutor list data is fetching from the API/DB. */
export default function TutorsLoadingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16"
    >
      <Spinner size="lg" className="h-14 w-14" />
      <p className="text-sm font-medium text-ink-muted">Loading tutors…</p>
    </div>
  );
}
