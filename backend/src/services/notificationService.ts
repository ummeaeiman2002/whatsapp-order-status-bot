import * as notificationsQuery from '../db/queries/notifications';
import { Notification, NotificationType, PaginatedResult } from '../types';

export function create(
  orderId: string,
  type: NotificationType,
  message: string,
): Notification {
  return notificationsQuery.createNotification(orderId, type, message);
}

export function list(
  type?: NotificationType,
  page?: number,
  limit?: number,
): PaginatedResult<Notification> {
  return notificationsQuery.listNotifications(type, page, limit);
}

export function getByOrder(orderId: string): Notification[] {
  return notificationsQuery.getNotificationsByOrder(orderId);
}

export function existsForOrder(orderId: string, type: NotificationType): boolean {
  return notificationsQuery.hasNotificationForOrder(orderId, type);
}
