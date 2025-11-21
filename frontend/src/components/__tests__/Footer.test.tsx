import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
    it('renders footer with model links', () => {
        render(<Footer />);
        expect(screen.getByText(/Powered by/i)).toBeDefined();
    });

    it('contains RoBERTa model links', () => {
        const { container } = render(<Footer />);
        const links = container.querySelectorAll('a');
        expect(links.length).toBeGreaterThan(0);
    });
});
