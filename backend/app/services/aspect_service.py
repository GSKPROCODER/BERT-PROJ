import logging
import re

import spacy

from app.services.sentiment_service import get_sentiment_service

logger = logging.getLogger(__name__)

nlp: spacy.Language | None = None


def get_nlp_model():
    global nlp
    if nlp is None:
        try:
            logger.info("Loading spaCy model...")
            nlp = spacy.load("en_core_web_sm")
            logger.info("spaCy model loaded successfully")
        except OSError as e:
            logger.warning(f"spaCy model not found: {e}, trying to download...")
            try:
                import subprocess
                import sys

                result = subprocess.run(
                    [sys.executable, "-m", "spacy", "download", "en_core_web_sm"],
                    capture_output=True,
                    text=True,
                    timeout=300,
                )
                if result.returncode == 0:
                    nlp = spacy.load("en_core_web_sm")
                    logger.info("spaCy model downloaded and loaded")
                else:
                    raise Exception(f"Download failed: {result.stderr}")
            except Exception as download_error:
                logger.error(f"Failed to download spaCy model: {download_error}")
                logger.info("Falling back to basic English model with minimal components...")
                try:
                    nlp = spacy.blank("en")
                    nlp.add_pipe("sentencizer")
                    logger.info("Using basic spaCy model")
                except Exception as fallback_error:
                    logger.error(f"Failed to create fallback model: {fallback_error}")
                    raise
    return nlp


class AspectService:
    def __init__(self):
        self.sentiment_service = get_sentiment_service()
        get_nlp_model()

    def extract_aspects(self, text: str) -> list[dict[str, any]]:
        """Extract noun phrases and named entities as aspects."""
        nlp_model = get_nlp_model()
        doc = nlp_model(text)

        aspects = []
        seen_aspects = set()

        # Extract named entities
        for ent in doc.ents:
            if ent.label_ in ["PERSON", "ORG", "PRODUCT", "EVENT", "WORK_OF_ART", "LAW"]:
                aspect_text = ent.text.strip()
                if len(aspect_text) > 1 and aspect_text.lower() not in seen_aspects:
                    aspects.append(
                        {
                            "text": aspect_text,
                            "type": "entity",
                            "label": ent.label_,
                            "start": ent.start_char,
                            "end": ent.end_char,
                        }
                    )
                    seen_aspects.add(aspect_text.lower())

        # Extract noun phrases (if available)
        try:
            for chunk in doc.noun_chunks:
                chunk_text = chunk.text.strip()
                if (
                    len(chunk_text) > 2
                    and chunk_text.lower() not in seen_aspects
                    and chunk_text.lower() not in ["i", "you", "he", "she", "it", "we", "they"]
                ):
                    # Filter out very common words
                    if not re.match(r"^(the|a|an|this|that|these|those)\s+", chunk_text.lower()):
                        aspects.append(
                            {
                                "text": chunk_text,
                                "type": "noun_phrase",
                                "label": "NOUN_PHRASE",
                                "start": chunk.start_char,
                                "end": chunk.end_char,
                            }
                        )
                        seen_aspects.add(chunk_text.lower())
        except Exception:
            pass

        # Extract important adjectives + nouns (aspect-like patterns)
        for token in doc:
            if token.pos_ == "NOUN" and token.dep_ in ["nsubj", "dobj", "pobj"]:
                noun_text = token.text.strip()
                if len(noun_text) > 2 and noun_text.lower() not in seen_aspects:
                    aspects.append(
                        {
                            "text": noun_text,
                            "type": "noun",
                            "label": "NOUN",
                            "start": token.idx,
                            "end": token.idx + len(noun_text),
                        }
                    )
                    seen_aspects.add(noun_text.lower())

        # Remove duplicates and sort by position
        unique_aspects = []
        for aspect in sorted(aspects, key=lambda x: x["start"]):
            if aspect["text"].lower() not in [a["text"].lower() for a in unique_aspects]:
                unique_aspects.append(aspect)

        # If no aspects found by spaCy, apply a lightweight heuristic fallback
        if not unique_aspects:
            logger.info("No spaCy aspects found — running heuristic fallback extractor")
            # Simple heuristic: extract frequent 2-word noun-like sequences excluding stopwords
            stopwords = set(
                [
                    "the",
                    "a",
                    "an",
                    "this",
                    "that",
                    "these",
                    "those",
                    "and",
                    "or",
                    "but",
                    "is",
                    "are",
                    "was",
                    "were",
                    "it",
                    "i",
                    "you",
                    "he",
                    "she",
                    "we",
                    "they",
                    "to",
                    "for",
                    "of",
                    "in",
                    "on",
                    "with",
                    "by",
                    "be",
                    "has",
                    "have",
                    "had",
                    "its",
                    "my",
                    "your",
                    "our",
                    "their",
                    "too",
                ]
            )
            words = re.findall(r"[A-Za-z]+(?:'[A-Za-z]+)?", text)
            candidates = []
            for i in range(len(words) - 1):
                w1 = words[i].lower()
                w2 = words[i + 1].lower()
                if w1 not in stopwords and w2 not in stopwords and len(w1) > 2 and len(w2) > 2:
                    cand = f"{w1} {w2}"
                    candidates.append(cand)

            seen = set()
            heuristics = []
            for idx, cand in enumerate(candidates):
                if cand in seen:
                    continue
                seen.add(cand)
                # find position in text (first occurrence)
                m = re.search(re.escape(cand), text, flags=re.IGNORECASE)
                start = m.start() if m else 0
                heuristics.append(
                    {
                        "text": cand,
                        "type": "heuristic",
                        "label": "HEURISTIC",
                        "start": start,
                        "end": start + len(cand),
                    }
                )
                if len(heuristics) >= 10:
                    break

            if heuristics:
                return heuristics

        return unique_aspects[:10]  # Limit to top 10 aspects

    def extract_context(self, text: str, aspect: dict[str, any], window: int = 50) -> str:
        """Extract context around an aspect for sentiment analysis."""
        start = max(0, aspect["start"] - window)
        end = min(len(text), aspect["end"] + window)

        context = text[start:end]

        # Try to get sentence containing the aspect
        nlp_model = get_nlp_model()
        doc = nlp_model(text)
        for sent in doc.sents:
            if sent.start_char <= aspect["start"] <= sent.end_char:
                return sent.text.strip()

        return context.strip()

    async def analyze_aspect_sentiment(self, text: str, aspect: dict[str, any]) -> dict[str, any]:
        """Analyze sentiment for a specific aspect."""
        context = self.extract_context(text, aspect)

        # Create aspect-specific prompt
        aspect_text = aspect["text"]
        prompt = f"{aspect_text}: {context}"

        sentiment_result = await self.sentiment_service.analyze(prompt)

        scores = sentiment_result["scores"]
        confidence = max(scores.values())

        return {
            "sentiment": sentiment_result["sentiment"],
            "confidence": confidence,
            "probabilities": scores,
            "context": context,
        }

    async def analyze_aspects(self, text: str) -> dict[str, any]:
        """Perform aspect-based sentiment analysis."""
        aspects = self.extract_aspects(text)

        if not aspects:
            return {
                "text": text,
                "aspects": [],
                "overall_sentiment": None,
                "message": "No aspects found in the text",
            }

        aspect_results = []
        for aspect in aspects:
            sentiment_result = await self.analyze_aspect_sentiment(text, aspect)
            aspect_results.append(
                {
                    "aspect": aspect["text"],
                    "type": aspect["type"],
                    "label": aspect["label"],
                    "position": {"start": aspect["start"], "end": aspect["end"]},
                    "sentiment": sentiment_result["sentiment"],
                    "confidence": sentiment_result["confidence"],
                    "probabilities": sentiment_result["probabilities"],
                    "context": sentiment_result["context"],
                }
            )

        # Calculate overall sentiment
        overall_sentiment = self._calculate_overall_sentiment(aspect_results)

        return {
            "text": text,
            "aspects": aspect_results,
            "overall_sentiment": overall_sentiment,
            "total_aspects": len(aspect_results),
        }

    def _calculate_overall_sentiment(self, aspect_results: list[dict[str, any]]) -> dict[str, any]:
        """Calculate overall sentiment from aspect sentiments."""
        if not aspect_results:
            return {
                "sentiment": "neutral",
                "confidence": 0.0,
                "probabilities": {"positive": 0.0, "negative": 0.0, "neutral": 1.0},
            }

        total_confidence = sum(r["confidence"] for r in aspect_results)
        weighted_sentiments = {"positive": 0.0, "negative": 0.0, "neutral": 0.0}

        for result in aspect_results:
            weight = (
                result["confidence"] / total_confidence
                if total_confidence > 0
                else 1.0 / len(aspect_results)
            )
            probs = result.get("probabilities", {})
            weighted_sentiments["positive"] += probs.get("positive", 0.0) * weight
            weighted_sentiments["negative"] += probs.get("negative", 0.0) * weight
            weighted_sentiments["neutral"] += probs.get("neutral", 0.0) * weight

        if abs(weighted_sentiments["positive"] - weighted_sentiments["negative"]) < 0.15:
            sentiment = "neutral"
        else:
            sentiment = max(weighted_sentiments.items(), key=lambda x: x[1])[0]

        confidence = weighted_sentiments[sentiment]

        return {
            "sentiment": sentiment,
            "confidence": confidence,
            "probabilities": weighted_sentiments,
        }


def get_aspect_service() -> AspectService:
    return AspectService()
