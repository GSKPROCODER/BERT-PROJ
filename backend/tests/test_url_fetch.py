"""Tests for URL fetching endpoint."""

import pytest


def test_fetch_url_missing_url(client):
    """Test that missing URL returns validation error."""
    response = client.post("/api/fetch-url", json={})
    assert response.status_code == 422


def test_fetch_url_invalid_url(client):
    """Test that invalid URL format returns validation error."""
    response = client.post("/api/fetch-url", json={"url": "not-a-valid-url"})
    assert response.status_code == 422


def test_fetch_url_nonexistent_domain(client):
    """Test that nonexistent domain returns error."""
    response = client.post(
        "/api/fetch-url", json={"url": "https://this-domain-definitely-does-not-exist-12345.com"}
    )
    # Should return 400 or 500 depending on the error
    assert response.status_code in [400, 500]


@pytest.mark.skip(reason="Requires external network access")
def test_fetch_url_success(client):
    """Test successful URL fetching (requires network)."""
    # This test is skipped by default as it requires network access
    response = client.post("/api/fetch-url", json={"url": "https://example.com"})
    assert response.status_code == 200
    data = response.json()
    assert "url" in data
    assert "text" in data
    assert "title" in data
    assert "length" in data
    assert len(data["text"]) > 0
