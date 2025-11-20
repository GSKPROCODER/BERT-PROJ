"""Tests for risk detection service."""

import pytest

from app.services.risk_service import RiskDetectionService


@pytest.fixture
def risk_service():
    """Create a risk detection service instance."""
    return RiskDetectionService()


def test_nuclear_threat_detection(risk_service):
    """Test detection of nuclear threat language."""
    text = "The nuclear threshold has been met according to intelligence reports."
    result = risk_service.detect_risks(text, "negative", "fear")

    assert result["has_risk"] is True
    assert "nuclear_threat" in result["flags"]
    assert result["risk_level"] in ["medium", "high"]


def test_conflict_escalation_detection(risk_service):
    """Test detection of conflict escalation language."""
    text = "If they keep pushing us, we'll take to the streets and fight back."
    result = risk_service.detect_risks(text, "negative", "anger")

    assert result["has_risk"] is True
    assert "conflict_escalation" in result["flags"]
    assert result["risk_score"] > 0.3


def test_war_conflict_detection(risk_service):
    """Test detection of war/military conflict language."""
    text = "Military mobilization has begun with troops deploying to the border."
    result = risk_service.detect_risks(text, "negative", "fear")

    assert result["has_risk"] is True
    assert "war_conflict" in result["flags"]


def test_self_harm_detection(risk_service):
    """Test detection of self-harm indicators."""
    text = "I can't see a way out anymore and feel like ending it all."
    result = risk_service.detect_risks(text, "negative", "sadness")

    assert result["has_risk"] is True
    assert "self_harm" in result["flags"]
    assert result["risk_level"] == "high"
    assert any("URGENT" in rec for rec in result["recommendations"])


def test_violence_threat_detection(risk_service):
    """Test detection of violence and threats."""
    text = "These people are vermin and need to be eliminated from society."
    result = risk_service.detect_risks(text, "negative", "disgust")

    assert result["has_risk"] is True
    assert "violence_threat" in result["flags"]


def test_cyberbullying_detection(risk_service):
    """Test detection of cyberbullying."""
    text = "You're worthless and nobody cares about you, just give up."
    result = risk_service.detect_risks(text, "negative", "disgust")

    assert result["has_risk"] is True
    assert "cyberbullying" in result["flags"]


def test_mental_health_distress_detection(risk_service):
    """Test detection of mental health distress."""
    text = "I feel empty inside and can't connect with anyone anymore."
    result = risk_service.detect_risks(text, "negative", "sadness")

    assert result["has_risk"] is True
    assert "mental_health_distress" in result["flags"]


def test_no_risk_positive_text(risk_service):
    """Test that positive text doesn't trigger false positives."""
    text = "I love this beautiful day and feel great about everything!"
    result = risk_service.detect_risks(text, "positive", "joy")

    assert result["has_risk"] is False
    assert len(result["flags"]) == 0
    assert result["risk_level"] == "low"


def test_neutral_text_no_risk(risk_service):
    """Test that neutral text doesn't trigger false positives."""
    text = "The meeting is scheduled for tomorrow at 3 PM."
    result = risk_service.detect_risks(text, "neutral", "neutral")

    assert result["has_risk"] is False
    assert result["risk_score"] < 0.3


def test_multiple_risk_flags(risk_service):
    """Test detection of multiple risk categories."""
    text = "Nuclear war is coming and we must take to the streets to fight back."
    result = risk_service.detect_risks(text, "negative", "anger")

    assert result["has_risk"] is True
    assert len(result["flags"]) >= 2
    assert "nuclear_threat" in result["flags"]
    assert result["risk_level"] == "high"


def test_risk_score_calculation(risk_service):
    """Test that risk scores are properly calculated."""
    text = "This is a minor disagreement."
    result = risk_service.detect_risks(text, "neutral", "neutral")

    assert 0.0 <= result["risk_score"] <= 1.0


def test_recommendations_generated(risk_service):
    """Test that recommendations are generated for risks."""
    text = "Nuclear strike imminent, prepare for war."
    result = risk_service.detect_risks(text, "negative", "fear")

    assert result["has_risk"] is True
    assert len(result["recommendations"]) > 0
    assert any("CRITICAL" in rec for rec in result["recommendations"])


def test_terrorism_detection(risk_service):
    """Test detection of terrorism/extremism language."""
    text = "Radicalization efforts targeting vulnerable youth online."
    result = risk_service.detect_risks(text, "negative", "anger")

    assert result["has_risk"] is True
    assert "terrorism_extremism" in result["flags"]


def test_sentiment_score_modifier(risk_service):
    """Test that high negative sentiment increases risk score."""
    text = "This situation is terrible and dangerous."
    sentiment_scores = {"negative": 0.9, "positive": 0.05, "neutral": 0.05}

    result = risk_service.detect_risks(
        text, "negative", "fear", sentiment_scores=sentiment_scores
    )

    # High negative confidence should add to risk score
    assert result["risk_score"] > 0.2
