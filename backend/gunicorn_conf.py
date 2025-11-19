import os
import multiprocessing

# Gunicorn configuration for production
# For ML model apps, use single worker with preload to avoid loading models multiple times
# This prevents OOM issues when each worker tries to load large models independently
default_workers = 1  # Single worker for memory-constrained environments
workers = int(os.environ.get("GUNICORN_WORKERS", default_workers))

# Support Railway's PORT environment variable (Railway sets PORT dynamically)
# Fallback to GUNICORN_BIND or default to 8000
port = os.environ.get("PORT", os.environ.get("GUNICORN_PORT", "8000"))
bind = os.environ.get("GUNICORN_BIND", f"0.0.0.0:{port}")

worker_class = "uvicorn.workers.UvicornWorker"
preload_app = True  # Load models once before forking workers to save memory
timeout = 300  # Increased timeout for model loading
graceful_timeout = 120  # Give workers time to finish requests during shutdown

# Logging to stdout/stderr so containers capture logs
accesslog = "-"
errorlog = "-"
loglevel = os.environ.get("GUNICORN_LOGLEVEL", "info")
