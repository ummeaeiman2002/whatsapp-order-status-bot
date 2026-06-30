import { getStore } from '../client';
import { Conversation, SenderType } from '../../types';

export function getConversationsBySession(sessionId: string): Conversation[] {
  return getStore()
    .conversations.filter((c) => c.session_id === sessionId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function saveConversation(
  userId: string,
  sessionId: string,
  message: string,
  sender: SenderType,
): Conversation {
  const conversation: Conversation = {
    id: crypto.randomUUID(),
    user_id: userId,
    session_id: sessionId,
    message,
    sender,
    created_at: new Date().toISOString(),
  };
  getStore().conversations.push(conversation);
  return conversation;
}
