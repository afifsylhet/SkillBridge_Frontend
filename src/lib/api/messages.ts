import { apiCallOrThrow } from './client';

export type ConversationSummary = {
  id: string;
  lastMessageAt: string;
  student: { id: string; name: string; avatarUrl: string | null };
  tutor: {
    id: string;
    name: string;
    avatarUrl: string | null;
    profileId: string;
    headline: string | null;
  };
  lastMessage: {
    id: string;
    body: string;
    senderId: string;
    createdAt: string;
    readAt: string | null;
  } | null;
};

export type MessageItem = {
  id: string;
  body: string;
  senderId: string;
  createdAt: string;
  readAt: string | null;
  sender: { id: string; name: string; avatarUrl: string | null };
};

export async function listConversations() {
  return apiCallOrThrow<ConversationSummary[]>('/messages/conversations');
}

export async function startConversation(tutorProfileId: string) {
  return apiCallOrThrow<{ id: string }>('/messages/conversations', {
    method: 'POST',
    body: JSON.stringify({ tutorProfileId }),
  });
}

export async function getConversation(id: string) {
  return apiCallOrThrow<{
    id: string;
    student: { id: string; name: string; avatarUrl: string | null };
    tutor: {
      id: string;
      name: string;
      avatarUrl: string | null;
      profileId: string;
      headline: string | null;
    };
    messages: MessageItem[];
  }>(`/messages/conversations/${id}`);
}

export async function sendMessage(conversationId: string, body: string) {
  return apiCallOrThrow<MessageItem>(`/messages/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

export async function markConversationRead(conversationId: string) {
  return apiCallOrThrow(`/messages/conversations/${conversationId}/read`, { method: 'PATCH' });
}
