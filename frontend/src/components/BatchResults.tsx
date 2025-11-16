import type { BulkAnalysisResponse } from '../types';

interface BatchResultsProps {
  results: BulkAnalysisResponse;
}

export default function BatchResults({
  results,
}: BatchResultsProps): JSX.Element {
  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      case 'negative':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
      case 'neutral':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  const getEmotionIcon = (emotion: string): string => {
    const icons: Record<string, string> = {
      joy: '😊',
      anger: '😠',
      fear: '😨',
      sadness: '😢',
      surprise: '😲',
      disgust: '🤢',
      neutral: '😐',
    };
    return icons[emotion] || '😐';
  };

  const summary = {
    positive: results.results.filter((r) => r.sentiment === 'positive').length,
    negative: results.results.filter((r) => r.sentiment === 'negative').length,
    neutral: results.results.filter((r) => r.sentiment === 'neutral').length,
  };

  return (
    <div className="mb-6 animate-fade-in">
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800 mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
          📊 Batch Analysis Summary
        </h3>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {results.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {results.successful}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Successful</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {results.failed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {summary.positive + summary.negative + summary.neutral}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Analyzed</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {summary.positive}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Positive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {summary.negative}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Negative</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {summary.neutral}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Neutral</div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {results.results.map((result, index) => {
          const confidence = Math.max(
            result.scores.positive,
            result.scores.neutral,
            result.scores.negative
          );
          return (
            <div
              key={index}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Result #{index + 1}
                </span>
                <div className="flex gap-2">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${getSentimentColor(result.sentiment)}`}
                  >
                    {result.sentiment}
                  </span>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200">
                    {result.emotion} {getEmotionIcon(result.emotion)}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 truncate">
                {result.text}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Confidence: {(confidence * 100).toFixed(1)}%
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-green-600 dark:text-green-400">
                  P: {(result.scores.positive * 100).toFixed(1)}%
                </span>
                <span className="text-red-600 dark:text-red-400">
                  N: {(result.scores.negative * 100).toFixed(1)}%
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  U: {(result.scores.neutral * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
