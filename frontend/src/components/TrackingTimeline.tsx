'use client';

import type { TrackingUpdate } from '@/src/types';

export default function TrackingTimeline({ updates }: { updates: TrackingUpdate[] }) {
  if (updates.length === 0) {
    return (
      <div className="text-gray-400 text-sm text-center py-8">
        No tracking updates available yet.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-[#25d366]/30" />

      <div className="space-y-0">
        {updates.map((update, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === updates.length - 1;

          return (
            <div key={update.id} className="flex gap-4 relative">
              {/* Dot */}
              <div className="flex flex-col items-center shrink-0 pt-1.5">
                <div
                  className={`w-4 h-4 rounded-full border-2 z-10 ${
                    isFirst
                      ? 'bg-[#25d366] border-[#25d366]'
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              {/* Content */}
              <div
                className={`flex-1 pb-6 min-w-0 ${
                  isLast ? 'pb-0' : ''
                }`}
              >
                <div
                  className={`bg-white rounded-lg px-4 py-3 shadow-sm ${
                    isFirst
                      ? 'border-l-3 border-[#25d366]'
                      : 'border-l-3 border-gray-200'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900">
                    {update.current_status}
                  </p>
                  {update.current_location && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {update.current_location}
                    </p>
                  )}
                  <p className="text-[0.65rem] text-gray-400 mt-1">
                    {formatDateTime(update.update_time)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
