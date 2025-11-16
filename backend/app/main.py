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
    load_models()
    # Ensure spaCy model is loaded at startup so readiness is verified early
    try:
        get_nlp_model()
    except Exception:
        # get_nlp_model logs errors; allow startup to continue but it will fall back later
        pass
    redis_client = await get_redis_client()
    await FastAPILimiter.init(redis_client)
    yield
    await FastAPILimiter.close()


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
    return {"status": "healthy"}
