import { useState, FormEvent } from 'react';
import { analyzeAspects } from '../services/api';
import type { AspectAnalysisResponse } from '../types';

interface AspectAnalysisProps {
  onResult: (result: AspectAnalysisResponse) => void;
  onError: (error: string) => void;
}

export default function AspectAnalysis({
  onResult,
  onError,
}: AspectAnalysisProps): JSX.Element {
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!text.trim()) {
      onError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeAspects(text);
      onResult(result);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="mb-4">
        <label
          htmlFor="aspect-text-input"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Enter text for aspect-based analysis:
        </label>
        <textarea
          id="aspect-text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Example: The camera quality is excellent, but the battery life is disappointing..."
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          rows={6}
          disabled={loading}
        />
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {text.length} characters
        </div>
      </div>
      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="w-full bg-purple-600 dark:bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:shadow-none transform hover:scale-[1.02] disabled:transform-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Analyzing Aspects...
          </span>
        ) : (
          'Analyze Aspects'
        )}
      </button>
    </form>
  );
}

