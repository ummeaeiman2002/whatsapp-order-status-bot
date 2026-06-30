import fs from 'fs';
import path from 'path';
import { getStore, resetStore } from './client';
import { User, Order, TrackingUpdate, Conversation, Notification, AgentLog } from '../types';

const MOCKDATA_DIR = path.join(__dirname, '../../mockdata');

function loadJSON<T>(filename: string): T[] {
  const filePath = path.join(MOCKDATA_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T[];
}

function generateSeedData() {
  resetStore();
  const store = getStore();

  const users = loadJSON<User>('users.json');
  const orders = loadJSON<Order>('orders.json');
  const trackingUpdates = loadJSON<TrackingUpdate>('tracking_updates.json');
  const conversations = loadJSON<Conversation>('conversations.json');
  const notifications = loadJSON<Notification>('notifications.json');
  const agentLogs = loadJSON<AgentLog>('agent_logs.json');

  store.users.push(...users);
  store.orders.push(...orders);
  store.trackingUpdates.push(...trackingUpdates);
  store.conversations.push(...conversations);
  store.notifications.push(...notifications);
  store.agentLogs.push(...agentLogs);

  console.log('Mock data loaded from JSON files:');
  console.log(`  Users: ${store.users.length}`);
  console.log(`  Orders: ${store.orders.length}`);
  console.log(`  Tracking Updates: ${store.trackingUpdates.length}`);
  console.log(`  Conversations: ${store.conversations.length}`);
  console.log(`  Notifications: ${store.notifications.length}`);
  console.log(`  Agent Logs: ${store.agentLogs.length}`);
}

generateSeedData();
