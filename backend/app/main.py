from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_limiter import FastAPILimiter

from app.models.model_loader import load_models
from app.routers import sentiment
from app.services.aspect_service import get_nlp_model
from app.utils.logging_config import setup_logging
from app.utils.redis_client import get_redis_client

setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    import logging

    logger = logging.getLogger(__name__)

    # Load models with error handling - don't block startup
    try:
        logger.info("Starting model loading...")
        load_models()
        logger.info("Models loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load models during startup: {e}")
        logger.warning("App will start but model endpoints may fail until models are loaded")

    # Ensure spaCy model is loaded at startup so readiness is verified early
    try:
        get_nlp_model()
    except Exception as e:
        logger.warning(f"Failed to load spaCy model: {e}")

    # Initialize Redis and rate limiter with graceful fallback
    try:
        redis_client = await get_redis_client()
        await FastAPILimiter.init(redis_client)
        logger.info("Redis and rate limiter initialized")
    except Exception as e:
        logger.warning(f"Failed to initialize Redis/rate limiter: {e}. Rate limiting disabled.")

    yield

    # Cleanup
    try:
        await FastAPILimiter.close()
    except Exception:
        pass


app = FastAPI(
    title="NLP Intelligence System API",
    description="Sentiment and emotion analysis API with BERT-based models",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sentiment.router, prefix="/api", tags=["sentiment"])


@app.get("/health")
async def health_check():
    """Health check endpoint - always returns healthy if app is running."""
    return {"status": "healthy"}


@app.get("/readiness")
async def readiness_check():
    """Readiness check - verifies models and dependencies are loaded."""
    from app.models.model_loader import _emotion_model, _sentiment_model

    if _sentiment_model is None or _emotion_model is None:
        return {"status": "not_ready", "reason": "models_loading"}

    return {"status": "ready"}
