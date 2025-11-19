import { useState } from 'react';

interface SDGExample {
  id: string;
  title: string;
  sdg: string;
  sdgNumber: string;
  description: string;
  exampleText: string;
  predictions: {
    sentiment: string;
    dominantEmotion: string;
    emotionScores: Record<string, number>;
    riskFlags: string[];
    recommendations: string[];
    rhetoricalIntent?: string;
  };
  visualizations: {
    type: 'heatmap' | 'bar' | 'radar';
    data: Record<string, unknown>;
  }[];
}

const sdgExamples: SDGExample[] = [
  {
    id: 'peace-conflict',
    title: 'Peace & Conflict Monitoring',
    sdg: 'SDG 16: Peace, Justice and Strong Institutions',
    sdgNumber: '16',
    description: 'Detects escalation language and violence-prone rhetoric in public discourse, helping institutions monitor social tensions and prevent conflicts.',
    exampleText: "If they keep pushing us, we'll take to the streets and fight back.",
    predictions: {
      sentiment: 'negative',
      dominantEmotion: 'anger',
      emotionScores: {
        anger: 0.85,
        fear: 0.12,
        disgust: 0.08,
        sadness: 0.05,
        joy: 0.0,
        surprise: 0.0,
        neutral: 0.0,
      },
      riskFlags: ['Violence-prone language detected', 'Escalation rhetoric identified', 'High threat intensity'],
      recommendations: ['Flag for human review', 'Monitor for escalation patterns', 'Consider conflict mediation'],
      rhetoricalIntent: 'escalation',
    },
    visualizations: [
      {
        type: 'bar',
        data: {
          labels: ['Anger', 'Fear', 'Disgust', 'Sadness'],
          values: [0.85, 0.12, 0.08, 0.05],
        },
      },
    ],
  },
  {
    id: 'online-abuse',
    title: 'Online Abuse Detection & Safer Communities',
    sdg: 'SDG 16: Peace, Justice and Strong Institutions',
    sdgNumber: '16',
    description: 'Identifies harmful language patterns that may indicate cyberbullying, harassment, or psychological abuse, enabling proactive moderation.',
    exampleText: "You're worthless and nobody cares about you.",
    predictions: {
      sentiment: 'negative',
      dominantEmotion: 'disgust',
      emotionScores: {
        anger: 0.15,
        fear: 0.05,
        disgust: 0.65,
        sadness: 0.25,
        joy: 0.0,
        surprise: 0.0,
        neutral: 0.0,
      },
      riskFlags: ['Psychological harm indicator', 'Abusive language pattern', 'High disgust + sadness combination'],
      recommendations: ['Flagged for moderation', 'Review community guidelines violation', 'Consider user support intervention'],
    },
    visualizations: [
      {
        type: 'bar',
        data: {
          labels: ['Disgust', 'Sadness', 'Anger', 'Fear'],
          values: [0.65, 0.25, 0.15, 0.05],
        },
      },
    ],
  },
  {
    id: 'mental-health',
    title: 'Mental Health Signal Detection',
    sdg: 'SDG 3: Good Health and Well-being',
    sdgNumber: '3',
    description: 'Detects patterns indicating mental health distress, withdrawal, or need for support, enabling early intervention and resource connection.',
    exampleText: "Lately I feel like nothing matters. I can't focus and I'm exhausted all the time.",
    predictions: {
      sentiment: 'negative',
      dominantEmotion: 'sadness',
      emotionScores: {
        anger: 0.05,
        fear: 0.15,
        disgust: 0.0,
        sadness: 0.70,
        joy: 0.0,
        surprise: 0.0,
        neutral: 0.10,
      },
      riskFlags: ['Mental health support pattern detected', 'High sadness + anxiety markers', 'Withdrawn tone identified'],
      recommendations: ['Mental health support pattern detected', 'Consider connecting to resources', 'Self-disclosure intent noted'],
    },
    visualizations: [
      {
        type: 'bar',
        data: {
          labels: ['Sadness', 'Anxiety', 'Neutral', 'Anger'],
          values: [0.70, 0.15, 0.10, 0.05],
        },
      },
    ],
  },
];

export default function RealWorldImpact(): JSX.Element {
  const [selectedExample, setSelectedExample] = useState<SDGExample | null>(null);

  const getSDGColor = (sdgNumber: string): string => {
    if (sdgNumber === '16') return 'from-blue-600 to-indigo-600';
    if (sdgNumber === '3') return 'from-green-600 to-emerald-600';
    return 'from-gray-600 to-gray-700';
  };

  const getRiskFlagColor = (flag: string): string => {
    if (flag.includes('Violence') || flag.includes('Escalation')) return 'bg-red-900/30 text-red-200 border-red-700';
    if (flag.includes('Abuse') || flag.includes('harm')) return 'bg-orange-900/30 text-orange-200 border-orange-700';
    if (flag.includes('Mental health') || flag.includes('support')) return 'bg-blue-900/30 text-blue-200 border-blue-700';
    return 'bg-yellow-900/30 text-yellow-200 border-yellow-700';
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
        <p className="text-sm text-yellow-200 leading-relaxed">
          <strong>Important Disclaimer:</strong> This system is not a replacement for clinical or legal evaluation.
          It provides automated early-signal detection to support human decision-makers. All flagged content should
          be reviewed by qualified professionals.
        </p>
      </div>

      {/* SDG Examples */}
      <div className="space-y-6">
        {sdgExamples.map((example) => (
          <div
            key={example.id}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${getSDGColor(example.sdgNumber)} text-white font-bold text-sm`}>
                    SDG {example.sdgNumber}
                  </div>
                  <h3 className="text-xl font-bold text-white">{example.title}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-1">{example.sdg}</p>
                <p className="text-sm text-gray-300 mt-2">{example.description}</p>
              </div>
              <button
                onClick={() => setSelectedExample(selectedExample?.id === example.id ? null : example)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {selectedExample?.id === example.id ? 'Hide Details' : 'Show Analysis'}
              </button>
            </div>

            {/* Example Text */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-4">
              <p className="text-sm text-gray-200 italic">"{example.exampleText}"</p>
            </div>

            {/* Expanded Analysis */}
            {selectedExample?.id === example.id && (
              <div className="mt-4 space-y-4 animate-fade-in">
                {/* Predictions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <h4 className="text-sm font-semibold text-white mb-3">Model Predictions</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Sentiment:</span>
                        <span className={`font-medium capitalize ${example.predictions.sentiment === 'negative' ? 'text-red-400' :
                            example.predictions.sentiment === 'positive' ? 'text-green-400' :
                              'text-gray-400'
                          }`}>
                          {example.predictions.sentiment}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Dominant Emotion:</span>
                        <span className="font-medium text-white capitalize">{example.predictions.dominantEmotion}</span>
                      </div>
                      {example.predictions.rhetoricalIntent && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Rhetorical Intent:</span>
                          <span className="font-medium text-white capitalize">{example.predictions.rhetoricalIntent}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Emotion Visualization */}
                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <h4 className="text-sm font-semibold text-white mb-3">Emotion Distribution</h4>
                    <div className="space-y-2">
                      {Object.entries(example.predictions.emotionScores)
                        .sort(([, a], [, b]) => b - a)
                        .map(([emotion, score]) => (
                          <div key={emotion} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-300 capitalize">{emotion}</span>
                              <span className="text-gray-400">{(score * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${score * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Risk Flags */}
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <h4 className="text-sm font-semibold text-white mb-3">Risk Flags Detected</h4>
                  <div className="flex flex-wrap gap-2">
                    {example.predictions.riskFlags.map((flag, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskFlagColor(flag)}`}
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <h4 className="text-sm font-semibold text-white mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {example.predictions.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Institutional Use Cases */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Institutional Use Cases</h3>
        <div className="space-y-4 text-sm text-gray-300">
          <div>
            <h4 className="font-semibold text-white mb-2">Batch Processing for Social Media Monitoring</h4>
            <p>
              Process thousands of social media posts simultaneously to detect emerging conflict patterns,
              identify coordinated harassment campaigns, or monitor public sentiment trends. The system can
              analyze large datasets to provide aggregate insights and flag high-priority content for human review.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Sentiment Trend Analysis</h4>
            <p>
              Track sentiment and emotional patterns over time to detect rising tensions, mental health
              crises, or community distress. By analyzing temporal trends, institutions can identify early
              warning signals and allocate resources proactively.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Advanced Emotional Spectrum Analysis</h4>
            <p>
              The system's multi-dimensional emotion analysis helps identify subtle patterns that simple
              sentiment classification might miss. For example, the combination of high disgust and sadness
              may indicate psychological abuse, while anger combined with escalation rhetoric may signal
              potential violence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

