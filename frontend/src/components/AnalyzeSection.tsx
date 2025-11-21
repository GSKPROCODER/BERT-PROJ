import { useState, FormEvent } from 'react';
import { analyzeSentiment, analyzeEmotion, analyzeAspects, fetchUrlContent } from '../services/api';
import type { ComprehensiveAnalysis } from '../types';
import EmotionSpectrum from './EmotionSpectrum';
import AspectSummary from './AspectSummary';
import AdvancedInsightsPanel from './AdvancedInsightsPanel';
import RiskAlert from './RiskAlert';
import SDGExamplesToggle from './SDGExamplesToggle';

interface AnalyzeSectionProps {
  onAnalysisComplete: (analysis: ComprehensiveAnalysis) => void;
  onError?: (error: string) => void;
}

export default function AnalyzeSection({ onAnalysisComplete, onError }: AnalyzeSectionProps): JSX.Element {
  const [inputText, setInputText] = useState<string>('');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text');
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [analysis, setAnalysis] = useState<ComprehensiveAnalysis | null>(null);

  const parseInput = (text: string): string[] => {
    if (!text.trim()) return [];
    const separators = /[;\n,]/;
    const texts = text
      .split(separators)
      .map(t => t.trim())
      .filter(t => t.length > 0);
    return texts.length > 0 ? texts : [text.trim()];
  };

  const fetchTextFromUrl = async (url: string): Promise<string> => {
    try {
      const result = await fetchUrlContent(url);
      return result.text;
    } catch (error) {
      throw new Error('Failed to fetch content from URL. Make sure the URL is publicly accessible.');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    let textToAnalyze = inputText;

    // If URL mode, fetch content first
    if (inputMode === 'url') {
      if (!inputUrl.trim()) {
        if (onError) onError('Please enter a URL to analyze');
        return;
      }

      try {
        setLoading(true);
        textToAnalyze = await fetchTextFromUrl(inputUrl);

        if (!textToAnalyze || textToAnalyze.length < 10) {
          if (onError) onError('Could not extract meaningful text from URL');
          setLoading(false);
          return;
        }

        // Limit text length to avoid overwhelming the API
        if (textToAnalyze.length > 5000) {
          textToAnalyze = textToAnalyze.substring(0, 5000) + '...';
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch URL content';
        if (onError) onError(errorMessage);
        setLoading(false);
        return;
      }
    }

    const texts = parseInput(textToAnalyze);

    if (texts.length === 0) {
      if (onError) onError('Please enter some text to analyze');
      return;
    }

    if (texts.length > 50) {
      if (onError) onError('Maximum 50 texts allowed per analysis');
      return;
    }

    setLoading(true);
    setProgress({ current: 0, total: texts.length });
    setAnalysis(null);

    try {
      // For single text, analyze everything
      if (texts.length === 1) {
        const [sentiment, emotion, aspects] = await Promise.all([
          analyzeSentiment(texts[0]),
          analyzeEmotion(texts[0]),
          analyzeAspects(texts[0]),
        ]);

        const comprehensive: ComprehensiveAnalysis = {
          text: texts[0],
          sentiment,
          emotion,
          aspects,
          timestamp: Date.now(),
        };

        setAnalysis(comprehensive);
        onAnalysisComplete(comprehensive);
      } else {
        // For batch, analyze first text comprehensively, others with sentiment+emotion
        const [firstSentiment, firstEmotion, firstAspects] = await Promise.all([
          analyzeSentiment(texts[0]),
          analyzeEmotion(texts[0]),
          analyzeAspects(texts[0]),
        ]);

        const comprehensive: ComprehensiveAnalysis = {
          text: texts[0],
          texts,
          sentiment: firstSentiment,
          emotion: firstEmotion,
          aspects: firstAspects,
          timestamp: Date.now(),
        };

        setAnalysis(comprehensive);
        onAnalysisComplete(comprehensive);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      if (onError) {
        onError(errorMessage);
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  const textCount = parseInput(inputText).length;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <SDGExamplesToggle onSelectExample={(text): void => setInputText(text)} />

        {/* Input Mode Toggle */}
        <div className="flex gap-2 bg-gray-700 p-1 rounded-lg w-fit">
          <button
            type="button"
            onClick={() => setInputMode('text')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${inputMode === 'text'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white'
              }`}
          >
            📝 Text Input
          </button>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${inputMode === 'url'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white'
              }`}
          >
            🔗 URL Input
          </button>
        </div>

        {/* Text Input Mode */}
        {inputMode === 'text' && (
          <div>
            <label htmlFor="analysis-input" className="block text-sm font-medium text-gray-300 mb-2">
              Enter text to analyze (supports single text or multiple separated by semicolons, commas, or newlines):
            </label>
            <textarea
              id="analysis-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here... For multiple texts, separate with semicolons (;), commas (,), or new lines."
              className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-700 text-gray-100 placeholder-gray-400 transition-all"
              rows={6}
              disabled={loading}
            />
            <div className="mt-2 text-xs text-gray-400">
              {textCount} {textCount === 1 ? 'text' : 'texts'} detected
            </div>
          </div>
        )}

        {/* URL Input Mode */}
        {inputMode === 'url' && (
          <div>
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-300 mb-2">
              Enter URL to analyze (article, blog post, social media, etc.):
            </label>
            <input
              id="url-input"
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-100 placeholder-gray-400 transition-all"
              disabled={loading}
            />
            <div className="mt-2 text-xs text-gray-400">
              ⚠️ Note: URL must be publicly accessible. CORS restrictions may apply for some websites.
            </div>
          </div>
        )}

        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Processing...</span>
              <span>{progress.current} / {progress.total}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (inputMode === 'text' ? !inputText.trim() : !inputUrl.trim())}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          {loading ? (inputMode === 'url' ? 'Fetching & Analyzing...' : 'Analyzing...') : `Analyze ${inputMode === 'url' ? 'URL' : 'Text'}`}
        </button>
      </form>

      {analysis && (
        <div className="mt-8 space-y-6">
          {/* Risk Alert - Full Width */}
          {analysis.sentiment?.risk_analysis?.has_risk && (
            <RiskAlert riskAnalysis={analysis.sentiment.risk_analysis} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Main Analysis */}
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Emotion Spectrum
                </h3>
                <EmotionSpectrum
                  emotion={analysis.emotion}
                  sentiment={analysis.sentiment}
                  text={analysis.text}
                />
              </div>

              <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Aspect Analysis
                </h3>
                <AspectSummary aspects={analysis.aspects} />
              </div>
            </div>

            {/* Right Column: Insights */}
            <div className="space-y-6">
              <AdvancedInsightsPanel
                text={analysis.text}
                sentiment={analysis.sentiment}
                emotion={analysis.emotion}
                aspects={analysis.aspects}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

