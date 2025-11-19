import type { RiskAnalysis } from '../types';

interface RiskAlertProps {
    riskAnalysis: RiskAnalysis;
}

export default function RiskAlert({ riskAnalysis }: RiskAlertProps): JSX.Element | null {
    if (!riskAnalysis.has_risk) {
        return null;
    }

    const getRiskColor = (level: string): string => {
        switch (level) {
            case 'high':
                return 'bg-red-900/30 border-red-700 text-red-200';
            case 'medium':
                return 'bg-yellow-900/30 border-yellow-700 text-yellow-200';
            default:
                return 'bg-blue-900/30 border-blue-700 text-blue-200';
        }
    };

    const getRiskIcon = (level: string): string => {
        switch (level) {
            case 'high':
                return '🚨';
            case 'medium':
                return '⚠️';
            default:
                return 'ℹ️';
        }
    };

    const getFlagLabel = (flag: string): string => {
        const labels: Record<string, string> = {
            violence: 'Violence',
            self_harm: 'Self-Harm',
            hate_speech: 'Hate Speech',
            extreme_negativity: 'Extreme Negativity',
        };
        return labels[flag] || flag;
    };

    return (
        <div className={`rounded-lg border p-4 ${getRiskColor(riskAnalysis.risk_level)}`}>
            <div className="flex items-start gap-3">
                <span className="text-2xl">{getRiskIcon(riskAnalysis.risk_level)}</span>
                <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                        Risk Alert: {riskAnalysis.risk_level.toUpperCase()} Level
                    </h3>

                    {riskAnalysis.flags.length > 0 && (
                        <div className="mb-3">
                            <p className="text-sm font-medium mb-2">Detected Flags:</p>
                            <div className="flex flex-wrap gap-2">
                                {riskAnalysis.flags.map((flag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 bg-gray-800/50 rounded text-xs font-medium"
                                    >
                                        {getFlagLabel(flag)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {riskAnalysis.recommendations.length > 0 && (
                        <div>
                            <p className="text-sm font-medium mb-2">Recommendations:</p>
                            <ul className="text-sm space-y-1 list-disc list-inside">
                                {riskAnalysis.recommendations.map((rec, idx) => (
                                    <li key={idx}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mt-3 text-xs opacity-75">
                        Risk Score: {(riskAnalysis.risk_score * 100).toFixed(0)}%
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-current/20 text-xs">
                <p className="font-medium">⚠️ Important Disclaimer:</p>
                <p className="mt-1 opacity-90">
                    This automated risk detection is not a substitute for professional judgment. All flagged
                    content should be reviewed by qualified professionals. If you or someone you know is in
                    crisis, please contact local emergency services or a crisis helpline immediately.
                </p>
            </div>
        </div>
    );
}
