import type { AspectAnalysisResponse } from '../types';

interface AspectResultsProps {
  result: AspectAnalysisResponse;
}

export default function AspectResults({
  result,
}: AspectResultsProps): JSX.Element {
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

  const getTypeBadgeColor = (type: string): string => {
    switch (type) {
      case 'entity':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case 'noun_phrase':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200';
      case 'noun':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  if (result.total_aspects === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-6 animate-fade-in">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-6">
          <p className="text-yellow-800 dark:text-yellow-200 text-center">
            No aspects found in the text. Try using more descriptive text with specific entities or features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 space-y-6 animate-fade-in">
      {/* Overall Sentiment */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
          📊 Overall Sentiment
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold capitalize">
              {result.overall_sentiment.sentiment}{' '}
              {getSentimentIcon(result.overall_sentiment.sentiment)}
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {(result.overall_sentiment.confidence * 100).toFixed(1)}% confidence
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {result.total_aspects} aspect{result.total_aspects !== 1 ? 's' : ''} analyzed
            </p>
          </div>
        </div>
      </div>

      {/* Aspects List */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          🔍 Detected Aspects
        </h3>
        <div className="space-y-4">
          {result.aspects.map((aspect, index) => (
            <div
              key={index}
              className={`border-2 rounded-xl p-5 shadow-md transition-all duration-300 hover:shadow-lg ${getSentimentColor(aspect.sentiment)}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-bold">{aspect.aspect}</h4>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${getTypeBadgeColor(aspect.type)}`}
                    >
                      {aspect.type.replace('_', ' ')}
                    </span>
                    {aspect.label !== 'NOUN_PHRASE' && aspect.label !== 'NOUN' && (
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        ({aspect.label})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold capitalize">
                      {aspect.sentiment} {getSentimentIcon(aspect.sentiment)}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {(aspect.confidence * 100).toFixed(1)}% confidence
                    </span>
                  </div>
                </div>
              </div>

              {/* Probabilities */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium w-20">Positive:</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${aspect.probabilities.positive * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-12 text-right">
                    {(aspect.probabilities.positive * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium w-20">Negative:</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-red-600 dark:bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${aspect.probabilities.negative * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-12 text-right">
                    {(aspect.probabilities.negative * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium w-20">Neutral:</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gray-600 dark:bg-gray-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${aspect.probabilities.neutral * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-12 text-right">
                    {(aspect.probabilities.neutral * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Context */}
              <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Context:</p>
                <p className="text-sm italic text-gray-700 dark:text-gray-300">
                  "{aspect.context}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

