'use client';

import MessagesInbox from '@/components/messages/MessagesInbox';

export default function TutorMessagesPage() {
  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
        Messages
      </h1>
      <p className="mb-6 text-sm text-ink-muted">Respond to students about bookings and sessions.</p>
      <MessagesInbox role="TUTOR" />
    </div>
  );
}
