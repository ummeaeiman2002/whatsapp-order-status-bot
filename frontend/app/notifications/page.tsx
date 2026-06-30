'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { Notification, NotificationType } from '@/src/types';
import { getNotifications } from '@/src/lib/api-client';
import { ListSkeleton } from '@/src/components/LoadingSkeleton';

const types: { label: string; value: NotificationType | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Delay Alert', value: 'Delay Alert' },
  { label: 'Delivery Confirmation', value: 'Delivery Confirmation' },
  { label: 'Tracking Update', value: 'Tracking Update' },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getNotifications({
        type: typeFilter || undefined,
        page,
        limit,
      });
      setNotifications(result.data);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, page, limit]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const totalPages = Math.ceil(total / limit);

  function getTypeStyle(type: NotificationType): string {
    switch (type) {
      case 'Delay Alert':
        return 'bg-red-100 text-red-700';
      case 'Delivery Confirmation':
        return 'bg-green-100 text-green-700';
      case 'Tracking Update':
        return 'bg-blue-100 text-blue-700';
    }
  }

  function getTypeIcon(type: NotificationType): string {
    switch (type) {
      case 'Delay Alert':
        return '⚠️';
      case 'Delivery Confirmation':
        return '✅';
      case 'Tracking Update':
        return '🔄';
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#efeae2]">
      {/* Header */}
      <header className="bg-[#075e54] text-white px-6 py-4 shrink-0">
        <h1 className="text-lg font-semibold">Notifications</h1>
        <p className="text-xs text-[#8caba6] mt-0.5">{total} total</p>
      </header>

      {/* Filter */}
      <div className="bg-white px-6 py-3 border-b border-gray-200 shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => { setTypeFilter(t.value); setPage(1); }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                typeFilter === t.value
                  ? 'bg-[#075e54] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t.label}
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
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-sm">No notifications found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="bg-white rounded-lg px-5 py-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="text-base mt-0.5">{getTypeIcon(n.notification_type as NotificationType)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[0.6rem] font-medium uppercase px-2 py-0.5 rounded-full ${getTypeStyle(n.notification_type as NotificationType)}`}>
                        {n.notification_type}
                      </span>
                      <span className="text-[0.6rem] text-gray-400">
                        {new Date(n.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{n.message}</p>
                  </div>
                </div>
              </div>
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
