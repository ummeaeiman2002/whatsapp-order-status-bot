import * as notificationService from '../../services/notificationService';
import { NotificationType } from '../../types';

export function generateDelayNotification(orderId: string, orderNumber: string, reason: string): void {
  if (notificationService.existsForOrder(orderId, NotificationType.DelayAlert)) {
    return;
  }

  notificationService.create(
    orderId,
    NotificationType.DelayAlert,
    `Order ${orderNumber} is delayed. ${reason}`,
  );
}
