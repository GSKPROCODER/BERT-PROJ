# Sentiment Analysis Application

[![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Production-ready NLP sentiment analysis application using RoBERTa transformers, built with a modern full-stack architecture.

> **📝 Setup Note**: After cloning, replace `YOUR_USERNAME/YOUR_REPO` in this README with your actual GitHub repository path to enable the CI badge.

## Architecture

- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Backend**: FastAPI + Transformers (RoBERTa) + Redis caching
- **Infrastructure**: Docker + Docker Compose
- **ML Models**: CPU-optimized PyTorch with RoBERTa-based models

## Features

### Core Analysis
- **Sentiment Analysis**: Multi-class sentiment detection (positive, negative, neutral)
- **Emotion Detection**: 7-emotion classification (joy, sadness, anger, fear, surprise, disgust, neutral)
- **Aspect-Based Analysis**: Extract and analyze specific aspects from text
- **Rhetorical Intent**: Detect claim, justification, critique, explanation, and evidence patterns

### Advanced Insights
- **Emotional Arc**: Visualize emotion intensity progression across sentences
- **Rhetorical Intent Analysis**: Detect patterns in text structure
  - Claim: Assertive statements and declarations
  - Justification: Reasoning and causal relationships
  - Critique: Contrasting viewpoints and objections
  - Explanation: Clarifications and examples
  - Evidence: Supporting data and research references
- **Confidence Metrics**: Detailed probability scores for all predictions
- **Key Phrase Extraction**: Identify important aspects and topics

### Technical Features
- Redis caching for improved performance
- Rate limiting (10 requests per minute)
- Type-safe TypeScript frontend
- Comprehensive test coverage (backend & frontend)
- CI/CD with GitHub Actions
- Production-ready Docker setup
- CPU-optimized for cost-effective deployment

## Prerequisites

- **Docker and Docker Compose** (recommended for easiest setup)
- **Node.js 20+** (for local frontend development)
- **Python 3.11+** (for local backend development)
- **4GB+ RAM** (for running ML models)

## Quick Start

> 📖 **New to the project?** Check out the [Quick Start Guide](QUICK_START.md) for a step-by-step walkthrough!

### Using Docker Compose (Recommended)

```bash
docker-compose up --build
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (Interactive Swagger UI)
- **Redis**: localhost:7000 (mapped from internal 6379)

**Note**: First startup may take 2-3 minutes as models are downloaded and loaded.

### Local Development

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install CPU-optimized PyTorch
pip install --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

# Start Redis (using Docker)
docker run -d -p 6379:6379 redis:7-alpine

# Run backend with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server will run on http://localhost:5173 (Vite default).

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

### Health Check
- `GET /health` - Service health status

### Analysis Endpoints
- `POST /api/analyze` - Complete sentiment analysis
  - Request: `{"text": "Your text here"}`
  - Response: Sentiment, emotion, and aspect analysis

- `POST /api/sentiment` - Sentiment only
  - Response: `{"sentiment": "positive|negative|neutral", "scores": {...}}`

- `POST /api/emotion` - Emotion detection only
  - Response: `{"emotion": "joy|sadness|anger|...", "probabilities": {...}}`

- `POST /api/aspects` - Aspect-based analysis only
  - Response: `{"aspects": [...], "total_aspects": N}`

Visit http://localhost:8000/docs for interactive API documentation.

## Environment Variables

Key environment variables:

- `REDIS_URL` - Redis connection URL (default: `redis://localhost:6379`)
- `VITE_API_URL` - Frontend API endpoint (default: `http://localhost:8000/api`)
- `PORT` - Backend port (default: `8000`)

See `.env.example` for complete configuration options.

## ML Models

This application uses CPU-optimized PyTorch with the following models:

- **Sentiment**: `cardiffnlp/twitter-roberta-base-sentiment-latest`
- **Emotion**: `j-hartmann/emotion-english-distilroberta-base`
- **NLP Processing**: spaCy `en_core_web_sm`

Models are automatically downloaded on first run and cached locally.

## Performance Optimization

### CPU-Only PyTorch
The application uses CPU-optimized PyTorch builds to:
- Reduce Docker image size (~500MB smaller)
- Lower memory footprint
- Enable deployment on cost-effective CPU-only infrastructure
- Maintain good inference performance for text analysis

### Caching Strategy
- Redis caches analysis results for identical text inputs
- Reduces redundant model inference
- Configurable TTL for cache entries

## CI/CD

GitHub Actions workflow includes:
- **Backend**: Linting (ruff, black, isort), type checking, pytest with coverage
- **Frontend**: ESLint, TypeScript checking, Jest tests, build verification
- **Caching**: Optimized dependency caching for faster builds
- **CPU-only PyTorch**: Faster CI runs with smaller dependencies

## GitHub Setup

### For Your Friends to Replicate

1. **Fork or Clone the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/sentiment-analysis-app.git
   cd sentiment-analysis-app
   ```

2. **Update the README Badge**
   - Replace `YOUR_USERNAME/YOUR_REPO` in the CI badge URL with your actual GitHub path

3. **Run Locally**
   ```bash
   docker-compose up --build
   ```
   That's it! The app will be available at http://localhost:3000

4. **Share with Friends**
   - They just need Docker installed
   - Share your GitHub repository URL
   - They run `docker-compose up --build`
   - No additional configuration needed!

### Pushing to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Sentiment Analysis Application"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

After pushing, GitHub Actions will automatically run tests on every commit.

## Deployment

### Docker Compose (Recommended)
```bash
docker-compose up --build
```

### Production Considerations
- Use environment variables for configuration
- Set up proper logging and monitoring
- Configure Redis persistence if needed
- Consider horizontal scaling for high traffic
- Use a reverse proxy (nginx/traefik) for SSL termination

## Troubleshooting

### Port Conflicts (Windows)
If you encounter port binding errors on Windows:
- Ports 6379-6460 may be reserved by Windows
- The docker-compose.yml uses port 7000 for Redis to avoid this
- Check reserved ports: `netsh interface ipv4 show excludedportrange protocol=tcp`

### Model Loading
- First startup downloads ~1GB of models
- Subsequent starts are faster (models cached)
- Ensure adequate disk space and internet connection

### Memory Issues
- Minimum 4GB RAM recommended
- Models load into memory on startup
- Consider reducing worker count if memory-constrained

## License

MIT
