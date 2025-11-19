import type { AspectAnalysisResponse } from '../types';

interface AspectSummaryProps {
  aspects: AspectAnalysisResponse;
}

export default function AspectSummary({ aspects }: AspectSummaryProps): JSX.Element {
  if (aspects.total_aspects === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-sm">No specific aspects detected in this text.</p>
        <p className="text-xs mt-2">Aspect analysis works best with product reviews, feedback, or opinionated text.</p>
      </div>
    );
  }

  // Group aspects by type or sentiment
  const groupedAspects = aspects.aspects.reduce((acc, aspect) => {
    const key = aspect.type || aspect.sentiment;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(aspect);
    return acc;
  }, {} as Record<string, typeof aspects.aspects>);

  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-900/30 text-green-200 border-green-700';
      case 'negative':
        return 'bg-red-900/30 text-red-200 border-red-700';
      case 'neutral':
        return 'bg-gray-800 text-gray-200 border-gray-600';
      default:
        return 'bg-gray-800 text-gray-200 border-gray-600';
    }
  };

  const getSentimentIcon = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive':
        return '✓';
      case 'negative':
        return '✗';
      case 'neutral':
        return '○';
      default:
        return '○';
    }
  };

  // Extract key phrases (aspects with highest confidence)
  const keyPhrases = aspects.aspects
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)
    .map(a => a.aspect);

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-700/50 rounded-lg">
          <div className="text-2xl font-bold text-white">{aspects.total_aspects}</div>
          <div className="text-xs text-gray-300">Aspects Found</div>
        </div>
        <div className="text-center p-3 bg-gray-700/50 rounded-lg">
          <div className="text-2xl font-bold text-green-400">
            {aspects.aspects.filter(a => a.sentiment === 'positive').length}
          </div>
          <div className="text-xs text-gray-300">Positive</div>
        </div>
        <div className="text-center p-3 bg-gray-700/50 rounded-lg">
          <div className="text-2xl font-bold text-red-400">
            {aspects.aspects.filter(a => a.sentiment === 'negative').length}
          </div>
          <div className="text-xs text-gray-300">Negative</div>
        </div>
      </div>

      {/* Key Phrases */}
      {keyPhrases.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-gray-300 mb-2">Key Phrases</h5>
          <div className="flex flex-wrap gap-2">
            {keyPhrases.map((phrase, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-900/30 text-blue-200 rounded-full text-xs font-medium"
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Grouped Aspects */}
      <div className="space-y-3">
        {Object.entries(groupedAspects).map(([group, groupAspects]) => (
          <div key={group} className="border border-gray-600 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-gray-300 mb-3 capitalize">
              {group} ({groupAspects.length})
            </h5>
            <div className="space-y-2">
              {groupAspects.map((aspect, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${getSentimentColor(aspect.sentiment)}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getSentimentIcon(aspect.sentiment)}</span>
                      <span className="font-semibold text-sm">{aspect.aspect}</span>
                    </div>
                    <span className="text-xs font-medium">
                      {(aspect.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  {aspect.context && (
                    <div className="text-xs text-gray-300 mt-1 italic">
                      "{aspect.context}"
                    </div>
                  )}
                  <div className="flex gap-2 mt-2 text-xs">
                    <span className="text-gray-400">
                      P: {(aspect.probabilities.positive * 100).toFixed(0)}%
                    </span>
                    <span className="text-gray-400">
                      N: {(aspect.probabilities.negative * 100).toFixed(0)}%
                    </span>
                    <span className="text-gray-400">
                      U: {(aspect.probabilities.neutral * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Overall Sentiment */}
      <div className="pt-4 border-t border-gray-600">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">Overall Sentiment</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSentimentColor(aspects.overall_sentiment.sentiment)}`}>
            {aspects.overall_sentiment.sentiment} ({(aspects.overall_sentiment.confidence * 100).toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
}

