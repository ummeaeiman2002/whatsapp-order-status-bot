'use client';

export function ChatSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#e5ddd5] bg-opacity-90">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] px-3 py-2 rounded-lg ${
              i % 2 === 0
                ? 'bg-[#d9fdd3] rounded-br-sm'
                : 'bg-white rounded-bl-sm'
            }`}
          >
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-48" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
            </div>
            <div className="h-2 bg-gray-200 rounded animate-pulse w-12 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse mt-1 shrink-0" />
          <div className="flex-1 bg-white rounded-lg p-4 shadow-sm space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm space-y-3">
      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
      <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
    </div>
  );
}
