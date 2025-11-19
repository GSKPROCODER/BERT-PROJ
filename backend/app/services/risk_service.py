"""Risk detection service for identifying potentially harmful content."""

import logging
import re
from typing import Any

logger = logging.getLogger(__name__)


class RiskDetectionService:
    """Service for detecting risk flags in text content."""

    def __init__(self):
        """Initialize risk detection patterns."""
        # Violence and threat patterns
        self.violence_patterns = [
            r"\b(kill|murder|attack|assault|harm|hurt|destroy|weapon|gun|knife|bomb)\b",
            r"\b(violence|violent|threat|threaten|danger|dangerous)\b",
            r"\b(fight|punch|shoot|stab|beat|hit)\b",
        ]

        # Self-harm patterns
        self.self_harm_patterns = [
            r"\b(suicide|suicidal|self-harm|self harm|end my life|want to die)\b",
            r"\b(cut myself|hurt myself|kill myself)\b",
        ]

        # Hate speech patterns
        self.hate_patterns = [
            r"\b(hate|hatred|racist|racism|sexist|sexism)\b",
            r"\b(discriminat|bigot|prejudice)\b",
        ]

        # Extreme negativity patterns
        self.extreme_negative_patterns = [
            r"\b(hopeless|worthless|useless|terrible|awful|horrible|worst)\b",
            r"\b(never|nothing|nobody|no one|always fail)\b",
        ]

        # Compile all patterns
        self.compiled_patterns = {
            "violence": [re.compile(p, re.IGNORECASE) for p in self.violence_patterns],
            "self_harm": [re.compile(p, re.IGNORECASE) for p in self.self_harm_patterns],
            "hate_speech": [re.compile(p, re.IGNORECASE) for p in self.hate_patterns],
            "extreme_negativity": [
                re.compile(p, re.IGNORECASE) for p in self.extreme_negative_patterns
            ],
        }

    def detect_risks(self, text: str, sentiment: str, emotion: str) -> dict[str, Any]:
        """
        Detect risk flags in the given text.

        Args:
            text: The text to analyze
            sentiment: The sentiment classification (positive, negative, neutral)
            emotion: The emotion classification

        Returns:
            Dictionary containing risk analysis results
        """
        text_lower = text.lower()
        flags = []
        risk_level = "low"
        risk_score = 0.0

        # Check for violence
        violence_matches = sum(
            1 for pattern in self.compiled_patterns["violence"] if pattern.search(text_lower)
        )
        if violence_matches > 0:
            flags.append("violence")
            risk_score += violence_matches * 0.3

        # Check for self-harm
        self_harm_matches = sum(
            1 for pattern in self.compiled_patterns["self_harm"] if pattern.search(text_lower)
        )
        if self_harm_matches > 0:
            flags.append("self_harm")
            risk_score += self_harm_matches * 0.4

        # Check for hate speech
        hate_matches = sum(
            1 for pattern in self.compiled_patterns["hate_speech"] if pattern.search(text_lower)
        )
        if hate_matches > 0:
            flags.append("hate_speech")
            risk_score += hate_matches * 0.3

        # Check for extreme negativity
        extreme_neg_matches = sum(
            1
            for pattern in self.compiled_patterns["extreme_negativity"]
            if pattern.search(text_lower)
        )
        if extreme_neg_matches > 2:  # Only flag if multiple matches
            flags.append("extreme_negativity")
            risk_score += 0.2

        # Adjust risk based on sentiment and emotion
        if sentiment == "negative":
            risk_score += 0.1

        if emotion in ["anger", "fear", "sadness"]:
            risk_score += 0.15

        # Determine risk level
        if risk_score >= 0.7:
            risk_level = "high"
        elif risk_score >= 0.4:
            risk_level = "medium"
        else:
            risk_level = "low"

        # Generate recommendations
        recommendations = self._generate_recommendations(flags)

        return {
            "has_risk": len(flags) > 0,
            "risk_level": risk_level,
            "risk_score": min(1.0, risk_score),  # Cap at 1.0
            "flags": flags,
            "recommendations": recommendations,
        }

    def _generate_recommendations(self, flags: list[str]) -> list[str]:
        """Generate recommendations based on detected flags."""
        recommendations = []

        if "self_harm" in flags:
            recommendations.append(
                "Content contains self-harm indicators - requires immediate review"
            )
            recommendations.append("Consider connecting user with mental health resources")

        if "violence" in flags:
            recommendations.append("Content contains violent language - flag for moderation")
            recommendations.append("Assess context and intent before taking action")

        if "hate_speech" in flags:
            recommendations.append("Potential hate speech detected - review for policy violations")

        if "extreme_negativity" in flags:
            recommendations.append("High negativity detected - may benefit from support resources")

        if not recommendations:
            recommendations.append("No significant risk indicators detected")

        return recommendations


# Singleton instance
_risk_service: RiskDetectionService | None = None


def get_risk_service() -> RiskDetectionService:
    """Get or create the risk detection service singleton."""
    global _risk_service
    if _risk_service is None:
        _risk_service = RiskDetectionService()
        logger.info("Risk detection service initialized")
    return _risk_service
