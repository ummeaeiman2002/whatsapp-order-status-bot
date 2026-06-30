import * as conversationsQuery from '../db/queries/conversations';
import { Conversation, SenderType } from '../types';

export function getBySessionId(sessionId: string): Conversation[] {
  return conversationsQuery.getConversationsBySession(sessionId);
}

export function save(
  userId: string,
  sessionId: string,
  message: string,
  sender: SenderType,
): Conversation {
  return conversationsQuery.saveConversation(userId, sessionId, message, sender);
}
