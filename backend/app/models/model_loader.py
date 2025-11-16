import logging
from typing import Optional, Tuple
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

logger = logging.getLogger(__name__)

SENTIMENT_MODEL_NAME = "cardiffnlp/twitter-roberta-base-sentiment-latest"
EMOTION_MODEL_NAME = "j-hartmann/emotion-english-distilroberta-base"

_sentiment_tokenizer: Optional[AutoTokenizer] = None
_sentiment_model: Optional[AutoModelForSequenceClassification] = None
_emotion_tokenizer: Optional[AutoTokenizer] = None
_emotion_model: Optional[AutoModelForSequenceClassification] = None


def load_models() -> None:
    """Load both sentiment and emotion models globally."""
    global _sentiment_tokenizer, _sentiment_model
    global _emotion_tokenizer, _emotion_model

    if _sentiment_tokenizer is None or _sentiment_model is None:
        logger.info(f"Loading sentiment model: {SENTIMENT_MODEL_NAME}")
        _sentiment_tokenizer = AutoTokenizer.from_pretrained(SENTIMENT_MODEL_NAME)
        _sentiment_model = AutoModelForSequenceClassification.from_pretrained(
            SENTIMENT_MODEL_NAME
        )
        _sentiment_model.eval()
        logger.info("Sentiment model loaded successfully")

    if _emotion_tokenizer is None or _emotion_model is None:
        logger.info(f"Loading emotion model: {EMOTION_MODEL_NAME}")
        _emotion_tokenizer = AutoTokenizer.from_pretrained(EMOTION_MODEL_NAME)
        _emotion_model = AutoModelForSequenceClassification.from_pretrained(
            EMOTION_MODEL_NAME
        )
        _emotion_model.eval()
        logger.info("Emotion model loaded successfully")


def get_sentiment_model() -> Tuple[AutoTokenizer, AutoModelForSequenceClassification]:
    """Get the loaded sentiment tokenizer and model."""
    if _sentiment_tokenizer is None or _sentiment_model is None:
        raise RuntimeError("Sentiment model not loaded. Call load_models() first.")
    return _sentiment_tokenizer, _sentiment_model


def get_emotion_model() -> Tuple[AutoTokenizer, AutoModelForSequenceClassification]:
    """Get the loaded emotion tokenizer and model."""
    if _emotion_tokenizer is None or _emotion_model is None:
        raise RuntimeError("Emotion model not loaded. Call load_models() first.")
    return _emotion_tokenizer, _emotion_model

