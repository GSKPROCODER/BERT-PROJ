#!/usr/bin/env bash
# Start script for Railpack / simple shell detection
# Runs the backend using Gunicorn and the provided config

set -euo pipefail

# Allow overriding the command via environment
if [ "$#" -gt 0 ]; then
  exec "$@"
fi

exec gunicorn -c gunicorn_conf.py app.main:app
