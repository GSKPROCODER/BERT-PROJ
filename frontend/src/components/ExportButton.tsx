import { getHistory } from '../utils/storage';
import type { SentimentResponse } from '../types';

interface ExportButtonProps {
  result?: SentimentResponse;
  text?: string;
}

export default function ExportButton({
  result,
  text,
}: ExportButtonProps): JSX.Element {
  const exportSingle = (): void => {
    if (!result || !text) return;

    const confidence = Math.max(
      result.scores.positive,
      result.scores.neutral,
      result.scores.negative
    );
    const data = {
      text,
      sentiment: result.sentiment,
      confidence,
      scores: result.scores,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentiment-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportHistory = (): void => {
    const history = getHistory();
    if (history.length === 0) return;

    const blob = new Blob([JSON.stringify(history, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentiment-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (result && text) {
    return (
      <button
        onClick={exportSingle}
        className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
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
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Export Result
      </button>
    );
  }

  return (
    <button
      onClick={exportHistory}
      className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
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
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Export History
    </button>
  );
}

