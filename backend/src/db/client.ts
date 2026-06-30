import { User, Order, TrackingUpdate, Conversation, Notification, AgentLog } from '../types';

interface Store {
  users: User[];
  orders: Order[];
  trackingUpdates: TrackingUpdate[];
  conversations: Conversation[];
  notifications: Notification[];
  agentLogs: AgentLog[];
}

const store: Store = {
  users: [],
  orders: [],
  trackingUpdates: [],
  conversations: [],
  notifications: [],
  agentLogs: [],
};

export function getStore(): Store {
  return store;
}

export function resetStore(): void {
  store.users = [];
  store.orders = [];
  store.trackingUpdates = [];
  store.conversations = [];
  store.notifications = [];
  store.agentLogs = [];
}
