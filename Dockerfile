# Root Dockerfile for Railway Deployment
# This file serves as a fallback for Railway when deploying the entire monorepo
# Railway will typically use service-specific Dockerfiles in backend/ and frontend/
# This file is provided for compatibility with Railway's auto-detection

# Default to backend service
FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements-prod.txt ./requirements-prod.txt
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements-prod.txt \
    && python -m pip install --no-cache-dir \
    https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.0/en_core_web_sm-3.7.0-py3-none-any.whl \
    && find /usr/local -depth \( -type d -a -name __pycache__ -o -name test -o -name tests \) -exec rm -rf '{}' + 2>/dev/null || true \
    && rm -rf /root/.cache/pip

FROM python:3.11-slim

WORKDIR /app

COPY --from=builder /usr/local /usr/local
RUN apt-get update && apt-get install -y ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

# Copy backend code
COPY backend/ .

# Create a non-root user for running the app
RUN groupadd -r app && useradd -r -g app -d /app -s /sbin/nologin app \
    && chown -R app:app /app

ENV PATH=/usr/local/bin:$PATH
ENV PYTHONUNBUFFERED=1
ENV GUNICORN_WORKERS=2

EXPOSE 8000

# Switch to non-root user
USER app

# Use Gunicorn with Uvicorn workers for production
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-c", "gunicorn_conf.py", "app.main:app"]

# Docker healthcheck (uses PORT env var if set, otherwise defaults to 8000)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD sh -c 'PORT=${PORT:-8000} && curl -f http://127.0.0.1:${PORT}/health || exit 1'

