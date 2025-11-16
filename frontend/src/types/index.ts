export interface SentimentRequest {
  text: string;
}

export interface SentimentResponse {
  sentiment: 'positive' | 'negative' | 'neutral';
  scores: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface EmotionRequest {
  text: string;
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

export interface OverallSentiment {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  probabilities: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface AspectAnalysisResponse {
  text: string;
  aspects: AspectSentiment[];
  overall_sentiment: OverallSentiment;
  total_aspects: number;
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
