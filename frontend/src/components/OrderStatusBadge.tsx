'use client';

import type { OrderStatus } from '@/src/types';

const statusStyles: Record<OrderStatus, string> = {
  Pending: 'bg-gray-100 text-gray-700',
  Processing: 'bg-blue-100 text-blue-700',
  Packed: 'bg-indigo-100 text-indigo-700',
  Shipped: 'bg-cyan-100 text-cyan-700',
  'In Transit': 'bg-sky-100 text-sky-700',
  'Out For Delivery': 'bg-yellow-100 text-yellow-700',
  Delivered: 'bg-green-100 text-green-700',
  Delayed: 'bg-red-100 text-red-700',
  Returned: 'bg-orange-100 text-orange-700',
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium leading-tight ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}
    >
      {status}
    </span>
  );
}
