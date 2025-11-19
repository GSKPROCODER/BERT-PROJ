import { getHistory } from '../utils/storage';
import type { ComprehensiveAnalysis } from '../types';

interface SDGImpactReportProps {
  currentAnalysis: ComprehensiveAnalysis | null;
}

export default function SDGImpactReport({ currentAnalysis }: SDGImpactReportProps): JSX.Element {
  const generateReport = (): void => {
    const history = getHistory();
    const allAnalyses = currentAnalysis ? [currentAnalysis, ...history.map(h => ({
      text: h.text,
      sentiment: h.result,
      emotion: { emotion: 'unknown', probabilities: {} },
      aspects: { text: h.text, aspects: [], overall_sentiment: { sentiment: h.result.sentiment, confidence: 0.8, probabilities: h.result.scores }, total_aspects: 0 },
      timestamp: h.timestamp,
    }))] : history.map(h => ({
      text: h.text,
      sentiment: h.result,
      emotion: { emotion: 'unknown', probabilities: {} },
      aspects: { text: h.text, aspects: [], overall_sentiment: { sentiment: h.result.sentiment, confidence: 0.8, probabilities: h.result.scores }, total_aspects: 0 },
      timestamp: h.timestamp,
    }));

    // Analyze trends
    const sentimentDistribution = {
      positive: allAnalyses.filter(a => a.sentiment.sentiment === 'positive').length,
      negative: allAnalyses.filter(a => a.sentiment.sentiment === 'negative').length,
      neutral: allAnalyses.filter(a => a.sentiment.sentiment === 'neutral').length,
    };

    // Detect flags (simplified heuristic)
    const flags = {
      conflictEscalation: allAnalyses.filter(a => 
        a.text.toLowerCase().includes('fight') || 
        a.text.toLowerCase().includes('violence') ||
        a.text.toLowerCase().includes('attack')
      ).length,
      abusePatterns: allAnalyses.filter(a =>
        a.text.toLowerCase().includes('worthless') ||
        a.text.toLowerCase().includes('nobody cares') ||
        a.text.toLowerCase().includes('hate')
      ).length,
      mentalHealthSignals: allAnalyses.filter(a =>
        a.text.toLowerCase().includes('nothing matters') ||
        a.text.toLowerCase().includes('exhausted') ||
        a.text.toLowerCase().includes('can\'t focus')
      ).length,
    };

    const report = {
      reportType: 'SDG Impact Report',
      generatedAt: new Date().toISOString(),
      summary: {
        totalAnalyses: allAnalyses.length,
        sentimentDistribution,
        flagsDetected: flags,
      },
      sdgAlignment: {
        sdg16: {
          title: 'Peace, Justice and Strong Institutions',
          contributions: [
            'Conflict escalation detection through sentiment and emotion analysis',
            'Online abuse pattern identification for safer digital communities',
            'Early warning system for potential violence or harassment',
          ],
          metrics: {
            conflictEscalationFlags: flags.conflictEscalation,
            abusePatternFlags: flags.abusePatterns,
          },
        },
        sdg3: {
          title: 'Good Health and Well-being',
          contributions: [
            'Mental health signal detection through emotional analysis',
            'Early identification of distress patterns',
            'Support resource connection facilitation',
          ],
          metrics: {
            mentalHealthSignals: flags.mentalHealthSignals,
          },
        },
      },
      exampleAnalyses: allAnalyses.slice(0, 5).map(a => ({
        text: a.text.substring(0, 100) + (a.text.length > 100 ? '...' : ''),
        sentiment: a.sentiment.sentiment,
        confidence: Math.max(...Object.values(a.sentiment.scores)),
        timestamp: new Date(a.timestamp).toISOString(),
      })),
      recommendations: [
        'Continue monitoring sentiment trends for early conflict detection',
        'Review flagged content with qualified professionals',
        'Use batch processing for large-scale social media monitoring',
        'Integrate with human review workflows for high-priority flags',
      ],
      disclaimer: 'This system provides automated early-signal detection to support human decision-makers. It is not a replacement for clinical or legal evaluation.',
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sdg-impact-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={generateReport}
      className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Generate SDG Impact Report
    </button>
  );
}

