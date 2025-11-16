import pytest


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_analyze_sentiment_positive(client):
    response = client.post(
        "/api/analyze",
        json={"text": "I love this product! It's amazing!"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "sentiment" in data
    assert "confidence" in data
    assert "probabilities" in data
    assert data["sentiment"] in ["positive", "negative", "neutral"]
    assert 0.0 <= data["confidence"] <= 1.0


def test_analyze_sentiment_negative(client):
    response = client.post(
        "/api/analyze",
        json={"text": "This is terrible and I hate it."},
    )
    assert response.status_code == 200
    data = response.json()
    assert "sentiment" in data
    assert data["sentiment"] in ["positive", "negative", "neutral"]


def test_analyze_sentiment_empty_text(client):
    response = client.post("/api/analyze", json={"text": ""})
    assert response.status_code == 422


def test_analyze_sentiment_whitespace_only(client):
    response = client.post("/api/analyze", json={"text": "   "})
    assert response.status_code == 422


def test_analyze_sentiment_missing_field(client):
    response = client.post("/api/analyze", json={})
    assert response.status_code == 422

