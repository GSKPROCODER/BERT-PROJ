import { useState } from 'react';
import DarkModeToggle from '../components/DarkModeToggle';
import AnalyzeSection from '../components/AnalyzeSection';
import InsightsSection from '../components/InsightsSection';
import About from './About';
import ErrorDisplay from '../components/ErrorDisplay';
import Footer from '../components/Footer';
import { useDarkMode } from '../hooks/useDarkMode';
import { saveToHistory } from '../utils/storage';
import type { ComprehensiveAnalysis } from '../types';
import type { AnalysisHistoryItem } from '../types';

export default function Home(): JSX.Element {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [activeSection, setActiveSection] = useState<'analyze' | 'insights' | 'about'>('analyze');
  const [currentAnalysis, setCurrentAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisComplete = (analysis: ComprehensiveAnalysis): void => {
    setCurrentAnalysis(analysis);
    setError(null);

    // Save to history
    const historyItem: AnalysisHistoryItem = {
      id: Date.now().toString(),
      text: analysis.text,
      result: analysis.sentiment,
      timestamp: Date.now(),
    };
    saveToHistory(historyItem);
  };

  const handleError = (errorMessage: string): void => {
    setError(errorMessage);
  };

  const handleDismissError = (): void => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 transition-colors duration-300">
      <DarkModeToggle darkMode={darkMode} onToggle={toggleDarkMode} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Sentiment Analysis
          </h1>
          <p className="text-gray-400 text-lg">
            Advanced NLP analysis powered by RoBERTa transformers
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-3 text-sm">
            <a
              href="https://huggingface.co/cardiffnlp/twitter-roberta-base-sentiment-latest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 hover:text-blue-400 transition-colors border border-gray-700"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Sentiment Model
            </a>
            <a
              href="https://huggingface.co/j-hartmann/emotion-english-distilroberta-base"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 hover:text-purple-400 transition-colors border border-gray-700"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Emotion Model
            </a>
          </div>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveSection('analyze')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeSection === 'analyze'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
          >
            Analyze
          </button>
          <button
            onClick={() => setActiveSection('insights')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeSection === 'insights'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveSection('about')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeSection === 'about'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
          >
            About
          </button>
        </nav>

        {/* Error Display */}
        {error && <ErrorDisplay error={error} onDismiss={handleDismissError} />}

        {/* Content Sections */}
        <main>
          {activeSection === 'analyze' && (
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 animate-fade-in">
              <AnalyzeSection
                onAnalysisComplete={handleAnalysisComplete}
                onError={handleError}
              />
            </div>
          )}

          {activeSection === 'insights' && (
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 animate-fade-in">
              <InsightsSection currentAnalysis={currentAnalysis} />
            </div>
          )}

          {activeSection === 'about' && (
            <div className="animate-fade-in">
              <About />
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
