import os

# Gunicorn configuration for production
workers = int(os.environ.get("GUNICORN_WORKERS", "4"))
bind = os.environ.get("GUNICORN_BIND", "0.0.0.0:8000")
worker_class = "uvicorn.workers.UvicornWorker"
preload_app = True
timeout = 120

# Logging to stdout/stderr so containers capture logs
accesslog = "-"
errorlog = "-"
loglevel = os.environ.get("GUNICORN_LOGLEVEL", "info")
