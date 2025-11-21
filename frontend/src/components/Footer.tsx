export default function Footer(): JSX.Element {
    return (
        <footer className="mt-12 pb-8 text-center text-sm text-gray-500">
            <div className="flex flex-wrap justify-center items-center gap-2">
                <span>Powered by</span>
                <a
                    href="https://huggingface.co/cardiffnlp/twitter-roberta-base-sentiment-latest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    title="Sentiment Analysis Model"
                >
                    RoBERTa-Sentiment
                </a>
                <span>+</span>
                <a
                    href="https://huggingface.co/j-hartmann/emotion-english-distilroberta-base"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                    title="Emotion Detection Model"
                >
                    DistilRoBERTa-Emotion
                </a>
            </div>
        </footer>
    );
}
