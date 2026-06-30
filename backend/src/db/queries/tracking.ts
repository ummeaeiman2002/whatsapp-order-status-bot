import { getStore } from '../client';
import { TrackingUpdate } from '../../types';

export function getTrackingUpdatesByOrderId(orderId: string): TrackingUpdate[] {
  return getStore()
    .trackingUpdates.filter((t) => t.order_id === orderId)
    .sort((a, b) => new Date(b.update_time).getTime() - new Date(a.update_time).getTime());
}

export function getLatestTrackingUpdate(orderId: string): TrackingUpdate | undefined {
  const updates = getTrackingUpdatesByOrderId(orderId);
  return updates.length > 0 ? updates[0] : undefined;
}
