import { useState } from 'react';

export interface SDGExample {
  text: string;
  category: 'peace-conflict' | 'online-abuse' | 'mental-health';
  label: string;
}

const sdgExamples: SDGExample[] = [
  {
    text: "If they keep pushing us, we'll take to the streets and fight back.",
    category: 'peace-conflict',
    label: 'Peace & Conflict Monitoring (SDG 16)',
  },
  {
    text: "You're worthless and nobody cares about you.",
    category: 'online-abuse',
    label: 'Online Abuse Detection (SDG 16)',
  },
  {
    text: "Lately I feel like nothing matters. I can't focus and I'm exhausted all the time.",
    category: 'mental-health',
    label: 'Mental Health Signal Detection (SDG 3)',
  },
];

interface SDGExamplesToggleProps {
  onSelectExample: (text: string) => void;
}

export default function SDGExamplesToggle({ onSelectExample }: SDGExamplesToggleProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all flex items-center justify-between"
      >
        <span>Show UN SDG Examples</span>
        <span>{isOpen ? '▼' : '▶'}</span>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2 animate-fade-in">
          {sdgExamples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectExample(example.text);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-blue-400">
                  {example.category === 'peace-conflict' ? 'SDG 16' :
                    example.category === 'online-abuse' ? 'SDG 16' : 'SDG 3'}
                </span>
                <span className="text-sm font-medium text-white">{example.label}</span>
              </div>
              <p className="text-xs text-gray-300 italic line-clamp-2">"{example.text}"</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

