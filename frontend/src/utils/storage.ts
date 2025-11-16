import type { AnalysisHistoryItem } from '../types';

const HISTORY_KEY = 'sentiment_analysis_history';
const MAX_HISTORY = 50;

export const saveToHistory = (item: AnalysisHistoryItem): void => {
  const history = getHistory();
  history.unshift(item);
  const trimmed = history.slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
};

export const getHistory = (): AnalysisHistoryItem[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};

export const removeFromHistory = (id: string): void => {
  const history = getHistory();
  const filtered = history.filter((item) => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
};

