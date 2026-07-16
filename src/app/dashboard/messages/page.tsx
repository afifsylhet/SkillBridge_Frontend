'use client';

import MessagesInbox from '@/components/messages/MessagesInbox';

export default function StudentMessagesPage() {
  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
        Messages
      </h1>
      <p className="mb-6 text-sm text-ink-muted">Chat with your tutors about upcoming sessions.</p>
      <MessagesInbox role="STUDENT" />
    </div>
  );
}
