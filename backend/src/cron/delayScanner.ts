import * as ordersQuery from '../db/queries/orders';
import * as trackingQuery from '../db/queries/tracking';
import * as notificationsQuery from '../db/queries/notifications';
import * as agentLogsQuery from '../db/queries/agentLogs';
import { NotificationType, AgentLogAction } from '../types';

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

export function scanForDelays(): { scanned: number; delayed: number; notifications: number } {
  const startTime = Date.now();
  let delayedCount = 0;
  let notificationCount = 0;

  const activeOrders = ordersQuery.getActiveOrders();

  for (const order of activeOrders) {
    let isDelayed = false;
    let reason = '';

    const latestUpdate = trackingQuery.getLatestTrackingUpdate(order.id);

    // R1: No tracking update within 48 hours
    if (latestUpdate) {
      const hoursSinceUpdate = (startTime - new Date(latestUpdate.update_time).getTime()) / (60 * 60 * 1000);
      if (hoursSinceUpdate > 48) {
        isDelayed = true;
        reason = `No tracking update in ${Math.floor(hoursSinceUpdate)} hours`;
      }
    } else {
      isDelayed = true;
      reason = 'No tracking updates available';
    }

    // R2: Past expected delivery date
    if (!isDelayed) {
      const expectedDate = new Date(order.expected_delivery_date);
      if (new Date(startTime) > expectedDate) {
        isDelayed = true;
        reason = `Past expected delivery date (${order.expected_delivery_date})`;
      }
    }

    if (isDelayed) {
      delayedCount++;

      if (!notificationsQuery.hasNotificationForOrder(order.id, NotificationType.DelayAlert)) {
        notificationsQuery.createNotification(
          order.id,
          NotificationType.DelayAlert,
          `Order ${order.order_number} is delayed. ${reason}`,
        );
        notificationCount++;
      }
    }
  }

  const duration = Date.now() - startTime;

  agentLogsQuery.saveLog(AgentLogAction.DelayDetected, {
    scanner_run: true,
    scanned_orders: activeOrders.length,
    delayed_found: delayedCount,
    notifications_generated: notificationCount,
    duration_ms: duration,
    scanned_at: new Date(startTime).toISOString(),
  });

  console.log(`[DelayScanner] Scanned ${activeOrders.length} active orders. Found ${delayedCount} delayed. Generated ${notificationCount} notifications. (${duration}ms)`);

  return {
    scanned: activeOrders.length,
    delayed: delayedCount,
    notifications: notificationCount,
  };
}
