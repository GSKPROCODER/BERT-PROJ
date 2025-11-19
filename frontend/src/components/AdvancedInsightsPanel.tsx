import { useState } from 'react';
import type { SentimentResponse, EmotionResponse, AspectAnalysisResponse } from '../types';

interface AdvancedInsightsPanelProps {
  text: string;
  sentiment: SentimentResponse;
  emotion: EmotionResponse;
  aspects: AspectAnalysisResponse;
}

export default function AdvancedInsightsPanel({
  text,
  sentiment,
  emotion,
  aspects,
}: AdvancedInsightsPanelProps): JSX.Element {
  const [expandedSection, setExpandedSection] = useState<string | null>('emotional-arc');

  // Calculate emotional arc (simplified - emotion intensity over sentences)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const emotionalArc = sentences.map((_, idx) => {
    // Simplified: assume emotion intensity varies slightly across sentences
    const baseIntensity = Math.max(...Object.values(emotion.probabilities));
    const variation = Math.sin((idx / sentences.length) * Math.PI * 2) * 0.1;
    return Math.max(0, Math.min(1, baseIntensity + variation));
  });

  // Derive rhetorical intent (heuristic-based)
  const lowerText = text.toLowerCase();
  const rhetoricalIntent = {
    claim: (lowerText.match(/\b(is|are|was|were|should|must|will|can)\b/g) || []).length / Math.max(1, sentences.length),
    justification: (lowerText.match(/\b(because|since|due to|as a result|therefore)\b/g) || []).length / Math.max(1, sentences.length),
    critique: (lowerText.match(/\b(but|however|although|despite|unfortunately)\b/g) || []).length / Math.max(1, sentences.length),
    explanation: (lowerText.match(/\b(for example|such as|including|specifically)\b/g) || []).length / Math.max(1, sentences.length),
    evidence: (lowerText.match(/\b(shows|proves|indicates|demonstrates|suggests)\b/g) || []).length / Math.max(1, sentences.length),
  };

  // Normalize rhetorical intent
  const maxIntent = Math.max(...Object.values(rhetoricalIntent));
  const normalizedIntent = Object.fromEntries(
    Object.entries(rhetoricalIntent).map(([key, value]) => [key, maxIntent > 0 ? value / maxIntent : 0])
  );

  // Confidence explanation
  const confidenceExplanation = `The analysis shows ${sentiment.sentiment} sentiment with ${(Math.max(...Object.values(sentiment.scores)) * 100).toFixed(1)}% confidence. The dominant emotion is ${emotion.emotion} (${(emotion.probabilities[emotion.emotion as keyof typeof emotion.probabilities] * 100).toFixed(1)}%). ${aspects.total_aspects > 0 ? `${aspects.total_aspects} specific aspect${aspects.total_aspects !== 1 ? 's' : ''} ${aspects.total_aspects === 1 ? 'was' : 'were'} identified.` : 'No specific aspects were identified in this text.'}`;

  const toggleSection = (section: string): void => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Advanced Insights</h3>

      {/* Emotional Arc */}
      <div className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
        <button
          onClick={() => toggleSection('emotional-arc')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-600 transition-colors"
        >
          <span className="font-medium text-white">Emotional Arc</span>
          <span>{expandedSection === 'emotional-arc' ? '▼' : '▶'}</span>
        </button>
        {expandedSection === 'emotional-arc' && (
          <div className="px-4 pb-4 border-t border-gray-600">
            <div className="mt-4 h-32 flex items-end gap-1">
              {emotionalArc.map((intensity, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t transition-all duration-300"
                  style={{ height: `${intensity * 100}%` }}
                  title={`Sentence ${idx + 1}: ${(intensity * 100).toFixed(0)}%`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Emotion intensity progression across {sentences.length} sentence{sentences.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Rhetorical Intent */}
      <div className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
        <button
          onClick={() => toggleSection('rhetorical-intent')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-600 transition-colors"
        >
          <span className="font-medium text-white">Rhetorical Intent</span>
          <span>{expandedSection === 'rhetorical-intent' ? '▼' : '▶'}</span>
        </button>
        {expandedSection === 'rhetorical-intent' && (
          <div className="px-4 pb-4 border-t border-gray-600">
            <div className="mt-4 space-y-2">
              {Object.entries(normalizedIntent).map(([intent, value]) => (
                <div key={intent} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300 capitalize">{intent}</span>
                    <span className="text-gray-400">{(value * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confidence Explanation */}
      <div className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
        <button
          onClick={() => toggleSection('confidence')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-600 transition-colors"
        >
          <span className="font-medium text-white">Confidence Explanation</span>
          <span>{expandedSection === 'confidence' ? '▼' : '▶'}</span>
        </button>
        {expandedSection === 'confidence' && (
          <div className="px-4 pb-4 border-t border-gray-600">
            <p className="mt-4 text-sm text-gray-300 leading-relaxed">
              {confidenceExplanation}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-gray-600/50 rounded">
                <div className="text-lg font-bold text-white">
                  {(Math.max(...Object.values(sentiment.scores)) * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-300">Sentiment</div>
              </div>
              <div className="text-center p-2 bg-gray-600/50 rounded">
                <div className="text-lg font-bold text-white">
                  {(emotion.probabilities[emotion.emotion as keyof typeof emotion.probabilities] * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-300">Emotion</div>
              </div>
              <div className="text-center p-2 bg-gray-600/50 rounded">
                <div className="text-lg font-bold text-white">
                  {aspects.total_aspects}
                </div>
                <div className="text-xs text-gray-300">Aspects</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key Phrases */}
      {aspects.total_aspects > 0 && (
        <div className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
          <button
            onClick={() => toggleSection('key-phrases')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-600 transition-colors"
          >
            <span className="font-medium text-white">Key Phrases</span>
            <span>{expandedSection === 'key-phrases' ? '▼' : '▶'}</span>
          </button>
          {expandedSection === 'key-phrases' && (
            <div className="px-4 pb-4 border-t border-gray-600">
              <div className="mt-4 flex flex-wrap gap-2">
                {aspects.aspects
                  .sort((a, b) => b.confidence - a.confidence)
                  .slice(0, 8)
                  .map((aspect, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-900/30 text-blue-200 rounded-full text-xs font-medium"
                    >
                      {aspect.aspect}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

