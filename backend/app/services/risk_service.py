"""Risk detection service for identifying potentially harmful content."""

import logging
import re
from typing import Any

logger = logging.getLogger(__name__)


class RiskDetectionService:
    """Service for detecting risk flags in text content."""

    def __init__(self):
        """Initialize risk detection patterns."""
        # Violence and threat patterns (SDG 16: Peace & Conflict)
        self.violence_patterns = [
            # Direct violence
            r"\b(kill|murder|attack|assault|harm|hurt|destroy|weapon|gun|knife|bomb)\b",
            r"\b(violence|violent|threat|threaten|danger|dangerous)\b",
            r"\b(fight|punch|shoot|stab|beat|hit|strike|smash)\b",
            # Escalation and conflict
            r"\b(take to the streets|fight back|rise up|take action|retaliate)\b",
            r"\b(push.*back|stand.*ground|won'?t back down|ready to fight)\b",
            r"\b(war|battle|combat|conflict|clash|confrontation)\b",
            r"\b(riot|uprising|revolt|rebellion|resistance)\b",
            # Threats and intimidation
            r"\b(watch out|you'?ll pay|regret|consequences|teach.*lesson)\b",
            r"\b(come after|get you|find you|hunt.*down)\b",
            r"\b(blood|bleed|suffer|pain|torture)\b",
            # Mobilization language
            r"\b(rally|mobilize|organize|march|protest violently)\b",
            r"\b(arm ourselves|prepare for|gear up|ready for war)\b",
            r"\b(enough is enough|last straw|breaking point|no more)\b",
            # Dehumanization
            r"\b(scum|vermin|trash|garbage|animals|beasts)\b",
            r"\b(eliminate|eradicate|purge|cleanse|remove)\b",
        ]

        # Self-harm patterns (CRITICAL - Highest Priority)
        self.self_harm_patterns = [
            # Direct self-harm
            r"\b(suicide|suicidal|self-harm|self harm|end my life|want to die|don'?t want to live)\b",
            r"\b(cut myself|hurt myself|kill myself|end it all|take my life)\b",
            r"\b(better off dead|no reason to live|can'?t go on|can'?t continue)\b",
            # Suicidal ideation
            r"\b(plan.*suicide|how to.*die|ways to.*kill|end.*pain)\b",
            r"\b(goodbye.*world|final.*message|last.*time|won'?t be here)\b",
            r"\b(ready to.*die|prepared to.*end|time to.*go)\b",
            # Hopelessness about future
            r"\b(no future|no tomorrow|no way out|trapped|escape.*pain)\b",
            r"\b(can'?t see.*way|no hope left|nothing left)\b",
            # Self-injury
            r"\b(cut|cutting|burn|burning|harm|hurt).*myself\b",
            r"\b(self.*injur|self.*destruct|self.*mutilat)\b",
        ]

        # Hate speech and bullying patterns (SDG 16: Online Abuse)
        self.hate_patterns = [
            # Direct hate speech
            r"\b(hate|hatred|racist|racism|sexist|sexism|homophob|transphob)\b",
            r"\b(discriminat|bigot|prejudice|intoleran)\b",
            # Personal attacks and bullying
            r"\b(you'?re worthless|nobody cares|you'?re useless|you'?re pathetic)\b",
            r"\b(loser|failure|idiot|stupid|dumb|moron|retard)\b",
            r"\b(ugly|disgusting|repulsive|revolting)\b",
            r"\b(waste of space|burden|mistake|shouldn'?t exist)\b",
            # Severe bullying
            r"\b(kill yourself|go die|should die|end yourself)\b",
            r"\b(no one likes you|everyone hates you|alone forever)\b",
            r"\b(embarrassment|shame|humiliat|degrad)\b",
            # Exclusion and isolation
            r"\b(don'?t belong|not wanted|get out|go away forever)\b",
            r"\b(nobody wants you|reject|outcast)\b",
            # Mockery and ridicule
            r"\b(laugh.*at you|joke|pathetic excuse|laughingstock)\b",
            r"\b(can'?t do anything right|always fail|total failure)\b",
        ]

        # Depression and mental health indicators (SDG 3: Mental Health)
        self.depression_patterns = [
            # Hopelessness and despair
            r"\b(nothing matters|can'?t focus|exhausted all the time)\b",
            r"\b(no point|give up|giving up|lost hope|hopeless)\b",
            r"\b(empty inside|numb|can'?t feel|feel nothing)\b",
            r"\b(don'?t care anymore|why bother|what'?s the point)\b",
            # Withdrawal and isolation
            r"\b(alone|lonely|isolated|no one understands)\b",
            r"\b(can'?t connect|distant|detached|withdrawn)\b",
            r"\b(avoid.*people|stay.*alone|hide away)\b",
            # Fatigue and exhaustion
            r"\b(too tired|no energy|can'?t get up|exhausted)\b",
            r"\b(sleep all day|can'?t sleep|insomnia)\b",
            r"\b(drained|burnt out|can'?t function)\b",
            # Loss of interest
            r"\b(nothing.*fun|no joy|can'?t enjoy|lost interest)\b",
            r"\b(don'?t want.*anything|stopped caring|gave up trying)\b",
            # Cognitive symptoms
            r"\b(can'?t think|brain fog|can'?t concentrate|memory.*bad)\b",
            r"\b(confused|overwhelmed|can'?t cope|falling apart)\b",
            # Negative self-perception
            r"\b(burden.*others|better off without me|drag.*down)\b",
            r"\b(failed.*everyone|let.*down|disappointed)\b",
        ]

        # Extreme negativity patterns
        self.extreme_negative_patterns = [
            r"\b(hopeless|worthless|useless|terrible|awful|horrible|worst)\b",
            r"\b(never|nothing|nobody|no one|always fail)\b",
            r"\b(can'?t do anything|everything is wrong|total failure)\b",
        ]

        # Compile all patterns
        self.compiled_patterns = {
            "violence": [re.compile(p, re.IGNORECASE) for p in self.violence_patterns],
            "self_harm": [re.compile(p, re.IGNORECASE) for p in self.self_harm_patterns],
            "hate_speech": [re.compile(p, re.IGNORECASE) for p in self.hate_patterns],
            "depression": [re.compile(p, re.IGNORECASE) for p in self.depression_patterns],
            "extreme_negativity": [
                re.compile(p, re.IGNORECASE) for p in self.extreme_negative_patterns
            ],
        }

    def detect_risks(
        self, text: str, sentiment: str, emotion: str, sentiment_scores: dict = None
    ) -> dict[str, Any]:
        """
        Detect risk flags using both BERT model outputs and pattern matching.

        Args:
            text: The text to analyze
            sentiment: The sentiment classification (positive, negative, neutral)
            emotion: The emotion classification
            sentiment_scores: Probability scores from sentiment model (optional)

        Returns:
            Dictionary containing risk analysis results
        """
        text_lower = text.lower()
        flags = []
        risk_level = "low"
        risk_score = 0.0

        # Use BERT sentiment scores for risk assessment
        negative_confidence = 0.0
        if sentiment_scores:
            negative_confidence = sentiment_scores.get("negative", 0.0)

        # Check for violence (SDG 16: Peace & Conflict)
        violence_matches = sum(
            1 for pattern in self.compiled_patterns["violence"] if pattern.search(text_lower)
        )
        if violence_matches > 0:
            flags.append("violence_escalation")
            risk_score += violence_matches * 0.35

        # Check for self-harm (Critical - highest priority)
        self_harm_matches = sum(
            1 for pattern in self.compiled_patterns["self_harm"] if pattern.search(text_lower)
        )
        if self_harm_matches > 0:
            flags.append("self_harm")
            risk_score += self_harm_matches * 0.5

        # Check for hate speech/cyberbullying (SDG 16: Online Abuse)
        hate_matches = sum(
            1 for pattern in self.compiled_patterns["hate_speech"] if pattern.search(text_lower)
        )
        if hate_matches > 0:
            flags.append("cyberbullying")
            risk_score += hate_matches * 0.4

        # Check for depression indicators (SDG 3: Mental Health)
        depression_matches = sum(
            1 for pattern in self.compiled_patterns["depression"] if pattern.search(text_lower)
        )
        if depression_matches > 0:
            flags.append("mental_health_distress")
            risk_score += depression_matches * 0.35

        # Check for extreme negativity
        extreme_neg_matches = sum(
            1
            for pattern in self.compiled_patterns["extreme_negativity"]
            if pattern.search(text_lower)
        )
        if extreme_neg_matches >= 2:  # Multiple negative indicators
            flags.append("extreme_negativity")
            risk_score += 0.2

        # BERT-based risk assessment: Use model confidence scores
        # High negative sentiment with high confidence is a strong risk indicator
        if sentiment == "negative" and negative_confidence > 0.8:
            risk_score += 0.25
        elif sentiment == "negative" and negative_confidence > 0.6:
            risk_score += 0.15
        elif sentiment == "negative":
            risk_score += 0.1

        # BERT emotion analysis: Certain emotion combinations indicate higher risk
        high_risk_emotions = ["anger", "fear", "sadness", "disgust"]
        if emotion in high_risk_emotions:
            risk_score += 0.2

        # Emotion + Sentiment combination analysis (BERT-based)
        if emotion == "sadness" and sentiment == "negative" and negative_confidence > 0.7:
            # Strong sadness + negative = potential depression/mental health
            if "mental_health_distress" not in flags:
                flags.append("mental_health_distress")
                risk_score += 0.2

        if emotion == "anger" and sentiment == "negative":
            # Anger + negative = potential violence/conflict
            if "violence_escalation" not in flags and any(
                pattern.search(text_lower) for pattern in self.compiled_patterns["violence"]
            ):
                flags.append("violence_escalation")
                risk_score += 0.15

        if emotion == "disgust" and any(
            pattern.search(text_lower) for pattern in self.compiled_patterns["hate_speech"]
        ):
            # Disgust + hate patterns = stronger cyberbullying indicator
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
                "URGENT: Self-harm indicators - requires immediate professional review"
            )
            recommendations.append("Connect with crisis helpline or mental health services")
            recommendations.append("SDG 3: Mental health intervention needed")

        if "mental_health_distress" in flags:
            recommendations.append(
                "Mental health distress signals - early intervention recommended"
            )
            recommendations.append("Consider outreach with support services")
            recommendations.append("SDG 3: Proactive mental health support")

        if "violence_escalation" in flags:
            recommendations.append("Violence/conflict escalation language - monitor for safety")
            recommendations.append("Assess context and potential for real-world harm")
            recommendations.append("SDG 16: Peace and conflict prevention")

        if "cyberbullying" in flags:
            recommendations.append("Cyberbullying/harassment detected - content moderation needed")
            recommendations.append("Review for policy violations and protective measures")
            recommendations.append("SDG 16: Safer online communities")

        if "extreme_negativity" in flags:
            recommendations.append("High negativity - may benefit from support resources")

        if not recommendations:
            recommendations.append("No significant risk indicators - content appears safe")

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
