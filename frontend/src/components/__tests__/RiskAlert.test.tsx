import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import RiskAlert from '../RiskAlert';
import type { RiskAnalysis } from '../../types';

describe('RiskAlert', () => {
    it('renders nothing when no risk detected', () => {
        const riskAnalysis: RiskAnalysis = {
            has_risk: false,
            risk_level: 'low',
            risk_score: 0.1,
            flags: [],
            recommendations: [],
        };
        const { container } = render(<RiskAlert riskAnalysis={riskAnalysis} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders alert when risk is detected', () => {
        const riskAnalysis: RiskAnalysis = {
            has_risk: true,
            risk_level: 'high',
            risk_score: 0.8,
            flags: ['violence_threat'],
            recommendations: ['Review content for safety'],
        };
        render(<RiskAlert riskAnalysis={riskAnalysis} />);
        expect(screen.getByText(/Risk Alert/i)).toBeDefined();
    });

    it('displays risk flags correctly', () => {
        const riskAnalysis: RiskAnalysis = {
            has_risk: true,
            risk_level: 'medium',
            risk_score: 0.5,
            flags: ['nuclear_threat', 'conflict_escalation'],
            recommendations: [],
        };
        render(<RiskAlert riskAnalysis={riskAnalysis} />);
        expect(screen.getByText(/Nuclear Threat/i)).toBeDefined();
    });

    it('displays recommendations', () => {
        const riskAnalysis: RiskAnalysis = {
            has_risk: true,
            risk_level: 'high',
            risk_score: 0.9,
            flags: ['self_harm'],
            recommendations: ['URGENT: Self-harm indicators detected'],
        };
        render(<RiskAlert riskAnalysis={riskAnalysis} />);
        expect(screen.getByText(/URGENT/i)).toBeDefined();
    });
});
