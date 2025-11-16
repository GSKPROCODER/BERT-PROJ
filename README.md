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
