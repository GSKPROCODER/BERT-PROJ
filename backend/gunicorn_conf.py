import os
import multiprocessing

# Gunicorn configuration for production
# Auto-detect optimal worker count for I/O-bound FastAPI applications
# Default: 2 workers (optimal for 2 CPU cores), can be overridden via GUNICORN_WORKERS env var
cpu_count = multiprocessing.cpu_count()
default_workers = max(2, min(cpu_count * 2, 8))  # Cap at 8 for safety
workers = int(os.environ.get("GUNICORN_WORKERS", default_workers))

# Support Railway's PORT environment variable (Railway sets PORT dynamically)
# Fallback to GUNICORN_BIND or default to 8000
port = os.environ.get("PORT", os.environ.get("GUNICORN_PORT", "8000"))
bind = os.environ.get("GUNICORN_BIND", f"0.0.0.0:{port}")

worker_class = "uvicorn.workers.UvicornWorker"
preload_app = True
timeout = 120

# Logging to stdout/stderr so containers capture logs
accesslog = "-"
errorlog = "-"
loglevel = os.environ.get("GUNICORN_LOGLEVEL", "info")
