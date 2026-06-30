import type { ChatReply, Conversation, Order, OrderDetail, Notification, AgentLog, PaginatedResponse } from '@/src/types';

const API_BASE = '/api';

function generateSessionId(): string {
  return `session-${crypto.randomUUID().slice(0, 8)}`;
}

function getUserId(): string {
  let userId = localStorage.getItem('chat_user_id');
  if (!userId) {
    userId = `user-${crypto.randomUUID().slice(0, 8)}`;
    localStorage.setItem('chat_user_id', userId);
  }
  return userId;
}

function getUserRole(): string {
  return localStorage.getItem('user_role') || 'Customer';
}

function getSessionId(): string {
  let sessionId = localStorage.getItem('chat_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('chat_session_id', sessionId);
  }
  return sessionId;
}

export function resetSession(): void {
  const newSession = generateSessionId();
  localStorage.setItem('chat_session_id', newSession);
}

async function fetchRaw<T>(url: string, init?: RequestInit): Promise<{ data: T; meta?: { total: number; page: number; limit: number } }> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const json = await res.json();
  return { data: json.data as T, meta: json.meta };
}

// --- Chat ---

export async function sendMessage(message: string): Promise<ChatReply> {
  const { data } = await fetchRaw<ChatReply>(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      sessionId: getSessionId(),
      userId: getUserId(),
    }),
  });
  return data;
}

export async function getConversation(): Promise<Conversation[]> {
  const { data } = await fetchRaw<{ messages: Conversation[] }>(
    `${API_BASE}/chat?sessionId=${encodeURIComponent(getSessionId())}&userId=${encodeURIComponent(getUserId())}`
  );
  return data.messages;
}

// --- Orders ---

export async function getOrders(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Order>> {
  const q = new URLSearchParams({
    userId: getUserId(),
    userRole: getUserRole(),
    ...(params?.search && { search: params.search }),
    ...(params?.status && { status: params.status }),
    page: String(params?.page || 1),
    limit: String(params?.limit || 20),
  });
  const { data, meta } = await fetchRaw<Order[]>(`${API_BASE}/orders?${q}`);
  return { data, total: meta?.total ?? 0, page: meta?.page ?? 1, limit: meta?.limit ?? 20 };
}

export async function getOrderById(id: string): Promise<OrderDetail> {
  const { data } = await fetchRaw<OrderDetail>(`${API_BASE}/orders/${id}?${encodeQuery({ userId: getUserId(), userRole: getUserRole() })}`);
  return data;
}

// --- Notifications ---

export async function getNotifications(params?: {
  type?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Notification>> {
  const q = new URLSearchParams({
    page: String(params?.page || 1),
    limit: String(params?.limit || 20),
    ...(params?.type && { type: params.type }),
  });
  const { data, meta } = await fetchRaw<Notification[]>(`${API_BASE}/notifications?${q}`);
  return { data, total: meta?.total ?? 0, page: meta?.page ?? 1, limit: meta?.limit ?? 20 };
}

// --- Logs ---

export async function getLogs(params?: {
  action?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<AgentLog>> {
  const q = new URLSearchParams({
    page: String(params?.page || 1),
    limit: String(params?.limit || 50),
    ...(params?.action && { action: params.action }),
  });
  const { data, meta } = await fetchRaw<AgentLog[]>(`${API_BASE}/logs?${q}`);
  return { data, total: meta?.total ?? 0, page: meta?.page ?? 1, limit: meta?.limit ?? 50 };
}

// --- Helpers ---

function encodeQuery(params: Record<string, string>): string {
  return new URLSearchParams(params).toString();
}
