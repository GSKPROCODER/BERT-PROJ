import axios, { AxiosError } from 'axios';
import type {
  SentimentRequest,
  SentimentResponse,
  EmotionRequest,
  EmotionResponse,
  BulkAnalysisRequest,
  BulkAnalysisResponse,
  AspectAnalysisResponse,
  ApiError,
} from '../types';

// Use process.env for compatibility with Jest, will be replaced by Vite during build
const API_URL = process.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const analyzeSentiment = async (
  text: string
): Promise<SentimentResponse> => {
  try {
    const response = await api.post<SentimentResponse>('/analysis/sentiment', {
      text,
    } as SentimentRequest);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(
        axiosError.response?.data?.detail || 'Failed to analyze sentiment'
      );
    }
    throw error;
  }
};

export const analyzeEmotion = async (
  text: string
): Promise<EmotionResponse> => {
  try {
    const response = await api.post<EmotionResponse>('/analysis/emotion', {
      text,
    } as EmotionRequest);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(
        axiosError.response?.data?.detail || 'Failed to analyze emotion'
      );
    }
    throw error;
  }
};

export const analyzeBulk = async (
  texts: string[]
): Promise<BulkAnalysisResponse> => {
  try {
    const response = await api.post<BulkAnalysisResponse>('/analysis/bulk', {
      texts,
    } as BulkAnalysisRequest);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(
        axiosError.response?.data?.detail || 'Failed to analyze bulk'
      );
    }
    throw error;
  }
};

export const analyzeAspects = async (
  text: string
): Promise<AspectAnalysisResponse> => {
  try {
    const response = await api.post<AspectAnalysisResponse>('/analysis/aspects', {
      text,
    } as SentimentRequest);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(
        axiosError.response?.data?.detail || 'Failed to analyze aspects'
      );
    }
    throw error;
  }
};

export default api;
