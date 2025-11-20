"""URL content fetching router."""

import logging
from typing import Any

import httpx
from bs4 import BeautifulSoup
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl

logger = logging.getLogger(__name__)

router = APIRouter()


class UrlRequest(BaseModel):
    """Request model for URL fetching."""

    url: HttpUrl


class UrlResponse(BaseModel):
    """Response model for URL fetching."""

    url: str
    text: str
    title: str | None = None
    length: int


@router.post("/fetch-url", response_model=UrlResponse)
async def fetch_url_content(request: UrlRequest) -> dict[str, Any]:
    """
    Fetch and extract text content from a URL.

    This endpoint helps avoid CORS issues by fetching content server-side.
    """
    url = str(request.url)
    logger.info(f"Fetching URL: {url}")

    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            response = await client.get(
                url,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                },
            )
            response.raise_for_status()

        # Parse HTML content
        soup = BeautifulSoup(response.text, "html.parser")

        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.decompose()

        # Extract title
        title = soup.title.string if soup.title else None

        # Get text content
        text = soup.get_text(separator=" ", strip=True)

        # Clean up whitespace
        text = " ".join(text.split())

        # Limit text length
        max_length = 5000
        if len(text) > max_length:
            text = text[:max_length] + "..."
            logger.info(f"Truncated text from {len(text)} to {max_length} characters")

        if len(text) < 10:
            raise HTTPException(
                status_code=400,
                detail="Could not extract meaningful text from URL",
            )

        return {
            "url": url,
            "text": text,
            "title": title,
            "length": len(text),
        }

    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error fetching URL {url}: {e}")
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Failed to fetch URL: HTTP {e.response.status_code}",
        )
    except httpx.RequestError as e:
        logger.error(f"Request error fetching URL {url}: {e}", exc_info=True)
        raise HTTPException(
            status_code=400,
            detail=f"Network error: {type(e).__name__} - {str(e)}",
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error fetching URL {url}: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Server error: {type(e).__name__} - {str(e)}",
        )
