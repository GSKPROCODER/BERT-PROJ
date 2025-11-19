# Root Dockerfile for Railway Deployment
# Backend-first build strategy

# ============================
# BUILDER IMAGE
# ============================
FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install backend dependencies
COPY backend/requirements-prod.txt ./requirements-prod.txt
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements-prod.txt \
    && python -m pip install --no-cache-dir \
    https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.0/en_core_web_sm-3.7.0-py3-none-any.whl \
    && find /usr/local -depth \( -type d -a -name __pycache__ -o -name test -o -name tests \) -exec rm -rf '{}' + 2>/dev/null || true \
    && rm -rf /root/.cache/pip


# ============================
# RUNTIME IMAGE
# ============================
FROM python:3.11-slim

WORKDIR /app

COPY --from=builder /usr/local /usr/local

RUN apt-get update && apt-get install -y \
    ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

# Copy backend source code
COPY backend/ .

# Create non-root user
RUN groupadd -r app && useradd -r -g app -d /app -s /sbin/nologin app \
    && chown -R app:app /app

ENV PATH=/usr/local/bin:$PATH
ENV PYTHONUNBUFFERED=1
ENV GUNICORN_WORKERS=2

# Expose default port (Railway overrides this)
EXPOSE 8000

USER app

# ============================
# FIXED PRODUCTION CMD
# ============================
# Backend structure: /app/app/main.py (backend/ copied to /app/)
# FastAPI app instance: app.main:app
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-c", "gunicorn_conf.py", "app.main:app"]


# ============================
# HEALTHCHECK
# ============================
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD sh -c 'PORT=${PORT:-8000} && curl -f http://127.0.0.1:${PORT}/health || exit 1'
# End of Dockerfile