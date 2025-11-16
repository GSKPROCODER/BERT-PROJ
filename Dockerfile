FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy only production requirements and install
COPY backend/requirements-prod.txt ./requirements-prod.txt
RUN pip install --no-cache-dir -r requirements-prod.txt \
    && python -m pip install --no-cache-dir \
    https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.0/en_core_web_sm-3.7.0-py3-none-any.whl

FROM python:3.11-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /usr/local /usr/local

RUN apt-get update && apt-get install -y ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

# Copy application source (backend only)
COPY backend/ .

# Create a non-root user
RUN groupadd -r app && useradd -r -g app -d /app -s /sbin/nologin app \
    && chown -R app:app /app

ENV PATH=/usr/local/bin:$PATH
ENV PYTHONUNBUFFERED=1
ENV GUNICORN_WORKERS=4

EXPOSE 8000

# Default command (can be overridden by Railway)
CMD ["gunicorn", "-c", "gunicorn_conf.py", "app.main:app"]
