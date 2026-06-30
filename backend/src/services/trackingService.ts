import * as trackingQuery from '../db/queries/tracking';
import { TrackingUpdate } from '../types';

export function getByOrderId(orderId: string): TrackingUpdate[] {
  return trackingQuery.getTrackingUpdatesByOrderId(orderId);
}

export function getLatest(orderId: string): TrackingUpdate | undefined {
  return trackingQuery.getLatestTrackingUpdate(orderId);
}
