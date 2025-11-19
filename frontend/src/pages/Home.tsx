import { useState } from 'react';
import DarkModeToggle from '../components/DarkModeToggle';
import AnalyzeSection from '../components/AnalyzeSection';
import InsightsSection from '../components/InsightsSection';
import About from './About';
import ErrorDisplay from '../components/ErrorDisplay';
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
            Advanced NLP analysis powered by BERT & RoBERTa
          </p>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveSection('analyze')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeSection === 'analyze'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Analyze
          </button>
          <button
            onClick={() => setActiveSection('insights')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeSection === 'insights'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveSection('about')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeSection === 'about'
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
      </div>
    </div>
  );
}
