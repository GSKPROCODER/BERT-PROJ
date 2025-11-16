import { useState, FormEvent } from 'react';
import { analyzeBulk } from '../services/api';
import type { BulkAnalysisResponse } from '../types';

interface BatchAnalysisProps {
  onResults: (results: BulkAnalysisResponse) => void;
  onError: (error: string) => void;
}

export default function BatchAnalysis({
  onResults,
  onError,
}: BatchAnalysisProps): JSX.Element {
  const [texts, setTexts] = useState<string[]>(['']);
  const [loading, setLoading] = useState<boolean>(false);

  const addTextInput = (): void => {
    setTexts([...texts, '']);
  };

  const removeTextInput = (index: number): void => {
    setTexts(texts.filter((_, i) => i !== index));
  };

  const updateText = (index: number, value: string): void => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const validTexts = texts.filter((t) => t.trim());
    if (validTexts.length === 0) {
      onError('Please enter at least one text to analyze');
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeBulk(validTexts);
      onResults(result);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 animate-fade-in">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Batch Analysis (Multiple Texts):
          </label>
          <button
            type="button"
            onClick={addTextInput}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Add Text
          </button>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {texts.map((text, index) => (
            <div key={index} className="flex gap-2">
              <textarea
                value={text}
                onChange={(e) => updateText(index, e.target.value)}
                placeholder={`Text ${index + 1}...`}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                rows={2}
                disabled={loading}
              />
              {texts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTextInput(index)}
                  className="px-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  disabled={loading}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <button
        type="submit"
        disabled={loading || texts.filter((t) => t.trim()).length === 0}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? 'Analyzing...' : `Analyze ${texts.filter((t) => t.trim()).length} Text(s)`}
      </button>
    </form>
  );
}
