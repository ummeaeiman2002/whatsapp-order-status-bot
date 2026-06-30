import { getStore } from '../client';
import { Order, OrderStatus, PaginatedResult } from '../../types';

export function getOrderByNumber(orderNumber: string): Order | undefined {
  return getStore().orders.find((o) => o.order_number === orderNumber);
}

export function getOrderById(id: string): Order | undefined {
  return getStore().orders.find((o) => o.id === id);
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return getStore().orders.filter((o) => o.customer_id === customerId);
}

export function listOrders(
  search?: string,
  status?: OrderStatus,
  page = 1,
  limit = 20,
  customerId?: string,
): PaginatedResult<Order> {
  let filtered = [...getStore().orders];

  if (customerId) {
    filtered = filtered.filter((o) => o.customer_id === customerId);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.order_number.toLowerCase().includes(q) ||
        o.courier_name.toLowerCase().includes(q),
    );
  }

  if (status) {
    filtered = filtered.filter((o) => o.status === status);
  }

  filtered.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const total = filtered.length;
  const offset = (page - 1) * limit;
  const data = filtered.slice(offset, offset + limit);

  return { data, total, page, limit };
}

export function getActiveOrders(): Order[] {
  const activeStatuses: OrderStatus[] = [
    OrderStatus.Shipped,
    OrderStatus.InTransit,
    OrderStatus.OutForDelivery,
    OrderStatus.Processing,
    OrderStatus.Packed,
  ];
  return getStore().orders.filter((o) => activeStatuses.includes(o.status));
}

export function getOrdersPastExpectedDelivery(): Order[] {
  const now = new Date();
  return getStore().orders.filter(
    (o) =>
      o.status !== OrderStatus.Delivered &&
      o.status !== OrderStatus.Returned &&
      new Date(o.expected_delivery_date) < now,
  );
}
