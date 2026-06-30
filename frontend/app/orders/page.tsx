'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { Order, OrderStatus } from '@/src/types';
import { getOrders } from '@/src/lib/api-client';
import OrderStatusBadge from '@/src/components/OrderStatusBadge';
import { ListSkeleton } from '@/src/components/LoadingSkeleton';

const statuses: { label: string; value: OrderStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Processing', value: 'Processing' },
  { label: 'Shipped', value: 'Shipped' },
  { label: 'In Transit', value: 'In Transit' },
  { label: 'Out For Delivery', value: 'Out For Delivery' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Delayed', value: 'Delayed' },
  { label: 'Returned', value: 'Returned' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getOrders({ search, status: statusFilter || undefined, page, limit });
      setOrders(result.data);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page, limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalPages = Math.ceil(total / limit);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  return (
    <div className="flex flex-col h-full bg-[#efeae2]">
      {/* Header */}
      <header className="bg-[#075e54] text-white px-6 py-4 shrink-0">
        <h1 className="text-lg font-semibold">Orders</h1>
        <p className="text-xs text-[#8caba6] mt-0.5">{total} total orders</p>
      </header>

      {/* Search + Filter */}
      <div className="bg-white px-6 py-3 border-b border-gray-200 shrink-0 space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number..."
            className="flex-1 bg-[#f0f2f5] rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#25d366] transition-all"
          />
          <button
            type="submit"
            className="bg-[#25d366] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#20b85a] transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => { setStatusFilter(s.value); setPage(1); }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === s.value
                  ? 'bg-[#075e54] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {loading ? (
          <ListSkeleton rows={5} />
        ) : error ? (
          <div className="bg-red-100 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-sm">No orders found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white rounded-lg px-5 py-4 shadow-sm hover:shadow-md transition-shadow border-l-3 border-transparent hover:border-[#25d366]"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {order.order_number}
                      </span>
                      <OrderStatusBadge status={order.status as OrderStatus} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.courier_name} &middot; Expected {new Date(order.expected_delivery_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-sm text-gray-600 disabled:text-gray-300 hover:text-[#075e54] transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-sm text-gray-600 disabled:text-gray-300 hover:text-[#075e54] transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
