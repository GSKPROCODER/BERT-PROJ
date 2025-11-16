import { useState } from 'react';
import type { AnalysisHistoryItem } from '../types';
import { getHistory, removeFromHistory, clearHistory } from '../utils/storage';

interface AnalysisHistoryProps {
  onSelect: (item: AnalysisHistoryItem) => void;
}

export default function AnalysisHistory({
  onSelect,
}: AnalysisHistoryProps): JSX.Element {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>(getHistory);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleRemove = (id: string): void => {
    removeFromHistory(id);
    setHistory(getHistory());
  };

  const handleClear = (): void => {
    clearHistory();
    setHistory([]);
  };

  if (history.length === 0) {
    return <></>;
  }

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          Analysis History ({history.length})
        </button>
        {isOpen && (
          <button
            onClick={handleClear}
            className="text-xs text-red-600 dark:text-red-400 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>
      {isOpen && (
        <div className="space-y-2 animate-slide-up">
          {history.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer group"
              onClick={() => onSelect(item)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {item.text}
                  </p>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        item.result.sentiment === 'positive'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : item.result.sentiment === 'negative'
                          ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {item.result.sentiment}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

