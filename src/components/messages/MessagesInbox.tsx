'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getConversation,
  listConversations,
  markConversationRead,
  sendMessage,
  type ConversationSummary,
} from '@/lib/api/messages';
import { useCurrentUser } from '@/lib/hooks';
import { formatDateTime } from '@/lib/utils/format';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import PageLoader from '@/components/ui/PageLoader';
import Spinner from '@/components/ui/Spinner';

type MessagesInboxProps = {
  role: 'STUDENT' | 'TUTOR';
};

function getOtherParty(conv: ConversationSummary, role: 'STUDENT' | 'TUTOR') {
  return role === 'STUDENT' ? conv.tutor : conv.student;
}

export default function MessagesInbox({ role }: MessagesInboxProps) {
  const qc = useQueryClient();
  const { data: me } = useCurrentUser();
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const c = searchParams.get('c');
    if (c) setSelectedId(c);
  }, [searchParams]);

  const { data: conversations, isLoading: listLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: listConversations,
    refetchInterval: 10_000,
  });

  const { data: thread, isLoading: threadLoading } = useQuery({
    queryKey: ['conversation', selectedId],
    queryFn: () => getConversation(selectedId!),
    enabled: Boolean(selectedId),
    refetchInterval: selectedId ? 10_000 : false,
  });

  useEffect(() => {
    if (selectedId) {
      markConversationRead(selectedId)
        .then(() => qc.invalidateQueries({ queryKey: ['conversations'] }))
        .catch(() => {});
    }
  }, [selectedId, qc]);

  const sendMutation = useMutation({
    mutationFn: (body: string) => sendMessage(selectedId!, body),
    onSuccess: () => {
      setDraft('');
      qc.invalidateQueries({ queryKey: ['conversation', selectedId] });
      qc.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !selectedId) return;
    sendMutation.mutate(body);
  };

  if (listLoading) {
    return <PageLoader label="Loading messages…" />;
  }

  const items = conversations ?? [];

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[480px] overflow-hidden rounded-2xl border border-surface-border bg-surface shadow-card">
      <aside className="flex w-full flex-col border-r border-surface-border md:w-80 lg:w-96">
        <div className="border-b border-surface-border px-4 py-3.5">
          <h2 className="text-sm font-semibold text-ink">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-4">
              <EmptyState
                headline="No conversations yet"
                description={
                  role === 'STUDENT'
                    ? 'Message a tutor from their profile to start a conversation.'
                    : 'When students message you, conversations will appear here.'
                }
              />
            </div>
          ) : (
            <ul>
              {items.map((conv) => {
                const other = getOtherParty(conv, role);
                const active = selectedId === conv.id;
                const preview = conv.lastMessage?.body ?? 'No messages yet';
                const unread =
                  conv.lastMessage &&
                  conv.lastMessage.senderId !== me?.id &&
                  !conv.lastMessage.readAt;

                return (
                  <li key={conv.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(conv.id)}
                      className={`flex w-full flex-col gap-1 border-b border-surface-border px-4 py-3.5 text-left transition hover:bg-surface-muted ${
                        active ? 'bg-brand-50 dark:bg-brand-100' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`truncate text-sm ${unread ? 'font-semibold text-ink' : 'font-medium text-ink'}`}>
                          {other.name}
                        </span>
                        {conv.lastMessageAt && (
                          <span className="shrink-0 text-xs text-ink-muted">
                            {new Date(conv.lastMessageAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                      {role === 'STUDENT' && conv.tutor.headline && (
                        <span className="truncate text-xs text-ink-muted">{conv.tutor.headline}</span>
                      )}
                      <p className={`truncate text-xs ${unread ? 'text-ink-soft' : 'text-ink-muted'}`}>
                        {preview}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      <section className="hidden flex-1 flex-col md:flex">
        {!selectedId ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <EmptyState
              headline="Select a conversation"
              description="Choose a thread from the list to read and reply."
            />
          </div>
        ) : threadLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : thread ? (
          <>
            <div className="border-b border-surface-border px-6 py-4">
              <p className="font-semibold text-ink">
                {role === 'STUDENT' ? thread.tutor.name : thread.student.name}
              </p>
              {role === 'STUDENT' && thread.tutor.headline && (
                <p className="text-sm text-ink-muted">{thread.tutor.headline}</p>
              )}
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              {thread.messages.length === 0 ? (
                <p className="text-center text-sm text-ink-muted">Send the first message.</p>
              ) : (
                thread.messages.map((msg) => {
                  const mine = msg.senderId === me?.id;
                  return (
                    <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          mine
                            ? 'bg-brand-600 text-white'
                            : 'border border-surface-border bg-surface-muted text-ink'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.body}</p>
                        <p
                          className={`mt-1.5 text-[11px] ${mine ? 'text-brand-100' : 'text-ink-muted'}`}
                        >
                          {formatDateTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <form onSubmit={handleSend} className="border-t border-surface-border bg-surface-muted/40 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 rounded-xl border border-surface-border bg-surface px-4 py-2.5 text-sm text-ink placeholder-ink-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <Button type="submit" isLoading={sendMutation.isPending} disabled={!draft.trim()}>
                  Send
                </Button>
              </div>
            </form>
          </>
        ) : null}
      </section>
    </div>
  );
}
