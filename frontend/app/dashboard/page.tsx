'use client';

import { useState, useEffect } from 'react';
import type { Order, Notification, AgentLog, OrderStatus } from '@/src/types';
import { getOrders, getNotifications, getLogs } from '@/src/lib/api-client';
import OrderStatusBadge from '@/src/components/OrderStatusBadge';
import { StatsCardSkeleton, ListSkeleton } from '@/src/components/LoadingSkeleton';

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [ordersRes, notifRes, logsRes] = await Promise.all([
          getOrders({ limit: 100 }),
          getNotifications({ limit: 5 }),
          getLogs({ limit: 10 }),
        ]);
        setOrders(ordersRes.data);
        setNotifications(notifRes.data);
        setLogs(logsRes.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalOrders = orders.length;
  const delayedOrders = orders.filter((o) => o.status === 'Delayed').length;
  const inTransitOrders = orders.filter((o) =>
    ['Shipped', 'In Transit', 'Out For Delivery'].includes(o.status)
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

  const stats = [
    { label: 'Total Orders', value: totalOrders, color: 'text-[#075e54]' },
    { label: 'In Transit', value: inTransitOrders, color: 'text-sky-600' },
    { label: 'Delivered', value: deliveredOrders, color: 'text-green-600' },
    { label: 'Delayed', value: delayedOrders, color: 'text-red-600' },
  ];

  if (error) {
    return (
      <div className="flex flex-col h-full bg-[#efeae2]">
        <header className="bg-[#075e54] text-white px-6 py-4 shrink-0">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-100 border border-red-200 text-red-700 text-sm rounded-lg px-6 py-4">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#efeae2]">
      {/* Header */}
      <header className="bg-[#075e54] text-white px-6 py-4 shrink-0">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-xs text-[#8caba6] mt-0.5">Overview &amp; recent activity</p>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg px-5 py-4 shadow-sm">
              {loading ? (
                <StatsCardSkeleton />
              ) : (
                <>
                  <p className="text-[0.65rem] text-gray-400 uppercase tracking-wide">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                    {stat.value.toLocaleString()}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Recent Orders</h2>
          {loading ? (
            <ListSkeleton rows={4} />
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg px-5 py-3 shadow-sm flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {order.order_number}
                      </span>
                      <OrderStatusBadge status={order.status as OrderStatus} />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{order.courier_name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Notifications */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Recent Notifications</h2>
          {loading ? (
            <ListSkeleton rows={3} />
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="bg-white rounded-lg px-5 py-3 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[0.65rem] font-medium uppercase px-2 py-0.5 rounded-full ${
                      n.notification_type === 'Delay Alert'
                        ? 'bg-red-100 text-red-700'
                        : n.notification_type === 'Delivery Confirmation'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {n.notification_type}
                    </span>
                    <span className="text-[0.6rem] text-gray-400">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Agent Logs */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Recent Agent Activity</h2>
          {loading ? (
            <ListSkeleton rows={3} />
          ) : (
            <div className="space-y-1.5">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white rounded-lg px-5 py-3 shadow-sm flex items-center gap-3"
                >
                  <span className={`text-[0.6rem] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    log.action === 'DELAY_DETECTED'
                      ? 'bg-red-100 text-red-700'
                      : log.action === 'ORDER_FETCHED'
                      ? 'bg-blue-100 text-blue-700'
                      : log.action === 'RESPONSE_GENERATED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {log.action}
                  </span>
                  <span className="text-xs text-gray-500 flex-1 truncate">
                    {JSON.stringify(log.payload).slice(0, 80)}
                    {JSON.stringify(log.payload).length > 80 ? '...' : ''}
                  </span>
                  <span className="text-[0.6rem] text-gray-400 shrink-0">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
