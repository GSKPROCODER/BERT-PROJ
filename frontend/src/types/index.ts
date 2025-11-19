// Core request/response types
export interface AnalysisRequest {
  text: string;
}

export interface SentimentRequest {
  text: string;
}

export interface EmotionRequest {
  text: string;
}

export interface BulkAnalysisRequest {
  texts: string[];
}

export interface BulkAnalysisItem {
  text: string;
  sentiment: string;
  scores: {
    positive: number;
    neutral: number;
    negative: number;
  };
  emotion: string;
  probabilities: {
    anger: number;
    disgust: number;
    fear: number;
    joy: number;
    neutral: number;
    sadness: number;
    surprise: number;
  };
}

export interface BulkAnalysisResponse {
  results: BulkAnalysisItem[];
  total: number;
  successful: number;
  failed: number;
}

export interface SentimentResponse {
  sentiment: 'positive' | 'negative' | 'neutral';
  scores: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface EmotionResponse {
  emotion: string;
  probabilities: {
    anger: number;
    disgust: number;
    fear: number;
    joy: number;
    neutral: number;
    sadness: number;
    surprise: number;
  };
}

export interface AspectSentiment {
  aspect: string;
  type: string;
  label: string;
  position: {
    start: number;
    end: number;
  };
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  probabilities: {
    positive: number;
    negative: number;
    neutral: number;
  };
  context: string;
}

export interface AspectAnalysisResponse {
  text: string;
  aspects: AspectSentiment[];
  overall_sentiment: {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    probabilities: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
  total_aspects: number;
}

// Enhanced analysis result combining all analyses
export interface ComprehensiveAnalysis {
  text: string;
  texts?: string[]; // For batch analysis
  sentiment: SentimentResponse;
  emotion: EmotionResponse;
  aspects: AspectAnalysisResponse;
  timestamp: number;
}

// Secondary emotions (derived from primary emotions and context)
export interface SecondaryEmotions {
  confidence: number;
  frustration: number;
  admiration: number;
  anxiety: number;
  optimism: number;
  skepticism: number;
}

// Tone metrics
export interface ToneMetrics {
  assertive: number;
  polite: number;
  sarcastic: number;
  formal: number;
  subjective: number; // vs objective
}

// Advanced insights
export interface AdvancedInsights {
  emotionalArc?: number[]; // Emotion intensity over sentence progression
  rhetoricalIntent?: {
    claim: number;
    justification: number;
    critique: number;
    explanation: number;
    evidence: number;
  };
  keyPhrases?: string[];
  confidenceExplanation?: string;
}

export interface ApiError {
  detail: string;
}

export interface AnalysisHistoryItem {
  id: string;
  text: string;
  result: SentimentResponse;
  timestamp: number;
}
