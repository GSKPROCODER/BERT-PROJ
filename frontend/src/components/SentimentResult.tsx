import type { SentimentResponse } from '../types';

interface SentimentResultProps {
  result: SentimentResponse;
}

export default function SentimentResult({
  result,
}: SentimentResultProps): JSX.Element {
  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700';
      case 'negative':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700';
      case 'neutral':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600';
    }
  };

  const getSentimentIcon = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      case 'neutral':
        return '😐';
      default:
        return '😐';
    }
  };

  const confidence = Math.max(
    result.scores.positive,
    result.scores.neutral,
    result.scores.negative
  );

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 animate-fade-in">
      <div
        className={`border-2 rounded-xl p-6 shadow-lg ${getSentimentColor(result.sentiment)} transition-all duration-300`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold capitalize">
            {result.sentiment} {getSentimentIcon(result.sentiment)}
          </h2>
          <span className="text-lg font-semibold">
            {(confidence * 100).toFixed(1)}% confidence
          </span>
        </div>
        <div className="mt-4 space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wide">
            Scores:
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="capitalize font-medium">Positive:</span>
              <div className="flex items-center gap-2 flex-1 mx-4">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-green-600 dark:bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${result.scores.positive * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">
                  {(result.scores.positive * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="capitalize font-medium">Negative:</span>
              <div className="flex items-center gap-2 flex-1 mx-4">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-red-600 dark:bg-red-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${result.scores.negative * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">
                  {(result.scores.negative * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="capitalize font-medium">Neutral:</span>
              <div className="flex items-center gap-2 flex-1 mx-4">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gray-600 dark:bg-gray-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${result.scores.neutral * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">
                  {(result.scores.neutral * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
