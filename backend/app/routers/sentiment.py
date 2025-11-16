import logging

from fastapi import APIRouter, Depends, HTTPException
from fastapi_limiter.depends import RateLimiter
from fastapi import Request, Response

from app.models.schemas import (
    AspectAnalysisResponse,
    BulkAnalysisItem,
    BulkAnalysisRequest,
    BulkAnalysisResponse,
    EmotionRequest,
    EmotionResponse,
    SentimentRequest,
    SentimentResponse,
)
from app.services.aspect_service import get_aspect_service
from app.services.emotion_service import get_emotion_service
from app.services.sentiment_service import get_sentiment_service

logger = logging.getLogger(__name__)

router = APIRouter()


async def _maybe_rate_limit(request: Request, response: Response, times: int = 10, seconds: int = 60):
    """Apply rate limiting only if FastAPILimiter has been initialized.

    This avoids test-time failures when the limiter hasn't been started.
    """
    try:
        if not RateLimiter.redis:  # type: ignore[attr-defined]
            return
    except Exception:
        # If RateLimiter internals aren't available, skip limiting
        return
    limiter = RateLimiter(times=times, seconds=seconds)
    await limiter(request, response)


async def _rate_limit_10_60(request: Request, response: Response):
    await _maybe_rate_limit(request, response, times=10, seconds=60)


async def _rate_limit_5_60(request: Request, response: Response):
    await _maybe_rate_limit(request, response, times=5, seconds=60)


@router.post("/analysis/sentiment", response_model=SentimentResponse)
async def analyze_sentiment(
    request: SentimentRequest,
    rate_limiter: None = Depends(_rate_limit_10_60),
):
    try:
        service = get_sentiment_service()
        result = await service.analyze(request.text)
        return SentimentResponse(**result)
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error analyzing sentiment: {str(e)}")


@router.post("/analysis/emotion", response_model=EmotionResponse)
async def analyze_emotion(
    request: EmotionRequest,
    rate_limiter: None = Depends(_rate_limit_10_60),
):
    try:
        service = get_emotion_service()
        result = await service.analyze(request.text)
        return EmotionResponse(**result)
    except Exception as e:
        logger.error(f"Error analyzing emotion: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error analyzing emotion: {str(e)}")


@router.post("/analysis/bulk", response_model=BulkAnalysisResponse)
async def analyze_bulk(
    request: BulkAnalysisRequest,
    rate_limiter: None = Depends(_rate_limit_5_60),
):
    try:
        sentiment_service = get_sentiment_service()
        emotion_service = get_emotion_service()

        results = []
        successful = 0
        failed = 0

        for text in request.texts:
            try:
                sentiment_result = await sentiment_service.analyze(text)
                emotion_result = await emotion_service.analyze(text)

                results.append(
                    BulkAnalysisItem(
                        text=text,
                        sentiment=sentiment_result["sentiment"],
                        scores=sentiment_result["scores"],
                        emotion=emotion_result["emotion"],
                        probabilities=emotion_result["probabilities"],
                    )
                )
                successful += 1
            except Exception as e:
                logger.warning(f"Failed to analyze text: {text[:50]}... Error: {e}")
                failed += 1
                continue

        return BulkAnalysisResponse(
            results=results,
            total=len(request.texts),
            successful=successful,
            failed=failed,
        )
    except Exception as e:
        logger.error(f"Error in bulk analysis: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error in bulk analysis: {str(e)}")


@router.post("/analysis/aspects", response_model=AspectAnalysisResponse)
async def analyze_aspects(
    request: SentimentRequest,
    rate_limiter: None = Depends(_rate_limit_10_60),
):
    try:
        service = get_aspect_service()
        result = await service.analyze_aspects(request.text)

        if result.get("message"):
            return AspectAnalysisResponse(
                text=result["text"],
                aspects=[],
                overall_sentiment={
                    "sentiment": "neutral",
                    "confidence": 0.0,
                    "probabilities": {"positive": 0.33, "negative": 0.33, "neutral": 0.34},
                },
                total_aspects=0,
            )

        return AspectAnalysisResponse(**result)
    except Exception as e:
        logger.error(f"Error analyzing aspects: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error analyzing aspects: {str(e)}")


@router.post("/analyze", response_model=SentimentResponse)
async def analyze(
    request: SentimentRequest,
    rate_limiter: None = Depends(_rate_limit_10_60),
):
    """Compatibility endpoint: POST /api/analyze -> runs sentiment analysis."""
    try:
        service = get_sentiment_service()
        result = await service.analyze(request.text)
        return SentimentResponse(**result)
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error analyzing sentiment: {str(e)}")
