import * as ordersQuery from '../db/queries/orders';
import * as usersQuery from '../db/queries/users';
import { Order, OrderStatus, OrderSummary, PaginatedResult, UserRole } from '../types';
import { NotFoundError, ForbiddenError } from '../lib/api-error';

export function getByNumber(orderNumber: string): Order {
  const order = ordersQuery.getOrderByNumber(orderNumber);
  if (!order) throw new NotFoundError(`Order ${orderNumber} not found`);
  return order;
}

export function getById(id: string): Order {
  const order = ordersQuery.getOrderById(id);
  if (!order) throw new NotFoundError(`Order not found`);
  return order;
}

export function list(
  userId: string,
  userRole: UserRole,
  search?: string,
  status?: OrderStatus,
  page?: number,
  limit?: number,
): PaginatedResult<Order> {
  if (userRole === UserRole.Customer) {
    return ordersQuery.listOrders(search, status, page, limit, userId);
  }
  return ordersQuery.listOrders(search, status, page, limit);
}

export function getByCustomer(customerId: string): Order[] {
  return ordersQuery.getOrdersByCustomer(customerId);
}

export function getOrderSummary(orderNumber: string): OrderSummary {
  const order = getByNumber(orderNumber);
  return {
    order_number: order.order_number,
    status: order.status,
    courier_name: order.courier_name,
    expected_delivery_date: order.expected_delivery_date,
  };
}

export function verifyOrderAccess(orderId: string, userId: string, userRole: UserRole): Order {
  const order = getById(orderId);
  if (userRole === UserRole.Customer && order.customer_id !== userId) {
    throw new ForbiddenError('You can only view your own orders');
  }
  return order;
}
