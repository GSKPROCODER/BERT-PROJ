import { render, screen } from '@testing-library/react';
import SentimentResult from '../SentimentResult';
import type { SentimentResponse } from '../../types';

describe('SentimentResult', () => {
  it('renders positive sentiment correctly', () => {
    const result: SentimentResponse = {
      sentiment: 'positive',
      scores: {
        positive: 0.95,
        neutral: 0.02,
        negative: 0.03,
      },
    };

    render(<SentimentResult result={result} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('positive');
    expect(screen.getByText(/95\.0% confidence/i)).toBeInTheDocument();
  });

  it('renders negative sentiment correctly', () => {
    const result: SentimentResponse = {
      sentiment: 'negative',
      scores: {
        positive: 0.05,
        neutral: 0.08,
        negative: 0.87,
      },
    };

    render(<SentimentResult result={result} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('negative');
    expect(screen.getByText(/87\.0% confidence/i)).toBeInTheDocument();
  });

  it('renders neutral sentiment correctly', () => {
    const result: SentimentResponse = {
      sentiment: 'neutral',
      scores: {
        positive: 0.15,
        neutral: 0.75,
        negative: 0.10,
      },
    };

    render(<SentimentResult result={result} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('neutral');
    expect(screen.getByText(/75\.0% confidence/i)).toBeInTheDocument();
  });
});

