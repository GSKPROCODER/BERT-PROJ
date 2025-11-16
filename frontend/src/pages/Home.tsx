import { useState } from 'react';
import SentimentForm from '../components/SentimentForm';
import SentimentResult from '../components/SentimentResult';
import ErrorDisplay from '../components/ErrorDisplay';
import DarkModeToggle from '../components/DarkModeToggle';
import TextExamples from '../components/TextExamples';
import AnalysisHistory from '../components/AnalysisHistory';
import Statistics from '../components/Statistics';
import BatchAnalysis from '../components/BatchAnalysis';
import BatchResults from '../components/BatchResults';
import AspectAnalysis from '../components/AspectAnalysis';
import AspectResults from '../components/AspectResults';
import ExportButton from '../components/ExportButton';
import { useDarkMode } from '../hooks/useDarkMode';
import { saveToHistory } from '../utils/storage';
import type {
  SentimentResponse,
  BulkAnalysisResponse,
  AspectAnalysisResponse,
  AnalysisHistoryItem,
} from '../types';

export default function Home(): JSX.Element {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [result, setResult] = useState<SentimentResponse | null>(null);
  const [batchResults, setBatchResults] = useState<BulkAnalysisResponse | null>(null);
  const [aspectResults, setAspectResults] = useState<AspectAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentText, setCurrentText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'aspects'>('single');

  const handleResult = (newResult: SentimentResponse, text: string): void => {
    setResult(newResult);
    setBatchResults(null);
    setError(null);
    setCurrentText(text);

    const historyItem: AnalysisHistoryItem = {
      id: Date.now().toString(),
      text,
      result: newResult,
      timestamp: Date.now(),
    };
    saveToHistory(historyItem);
  };

  const handleBatchResults = (results: BulkAnalysisResponse): void => {
    setBatchResults(results);
    setResult(null);
    setAspectResults(null);
    setError(null);
  };

  const handleAspectResults = (results: AspectAnalysisResponse): void => {
    setAspectResults(results);
    setResult(null);
    setBatchResults(null);
    setError(null);
  };

  const handleError = (newError: string): void => {
    setError(newError);
    setResult(null);
    setBatchResults(null);
    setAspectResults(null);
  };

  const handleDismissError = (): void => {
    setError(null);
  };

  const handleExampleSelect = (text: string): void => {
    setCurrentText(text);
  };

  const handleHistorySelect = (item: AnalysisHistoryItem): void => {
    setResult(item.result);
    setCurrentText(item.text);
    setBatchResults(null);
    setAspectResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 transition-colors duration-300">
      <DarkModeToggle darkMode={darkMode} onToggle={toggleDarkMode} />

      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sentiment Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Advanced NLP sentiment analysis powered by BERT
          </p>
        </header>

        <Statistics />

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-gray-700 animate-slide-up">
          <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-6 py-2 font-medium transition-all ${
                activeTab === 'single'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Single Analysis
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`px-6 py-2 font-medium transition-all ${
                activeTab === 'batch'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Batch Analysis
            </button>
            <button
              onClick={() => setActiveTab('aspects')}
              className={`px-6 py-2 font-medium transition-all ${
                activeTab === 'aspects'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Aspect Analysis
            </button>
          </div>

          {activeTab === 'single' ? (
            <>
              <TextExamples onSelect={handleExampleSelect} />
              <SentimentForm
                onResult={(r) => {
                  const textarea = document.getElementById('text-input') as HTMLTextAreaElement;
                  const text = textarea?.value || currentText;
                  handleResult(r, text);
                }}
                onError={handleError}
                initialText={currentText}
              />
            </>
          ) : activeTab === 'batch' ? (
            <BatchAnalysis onResults={handleBatchResults} onError={handleError} />
          ) : (
            <AspectAnalysis onResult={handleAspectResults} onError={handleError} />
          )}
        </div>

        {error && <ErrorDisplay error={error} onDismiss={handleDismissError} />}

        {result && (
          <div className="mb-6">
            <div className="flex justify-end mb-2">
              <ExportButton result={result} text={currentText} />
            </div>
            <SentimentResult result={result} />
          </div>
        )}

        {batchResults && <BatchResults results={batchResults} />}

        {aspectResults && <AspectResults result={aspectResults} />}

        <AnalysisHistory onSelect={handleHistorySelect} />

        <div className="text-center mt-8">
          <ExportButton />
        </div>
      </div>
    </div>
  );
}
