import { Order, TrackingUpdate, DelayResult, OrderStatus } from '../../types';

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

export function analyzeDelay(order: Order, trackingUpdates: TrackingUpdate[]): DelayResult {
  const now = new Date();

  // R1: No tracking update within 48 hours
  if (trackingUpdates.length > 0) {
    const latest = new Date(trackingUpdates[0].update_time);
    const hoursSinceUpdate = (now.getTime() - latest.getTime()) / (60 * 60 * 1000);
    if (hoursSinceUpdate > 48) {
      return {
        isDelayed: true,
        ruleTriggered: 'R1',
        reason: `No tracking update in the last ${Math.floor(hoursSinceUpdate)} hours (last update: ${trackingUpdates[0].update_time}).`,
      };
    }
  } else {
    // No tracking updates at all — treat as potential delay if order is not delivered/returned
    if (order.status !== OrderStatus.Delivered && order.status !== OrderStatus.Returned) {
      return {
        isDelayed: true,
        ruleTriggered: 'R1',
        reason: 'No tracking updates available yet.',
      };
    }
  }

  // R2: Past expected delivery date
  if (order.status !== OrderStatus.Delivered && order.status !== OrderStatus.Returned) {
    const expectedDate = new Date(order.expected_delivery_date);
    if (now > expectedDate) {
      const daysPast = Math.floor((now.getTime() - expectedDate.getTime()) / (1000 * 60 * 60 * 24));
      return {
        isDelayed: true,
        ruleTriggered: 'R2',
        reason: `Expected delivery date was ${order.expected_delivery_date} (${daysPast} day(s) ago).`,
      };
    }
  }

  return {
    isDelayed: false,
    ruleTriggered: null,
    reason: null,
  };
}
