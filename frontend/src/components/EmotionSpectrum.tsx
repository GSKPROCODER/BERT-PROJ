import type { EmotionResponse, SentimentResponse } from '../types';

interface EmotionSpectrumProps {
  emotion: EmotionResponse;
  sentiment: SentimentResponse;
  text: string;
}

export default function EmotionSpectrum({ emotion, sentiment, text }: EmotionSpectrumProps): JSX.Element {
  // Primary emotions
  const primaryEmotions = [
    { name: 'Joy', value: emotion.probabilities.joy, color: 'bg-yellow-400', icon: '😊' },
    { name: 'Anger', value: emotion.probabilities.anger, color: 'bg-red-500', icon: '😠' },
    { name: 'Sadness', value: emotion.probabilities.sadness, color: 'bg-blue-500', icon: '😢' },
    { name: 'Fear', value: emotion.probabilities.fear, color: 'bg-purple-500', icon: '😨' },
    { name: 'Surprise', value: emotion.probabilities.surprise, color: 'bg-orange-500', icon: '😲' },
    { name: 'Disgust', value: emotion.probabilities.disgust, color: 'bg-green-600', icon: '🤢' },
    { name: 'Neutral', value: emotion.probabilities.neutral, color: 'bg-gray-400', icon: '😐' },
  ].sort((a, b) => b.value - a.value);

  // Derive secondary emotions
  const secondaryEmotions = {
    confidence: Math.max(emotion.probabilities.joy, emotion.probabilities.neutral) * 0.8,
    frustration: emotion.probabilities.anger * 0.9 + emotion.probabilities.sadness * 0.3,
    admiration: emotion.probabilities.joy * 0.7 + emotion.probabilities.surprise * 0.4,
    anxiety: emotion.probabilities.fear * 0.9 + emotion.probabilities.sadness * 0.2,
    optimism: emotion.probabilities.joy * 0.8 + emotion.probabilities.surprise * 0.3,
    skepticism: emotion.probabilities.disgust * 0.7 + emotion.probabilities.fear * 0.3,
  };

  const secondaryEmotionsList = [
    { name: 'Confidence', value: secondaryEmotions.confidence, color: 'bg-green-400' },
    { name: 'Frustration', value: secondaryEmotions.frustration, color: 'bg-red-400' },
    { name: 'Admiration', value: secondaryEmotions.admiration, color: 'bg-pink-400' },
    { name: 'Anxiety', value: secondaryEmotions.anxiety, color: 'bg-purple-400' },
    { name: 'Optimism', value: secondaryEmotions.optimism, color: 'bg-yellow-300' },
    { name: 'Skepticism', value: secondaryEmotions.skepticism, color: 'bg-orange-400' },
  ].filter(e => e.value > 0.1).sort((a, b) => b.value - a.value);

  // Derive tone metrics
  const lowerText = text.toLowerCase();
  const exclamationCount = (text.match(/!/g) || []).length;
  const questionCount = (text.match(/\?/g) || []).length;
  const formalWords = ['please', 'thank you', 'sincerely', 'regards'].filter(w => lowerText.includes(w)).length;
  const sarcasticIndicators = ['sure', 'obviously', 'clearly', 'of course'].filter(w => lowerText.includes(w)).length;
  const subjectiveWords = (text.match(/\b(i|my|me|we|our|i'm|i've|i'll)\b/gi) || []).length;
  const totalWords = text.split(/\s+/).length;

  const toneMetrics = {
    assertive: Math.min(1, exclamationCount * 0.3 + (sentiment.scores.positive > 0.7 ? 0.4 : 0)),
    polite: Math.min(1, formalWords * 0.3 + (questionCount > 0 ? 0.2 : 0)),
    sarcastic: Math.min(1, sarcasticIndicators * 0.4 + (sentiment.sentiment === 'negative' && emotion.probabilities.joy > 0.3 ? 0.3 : 0)),
    formal: Math.min(1, formalWords * 0.4),
    subjective: Math.min(1, (subjectiveWords / Math.max(1, totalWords)) * 2),
  };

  const toneList = [
    { name: 'Assertive', value: toneMetrics.assertive, color: 'bg-red-300' },
    { name: 'Polite', value: toneMetrics.polite, color: 'bg-blue-300' },
    { name: 'Sarcastic', value: toneMetrics.sarcastic, color: 'bg-orange-300' },
    { name: 'Formal', value: toneMetrics.formal, color: 'bg-gray-300' },
    { name: 'Subjective', value: toneMetrics.subjective, color: 'bg-purple-300' },
  ].filter(t => t.value > 0.1).sort((a, b) => b.value - a.value);

  const dominantEmotion = primaryEmotions[0];
  const dominantSentiment = sentiment.sentiment;

  return (
    <div className="space-y-6">
      {/* Dominant Emotion & Sentiment */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg">
        <div className="text-4xl">{dominantEmotion.icon}</div>
        <div className="flex-1">
          <div className="text-sm text-gray-300">Dominant Emotion</div>
          <div className="text-xl font-bold text-white capitalize">
            {dominantEmotion.name} ({(dominantEmotion.value * 100).toFixed(1)}%)
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-300">Sentiment</div>
          <div className={`text-xl font-bold capitalize ${
            dominantSentiment === 'positive' ? 'text-green-400' :
            dominantSentiment === 'negative' ? 'text-red-400' :
            'text-gray-400'
          }`}>
            {dominantSentiment}
          </div>
        </div>
      </div>

      {/* Primary Emotions */}
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Primary Emotions</h4>
        <div className="space-y-2">
          {primaryEmotions.map((em) => (
            <div key={em.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-200">
                  <span>{em.icon}</span>
                  <span>{em.name}</span>
                </span>
                <span className="text-gray-300 font-medium">
                  {(em.value * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`${em.color} h-2.5 rounded-full transition-all duration-500`}
                  style={{ width: `${em.value * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Emotions */}
      {secondaryEmotionsList.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Secondary Emotions</h4>
          <div className="space-y-2">
            {secondaryEmotionsList.map((em) => (
              <div key={em.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-200">{em.name}</span>
                  <span className="text-gray-300 font-medium">
                    {(em.value * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${em.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${em.value * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tone Metrics */}
      {toneList.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Tone Metrics</h4>
          <div className="grid grid-cols-2 gap-2">
            {toneList.map((tone) => (
              <div key={tone.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">{tone.name}</span>
                  <span className="text-gray-400 font-medium">
                    {(tone.value * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`${tone.color} h-1.5 rounded-full transition-all duration-500`}
                    style={{ width: `${tone.value * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

