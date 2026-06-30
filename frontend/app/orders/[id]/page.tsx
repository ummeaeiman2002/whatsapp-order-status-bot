'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { OrderStatus, OrderDetail } from '@/src/types';
import { getOrderById } from '@/src/lib/api-client';
import OrderStatusBadge from '@/src/components/OrderStatusBadge';
import TrackingTimeline from '@/src/components/TrackingTimeline';
import { TimelineSkeleton } from '@/src/components/LoadingSkeleton';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getOrderById(id)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-[#efeae2]">
        <header className="bg-[#075e54] text-white px-6 py-4 shrink-0">
          <div className="h-5 bg-white/20 rounded animate-pulse w-40" />
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <TimelineSkeleton />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col h-full bg-[#efeae2]">
        <header className="bg-[#075e54] text-white px-6 py-4 shrink-0">
          <Link href="/orders" className="text-sm text-white/80 hover:text-white">
            &larr; Back to Orders
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-100 border border-red-200 text-red-700 text-sm rounded-lg px-6 py-4">
            {error || 'Order not found'}
          </div>
        </div>
      </div>
    );
  }

  const { order, trackingUpdates } = data;

  return (
    <div className="flex flex-col h-full bg-[#efeae2]">
      {/* Header */}
      <header className="bg-[#075e54] text-white px-6 py-4 shrink-0">
        <Link href="/orders" className="text-xs text-[#8caba6] hover:text-white transition-colors">
          &larr; Back to Orders
        </Link>
        <div className="flex items-center gap-3 mt-1">
          <h1 className="text-lg font-semibold">{order.order_number}</h1>
          <OrderStatusBadge status={order.status as OrderStatus} />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
            <p className="text-[0.65rem] text-gray-400 uppercase tracking-wide">Courier</p>
            <p className="text-sm font-medium text-gray-900 mt-0.5">{order.courier_name}</p>
          </div>
          <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
            <p className="text-[0.65rem] text-gray-400 uppercase tracking-wide">Expected Delivery</p>
            <p className="text-sm font-medium text-gray-900 mt-0.5">
              {new Date(order.expected_delivery_date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Tracking History</h2>
          <TrackingTimeline updates={trackingUpdates} />
        </div>

        {/* Order Meta */}
        <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
          <p className="text-[0.65rem] text-gray-400 uppercase tracking-wide">Order Placed</p>
          <p className="text-sm text-gray-900 mt-0.5">
            {new Date(order.created_at).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
