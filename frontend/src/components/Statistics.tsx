import { useMemo } from 'react';
import { getHistory } from '../utils/storage';

export default function Statistics(): JSX.Element {
  const stats = useMemo(() => {
    const history = getHistory();
    const total = history.length;
    const sentimentCounts = history.reduce(
      (acc, item) => {
        acc[item.result.sentiment] = (acc[item.result.sentiment] || 0) + 1;
        return acc;
      },
      { positive: 0, negative: 0, neutral: 0 } as Record<string, number>
    );

    const avgConfidence =
      history.length > 0
        ? history.reduce((sum, item) => {
            const confidence = Math.max(
              item.result.scores.positive,
              item.result.scores.neutral,
              item.result.scores.negative
            );
            return sum + confidence;
          }, 0) / history.length
        : 0;

    return {
      total,
      sentimentCounts,
      avgConfidence,
      percentages: {
        positive: total > 0 ? (sentimentCounts.positive / total) * 100 : 0,
        negative: total > 0 ? (sentimentCounts.negative / total) * 100 : 0,
        neutral: total > 0 ? (sentimentCounts.neutral / total) * 100 : 0,
      },
    };
  }, []);

  if (stats.total === 0) {
    return <></>;
  }

  return (
    <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800 animate-fade-in">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
        📊 Statistics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.total}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Total Analyses
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.sentimentCounts.positive}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Positive</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.sentimentCounts.negative}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Negative</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {stats.sentimentCounts.neutral}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Neutral</div>
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-700 dark:text-gray-300">Positive</span>
            <span className="text-gray-600 dark:text-gray-400">
              {stats.percentages.positive.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.percentages.positive}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-700 dark:text-gray-300">Negative</span>
            <span className="text-gray-600 dark:text-gray-400">
              {stats.percentages.negative.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.percentages.negative}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-700 dark:text-gray-300">Neutral</span>
            <span className="text-gray-600 dark:text-gray-400">
              {stats.percentages.neutral.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gray-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.percentages.neutral}%` }}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Average Confidence
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {(stats.avgConfidence * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}

