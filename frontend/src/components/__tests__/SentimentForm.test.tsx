import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SentimentForm from '../SentimentForm';
import { analyzeSentiment } from '../../services/api';
import type { SentimentResponse } from '../../types';

jest.mock('../../services/api');

const mockAnalyzeSentiment = analyzeSentiment as jest.MockedFunction<
  typeof analyzeSentiment
>;

describe('SentimentForm', () => {
  const mockOnResult = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form elements', () => {
    render(<SentimentForm onResult={mockOnResult} onError={mockOnError} />);
    expect(screen.getByLabelText(/enter text to analyze/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analyze sentiment/i })).toBeInTheDocument();
  });

  it('submits form and calls onResult with success', async () => {
    const mockResult: SentimentResponse = {
      sentiment: 'positive',
      scores: {
        positive: 0.95,
        neutral: 0.02,
        negative: 0.03,
      },
    };
    mockAnalyzeSentiment.mockResolvedValue(mockResult);

    render(<SentimentForm onResult={mockOnResult} onError={mockOnError} />);
    const textarea = screen.getByLabelText(/enter text to analyze/i);
    const button = screen.getByRole('button', { name: /analyze sentiment/i });

    await userEvent.type(textarea, 'I love this product!');
    await userEvent.click(button);

    await waitFor(() => {
      expect(mockAnalyzeSentiment).toHaveBeenCalledWith('I love this product!');
      expect(mockOnResult).toHaveBeenCalledWith(mockResult);
    });
  });

  it('calls onError when API fails', async () => {
    mockAnalyzeSentiment.mockRejectedValue(new Error('API Error'));

    render(<SentimentForm onResult={mockOnResult} onError={mockOnError} />);
    const textarea = screen.getByLabelText(/enter text to analyze/i);
    const button = screen.getByRole('button', { name: /analyze sentiment/i });

    await userEvent.type(textarea, 'Test text');
    await userEvent.click(button);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('API Error');
    });
  });

  it('shows error for empty submission', async () => {
    render(<SentimentForm onResult={mockOnResult} onError={mockOnError} />);
    const button = screen.getByRole('button', { name: /analyze sentiment/i });

    await userEvent.click(button);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Please enter some text to analyze');
    });
  });
});

