FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements-prod.txt .

RUN pip install --no-cache-dir -r requirements-prod.txt \
    && python -m pip install --no-cache-dir \
    https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.0/en_core_web_sm-3.7.0-py3-none-any.whl \
    && find /usr/local -depth \
    \( -type d -a -name __pycache__ -o -name test -o -name tests \) \
    -exec rm -rf '{}' + \
    && rm -rf /root/.cache/pip

FROM python:3.11-slim

RUN groupadd -r app && useradd -r -g app -d /app -s /sbin/nologin app

WORKDIR /app

COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    && rm -rf /usr/share/doc/* /usr/share/man/* /usr/share/locale/* \
    && rm -rf /var/lib/apt/lists/*

COPY --chown=app:app backend/ .

USER app

ENV PATH="/usr/local/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV GUNICORN_WORKERS=4

EXPOSE 8000

CMD ["gunicorn", "-c", "gunicorn_conf.py", "app.main:app"]