# Quick Start Guide

Get the Sentiment Analysis Application running in under 5 minutes!

## 🚀 Fastest Way (Docker Compose)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sentiment-analysis-app.git
cd sentiment-analysis-app

# Start all services
docker-compose up --build
```

**That's it!** Open http://localhost:3000 in your browser.

> ⏱️ First startup takes 2-3 minutes to download ML models (~1GB)

## 📝 Try It Out

1. Open http://localhost:3000
2. Enter some text, for example:
   ```
   This product is amazing because it works exactly as advertised. 
   However, the price is quite high compared to competitors.
   ```
3. Click "Analyze Sentiment"
4. Explore the results:
   - Overall sentiment (positive/negative/neutral)
   - Dominant emotion
   - Aspect-based analysis
   - Advanced insights (emotional arc, rhetorical intent)

## 🔍 API Testing

### Using curl (Linux/Mac)
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "I love this product!"}'
```

### Using PowerShell (Windows)
```powershell
$body = @{text="I love this product!"} | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:8000/api/analyze -Method Post -Body $body -ContentType "application/json"
```

### Interactive API Docs
Visit http://localhost:8000/docs for Swagger UI

## 🛠️ Development Mode

### Backend Only
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

# Start Redis
docker run -d -p 6379:6379 redis:7-alpine

# Run backend
uvicorn app.main:app --reload
```

### Frontend Only
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173 (Vite default)

## 🧪 Running Tests

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

## 🐛 Troubleshooting

### Port Already in Use
- **Frontend (3000)**: Change in docker-compose.yml: `"3001:80"`
- **Backend (8000)**: Change in docker-compose.yml: `"8001:8000"`
- **Redis (7000)**: Already mapped to avoid Windows conflicts

### Models Not Loading
- Check internet connection (models download on first run)
- Ensure 4GB+ RAM available
- Check disk space (~2GB needed for models)

### Docker Issues
```bash
# Clean restart
docker-compose down
docker-compose up --build

# Remove all containers and volumes
docker-compose down -v
```

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- Explore the API at http://localhost:8000/docs
- Try different text samples to see various analysis features

## 💡 Example Texts to Try

**Positive Sentiment:**
```
I absolutely love this new feature! It's incredibly intuitive and saves me so much time.
```

**Mixed Sentiment with Critique:**
```
The product works well and the design is beautiful. However, the customer support 
needs improvement because response times are too slow.
```

**Evidence-Based:**
```
Research shows that customer satisfaction increased by 40%. The data demonstrates 
clear improvements in user engagement and retention rates.
```

**Emotional Content:**
```
I'm so frustrated with this situation. Despite multiple attempts to resolve the issue,
nothing has changed. This is extremely disappointing.
```

Enjoy analyzing! 🎉
