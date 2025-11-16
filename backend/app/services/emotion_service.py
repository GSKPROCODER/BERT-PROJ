import hashlib
import json
import logging

import torch
import torch.nn.functional as F  # noqa: N812

from app.models.model_loader import get_emotion_model
from app.utils.redis_client import get_redis_client

logger = logging.getLogger(__name__)


class EmotionService:
    def __init__(self):
        self.tokenizer, self.model = get_emotion_model()
        self.id2label = self.model.config.id2label

    def _get_cache_key(self, text: str) -> str:
        text_hash = hashlib.sha256(text.encode()).hexdigest()
        return f"emotion:{text_hash}"

    async def analyze(self, text: str) -> dict[str, any]:
        cache_key = self._get_cache_key(text)
        redis_client = await get_redis_client()

        cached_result = await redis_client.get(cache_key)
        if cached_result:
            logger.info("Cache hit")
            return json.loads(cached_result)

        logger.info("Cache miss, computing emotion")
        result = self._compute_emotion(text)

        await redis_client.setex(cache_key, 3600, json.dumps(result))
        return result

    def _compute_emotion(self, text: str) -> dict[str, any]:
        inputs = self.tokenizer(
            text, return_tensors="pt", truncation=True, max_length=512, padding=True
        )

        with torch.inference_mode():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probabilities = F.softmax(logits, dim=-1)

        probs = probabilities[0].tolist()

        emotion_probs = {}
        for idx, prob in enumerate(probs):
            label = self.id2label.get(idx, "").lower()
            emotion_probs[label] = float(prob)

        emotion = max(emotion_probs.items(), key=lambda x: x[1])[0]

        return {
            "emotion": emotion,
            "probabilities": emotion_probs,
        }


def get_emotion_service() -> EmotionService:
    return EmotionService()

