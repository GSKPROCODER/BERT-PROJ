import { useState, useEffect } from 'react';
import { getHistory } from '../utils/storage';
import type { ComprehensiveAnalysis } from '../types';

interface InsightsSectionProps {
  currentAnalysis: ComprehensiveAnalysis | null;
}

export default function InsightsSection({ currentAnalysis }: InsightsSectionProps): JSX.Element {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const loadHistory = (): void => {
      const stored = getHistory();
      setHistory(stored);
    };
    loadHistory();
    // Refresh every 5 seconds if needed
    const interval = setInterval(loadHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate insights from history
  const insights = {
    totalAnalyses: history.length,
    sentimentDistribution: {
      positive: history.filter(h => h.result?.sentiment === 'positive').length,
      negative: history.filter(h => h.result?.sentiment === 'negative').length,
      neutral: history.filter(h => h.result?.sentiment === 'neutral').length,
    },
    avgConfidence: history.length > 0
      ? history.reduce((sum, h) => {
          const conf = Math.max(
            h.result?.scores?.positive || 0,
            h.result?.scores?.neutral || 0,
            h.result?.scores?.negative || 0
          );
          return sum + conf;
        }, 0) / history.length
      : 0,
    recentAnalyses: history.slice(-5).reverse(),
  };

  if (history.length === 0 && !currentAnalysis) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg mb-2">No analysis history yet</p>
        <p className="text-sm">Analyze some text to see insights here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-xl p-6 border border-gray-600 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-1">
            {insights.totalAnalyses + (currentAnalysis ? 1 : 0)}
          </div>
          <div className="text-sm text-gray-300">Total Analyses</div>
        </div>
        <div className="bg-gray-700 rounded-xl p-6 border border-gray-600 text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">
            {insights.sentimentDistribution.positive + (currentAnalysis?.sentiment.sentiment === 'positive' ? 1 : 0)}
          </div>
          <div className="text-sm text-gray-300">Positive</div>
        </div>
        <div className="bg-gray-700 rounded-xl p-6 border border-gray-600 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-1">
            {(insights.avgConfidence * 100).toFixed(0)}%
          </div>
          <div className="text-sm text-gray-300">Avg Confidence</div>
        </div>
      </div>

      {/* Sentiment Distribution Chart */}
      <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">Sentiment Distribution</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Positive</span>
              <span className="text-gray-400">
                {insights.sentimentDistribution.positive + (currentAnalysis?.sentiment.sentiment === 'positive' ? 1 : 0)}
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${((insights.sentimentDistribution.positive + (currentAnalysis?.sentiment.sentiment === 'positive' ? 1 : 0)) / Math.max(1, insights.totalAnalyses + (currentAnalysis ? 1 : 0))) * 100}%`,
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Negative</span>
              <span className="text-gray-400">
                {insights.sentimentDistribution.negative + (currentAnalysis?.sentiment.sentiment === 'negative' ? 1 : 0)}
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-3">
              <div
                className="bg-red-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${((insights.sentimentDistribution.negative + (currentAnalysis?.sentiment.sentiment === 'negative' ? 1 : 0)) / Math.max(1, insights.totalAnalyses + (currentAnalysis ? 1 : 0))) * 100}%`,
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Neutral</span>
              <span className="text-gray-400">
                {insights.sentimentDistribution.neutral + (currentAnalysis?.sentiment.sentiment === 'neutral' ? 1 : 0)}
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-3">
              <div
                className="bg-gray-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${((insights.sentimentDistribution.neutral + (currentAnalysis?.sentiment.sentiment === 'neutral' ? 1 : 0)) / Math.max(1, insights.totalAnalyses + (currentAnalysis ? 1 : 0))) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Analyses */}
      {insights.recentAnalyses.length > 0 && (
        <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Analyses</h3>
          <div className="space-y-2">
            {insights.recentAnalyses.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-gray-600/50 rounded-lg border border-gray-500"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white capitalize">
                    {item.result?.sentiment}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-300 line-clamp-2">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

