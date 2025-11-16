# Sentiment Analysis Application

Production-ready NLP sentiment analysis application using BERT, built with a strict two-service architecture (Frontend + Backend).

## Architecture

- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Backend**: FastAPI + Transformers (BERT) + Redis caching
- **Infrastructure**: Docker + docker-compose

## Features

- Real-time sentiment analysis using BERT model
- Redis caching for improved performance
- Rate limiting (10 requests per minute)
- Type-safe TypeScript frontend
- Comprehensive test coverage
- CI/CD with GitHub Actions
- Production-ready Docker setup

## Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for local development)

## Quick Start

### Using Docker Compose (Recommended)

```bash
docker-compose up --build
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Local Development

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start Redis (using Docker)
docker run -d -p 6379:6379 redis:7-alpine

# Run backend
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Code Quality

### Backend

```bash
cd backend
ruff check app
black app
isort app
```

### Frontend

```bash
cd frontend
npm run lint
npm run format
npm run type-check
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/analyze` - Analyze sentiment
  - Request: `{"text": "Your text here"}`
  - Response: `{"sentiment": "positive|negative|neutral", "confidence": 0.95, "probabilities": {...}}`

## Environment Variables

See `.env.example` for required environment variables.

## License

MIT

## Production

To run the stack in a production-like mode (build an image that runs `gunicorn` and does not mount the local source), use the provided compose file:

```powershell
docker-compose -f docker-compose.prod.yml up --build -d
```

Notes:

- The production compose file does not mount the backend source directory into the container; changes require rebuilding the image.
- Logs are written to stdout/stderr by Gunicorn so you can collect them with your container logging driver. Consider configuring a log aggregator or log rotation on the host.
- The Gunicorn config `backend/gunicorn_conf.py` preloads the application at startup so models are loaded once before workers fork.
