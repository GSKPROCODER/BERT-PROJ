interface TextExamplesProps {
  onSelect: (text: string) => void;
}

const EXAMPLES = [
  {
    label: 'Positive',
    text: 'I absolutely love this product! It exceeded all my expectations and the quality is outstanding.',
  },
  {
    label: 'Negative',
    text: 'This is terrible. I am extremely disappointed with the poor service and low quality.',
  },
  {
    label: 'Neutral',
    text: 'The customer service team responded, but the reply seemed automated.',
  },
  {
    label: 'Mixed',
    text: 'The design is beautiful but the price is quite high. Overall, it is acceptable.',
  },
];

export default function TextExamples({ onSelect }: TextExamplesProps): JSX.Element {
  return (
    <div className="mb-6 animate-fade-in">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Try these examples:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {EXAMPLES.map((example, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(example.text)}
            className="text-left p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {example.label}
              </span>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {example.text}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

