import { OrderWithTracking } from '../../types';
import * as orderService from '../../services/orderService';
import * as trackingService from '../../services/trackingService';
import { NotFoundError } from '../../lib/api-error';

export function fetchOrderData(orderNumber: string): OrderWithTracking {
  const order = orderService.getByNumber(orderNumber);
  const trackingUpdates = trackingService.getByOrderId(order.id);

  return { order, trackingUpdates };
}
