import { getStore } from '../client';
import { Notification, NotificationType, PaginatedResult } from '../../types';

export function getNotificationsByOrder(orderId: string): Notification[] {
  return getStore()
    .notifications.filter((n) => n.order_id === orderId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function listNotifications(
  type?: NotificationType,
  page = 1,
  limit = 20,
): PaginatedResult<Notification> {
  let filtered = [...getStore().notifications];

  if (type) {
    filtered = filtered.filter((n) => n.notification_type === type);
  }

  filtered.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const total = filtered.length;
  const offset = (page - 1) * limit;
  const data = filtered.slice(offset, offset + limit);

  return { data, total, page, limit };
}

export function createNotification(
  orderId: string,
  type: NotificationType,
  message: string,
): Notification {
  const notification: Notification = {
    id: crypto.randomUUID(),
    order_id: orderId,
    notification_type: type,
    message,
    created_at: new Date().toISOString(),
  };
  getStore().notifications.push(notification);
  return notification;
}

export function hasNotificationForOrder(orderId: string, type: NotificationType): boolean {
  return getStore().notifications.some(
    (n) => n.order_id === orderId && n.notification_type === type,
  );
}
