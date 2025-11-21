import RealWorldImpact from '../components/RealWorldImpact';

export default function About(): JSX.Element {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          About This Application
        </h1>
        <p className="text-lg text-gray-300">
          Advanced NLP sentiment and emotion analysis powered by state-of-the-art transformer models
        </p>
      </header>

      <div className="space-y-8">
        {/* Models Used */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">
            🤖 Models Used
          </h2>
          <div className="space-y-4 text-gray-300">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-blue-400">📊</span> Sentiment Analysis
              </h3>
              <p className="text-sm mb-2">
                <strong>Model:</strong>{' '}
                <a
                  href="https://huggingface.co/cardiffnlp/twitter-roberta-base-sentiment-latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  cardiffnlp/twitter-roberta-base-sentiment-latest
                </a>
              </p>
              <p className="text-sm mt-1">
                This is a <strong>RoBERTa-base</strong> model fine-tuned on ~124M tweets for sentiment classification.
                It classifies text into three categories: <strong>positive</strong>, <strong>negative</strong>, or <strong>neutral</strong>.
                RoBERTa (Robustly Optimized BERT) improves upon BERT with better training methodology and more data.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-purple-400">😊</span> Emotion Analysis
              </h3>
              <p className="text-sm mb-2">
                <strong>Model:</strong>{' '}
                <a
                  href="https://huggingface.co/j-hartmann/emotion-english-distilroberta-base"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  j-hartmann/emotion-english-distilroberta-base
                </a>
              </p>
              <p className="text-sm mt-1">
                A <strong>DistilRoBERTa</strong> model (distilled version, 40% smaller, 60% faster) fine-tuned for emotion classification.
                It identifies seven primary emotions: <strong>joy</strong>, <strong>anger</strong>, <strong>sadness</strong>, <strong>fear</strong>,
                <strong> surprise</strong>, <strong>disgust</strong>, and <strong>neutral</strong>.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Aspect Analysis</h3>
              <p className="text-sm">
                <strong>Model:</strong> spaCy (en_core_web_sm) + Custom NLP pipeline
              </p>
              <p className="text-sm mt-1">
                Uses spaCy for named entity recognition and dependency parsing to extract specific aspects
                (features, topics, entities) from text and determine sentiment for each aspect.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">
            🔬 How It Works
          </h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold mb-2">Sentiment Analysis</h3>
              <p className="text-sm">
                The RoBERTa model processes your text through multiple transformer layers,
                learning contextual relationships between words. It outputs probability scores
                for each sentiment class, with the highest score determining the overall sentiment.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Emotion Analysis</h3>
              <p className="text-sm">
                The emotion model analyzes the emotional tone of the text, identifying which
                primary emotion is most prominent. The model provides probability distributions
                across all emotion categories, allowing for nuanced emotional understanding.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Aspect Analysis</h3>
              <p className="text-sm">
                Aspect-based sentiment analysis breaks down text into specific topics or features
                mentioned. For example, in "The camera is great but battery life is poor," it identifies
                "camera" (positive) and "battery life" (negative) as separate aspects. This is achieved
                through named entity recognition and dependency parsing.
              </p>
            </div>
          </div>
        </section>

        {/* Example Input/Output */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">
            📝 Example Input & Output
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-gray-300">Input:</h3>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-200 italic">
                  "The product quality is excellent, but customer service needs significant improvement.
                  Overall, I'm satisfied with my purchase."
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-300">Output:</h3>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-2 text-sm">
                <div>
                  <strong>Sentiment:</strong> Positive (65% confidence)
                </div>
                <div>
                  <strong>Dominant Emotion:</strong> Joy (45%)
                </div>
                <div>
                  <strong>Aspects Detected:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>Product quality: Positive (85% confidence)</li>
                    <li>Customer service: Negative (78% confidence)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Limitations */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">
            ⚠️ Limitations
          </h2>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <p>
                <strong>Context Dependency:</strong> Models may misinterpret sarcasm, irony, or cultural nuances
                that require broader context.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <p>
                <strong>Language:</strong> Models are optimized for English text. Performance may degrade
                with other languages or code-switching.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <p>
                <strong>Short Text:</strong> Very short texts (less than 3 words) may produce less reliable results
                due to limited context.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <p>
                <strong>Domain Specificity:</strong> Models are trained on general text. Specialized domains
                (medical, legal, technical) may require domain-specific fine-tuning.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <p>
                <strong>Aspect Detection:</strong> Aspect analysis works best with opinionated text containing
                multiple topics. Simple statements may not yield aspects.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <p>
                <strong>Bias:</strong> Models may reflect biases present in training data. Results should be
                interpreted with awareness of potential biases.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">
            ⚙️ Technical Details
          </h2>
          <div className="space-y-3 text-sm text-gray-300">
            <div>
              <strong>Framework:</strong> FastAPI (Backend), React + TypeScript (Frontend)
            </div>
            <div>
              <strong>ML Libraries:</strong> PyTorch, Transformers (Hugging Face), spaCy
            </div>
            <div>
              <strong>Deployment:</strong> Docker, Railway-ready
            </div>
            <div>
              <strong>Caching:</strong> Redis for improved performance
            </div>
            <div>
              <strong>Rate Limiting:</strong> 10 requests per minute per endpoint
            </div>
          </div>
        </section>

        {/* Risk Detection */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">
            🛡️ Advanced Risk Detection
          </h2>
          <div className="space-y-4 text-sm text-gray-300">
            <p>
              Our comprehensive risk detection system monitors for multiple threat categories aligned with UN Sustainable Development Goals (SDGs):
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4 border border-red-900/50">
                <h3 className="font-semibold text-red-400 mb-2">☢️ Nuclear & WMD Threats</h3>
                <p className="text-xs">
                  Detects nuclear weapon references, WMD threats, escalation language, and threshold warnings.
                  Critical for global security monitoring.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-orange-900/50">
                <h3 className="font-semibold text-orange-400 mb-2">⚔️ War & Military Conflict</h3>
                <p className="text-xs">
                  Identifies war declarations, military operations, troop movements, and conflict zone language.
                  SDG 16: Peace and strong institutions.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-yellow-900/50">
                <h3 className="font-semibold text-yellow-400 mb-2">📈 Conflict Escalation</h3>
                <p className="text-xs">
                  Early warning system for mobilization calls, threshold language, retaliation threats, and street action rhetoric.
                  Example: "If they keep pushing us, we'll take to the streets and fight back."
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-red-900/50">
                <h3 className="font-semibold text-red-400 mb-2">💣 Terrorism & Extremism</h3>
                <p className="text-xs">
                  Monitors for extremist language, radicalization indicators, and terrorist activity references.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-purple-900/50">
                <h3 className="font-semibold text-purple-400 mb-2">🔪 Violence & Threats</h3>
                <p className="text-xs">
                  Detects direct violence, weapons, threats, intimidation, and dehumanization language.
                  SDG 16: Violence prevention.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-pink-900/50">
                <h3 className="font-semibold text-pink-400 mb-2">🆘 Self-Harm (Critical)</h3>
                <p className="text-xs">
                  Highest priority detection for suicide ideation, self-injury, and hopelessness.
                  SDG 3: Mental health support.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-blue-900/50">
                <h3 className="font-semibold text-blue-400 mb-2">😢 Cyberbullying</h3>
                <p className="text-xs">
                  Identifies harassment, hate speech, personal attacks, and online abuse patterns.
                  SDG 16: Safer communities.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-indigo-900/50">
                <h3 className="font-semibold text-indigo-400 mb-2">🧠 Mental Health Distress</h3>
                <p className="text-xs">
                  Monitors depression indicators, hopelessness, withdrawal, and cognitive symptoms.
                  SDG 3: Mental health awareness.
                </p>
              </div>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3 mt-4">
              <p className="text-xs">
                <strong>⚠️ Note:</strong> This system uses pattern matching and NLP analysis. It's designed for early warning
                and content moderation, not as a substitute for professional security or mental health assessment.
              </p>
            </div>
          </div>
        </section>

        {/* Real-World Impact */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">
            🌍 Real-World Impact
          </h2>
          <RealWorldImpact />
        </section>
      </div>
    </div>
  );
}

