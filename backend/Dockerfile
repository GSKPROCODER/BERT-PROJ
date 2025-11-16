FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements-prod.txt .
RUN pip install --no-cache-dir -r requirements-prod.txt \
    && python -m pip install --no-cache-dir \
    https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.0/en_core_web_sm-3.7.0-py3-none-any.whl

FROM python:3.11-slim

WORKDIR /app

COPY --from=builder /usr/local /usr/local
RUN apt-get update && apt-get install -y ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

COPY . .

# Create a non-root user for running the app
RUN groupadd -r app && useradd -r -g app -d /app -s /sbin/nologin app \
    && chown -R app:app /app

ENV PATH=/usr/local/bin:$PATH
ENV PYTHONUNBUFFERED=1
ENV GUNICORN_WORKERS=4

EXPOSE 8000

# Switch to non-root user
USER app

# Use Gunicorn with Uvicorn workers for production, using config file
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-c", "gunicorn_conf.py", "app.main:app"]

# Docker healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD curl -f http://127.0.0.1:8000/health || exit 1

