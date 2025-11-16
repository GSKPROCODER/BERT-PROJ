import hashlib
import json
import logging

import torch
import torch.nn.functional as F  # noqa: N812

from app.models.model_loader import get_sentiment_model
from app.utils.redis_client import get_redis_client

logger = logging.getLogger(__name__)


class SentimentService:
    def __init__(self):
        self.tokenizer, self.model = get_sentiment_model()
        self.id2label = self.model.config.id2label

    def _get_cache_key(self, text: str) -> str:
        text_hash = hashlib.sha256(text.encode()).hexdigest()
        return f"sentiment:v2:{text_hash}"

    async def analyze(self, text: str) -> dict[str, any]:
        cache_key = self._get_cache_key(text)
        redis_client = await get_redis_client()

        cached_result = await redis_client.get(cache_key)
        if cached_result:
            logger.info("Cache hit")
            return json.loads(cached_result)

        logger.info("Cache miss, computing sentiment")
        result = self._compute_sentiment(text)

        await redis_client.setex(cache_key, 3600, json.dumps(result))
        return result

    def _compute_sentiment(self, text: str) -> dict[str, any]:
        inputs = self.tokenizer(
            text, return_tensors="pt", truncation=True, max_length=512, padding=True
        )

        with torch.inference_mode():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probabilities = F.softmax(logits, dim=-1)

        probs = probabilities[0].tolist()

        scores = {}
        for idx, prob in enumerate(probs):
            label = self.id2label.get(idx, "").lower()
            scores[label] = float(prob)

        positive_score = scores.get("positive", 0.0)
        negative_score = scores.get("negative", 0.0)
        neutral_score = scores.get("neutral", 0.0)

        if abs(positive_score - negative_score) < 0.15:
            sentiment = "neutral"
        else:
            sentiment = max(scores.items(), key=lambda x: x[1])[0]

        result_scores = {
            "positive": positive_score,
            "neutral": neutral_score,
            "negative": negative_score,
        }

        return {
            "sentiment": sentiment,
            "scores": result_scores,
        }


def get_sentiment_service() -> SentimentService:
    return SentimentService()
