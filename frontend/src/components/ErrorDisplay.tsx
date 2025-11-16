interface ErrorDisplayProps {
  error: string;
  onDismiss: () => void;
}

export default function ErrorDisplay({
  error,
  onDismiss,
}: ErrorDisplayProps): JSX.Element {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6 animate-fade-in">
      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-red-600 dark:text-red-400 text-xl">⚠️</span>
            <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
          </div>
          <button
            onClick={onDismiss}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-bold text-xl transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

