'use client';

export default function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  return (
    <div className="bg-red-100 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3 mx-4 my-2">
      <svg
        className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-sm text-red-700 flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 text-sm leading-none shrink-0"
        >
          ✕
        </button>
      )}
    </div>
  );
}
