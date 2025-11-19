# Contributing to Sentiment Analysis Application

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

### Prerequisites
- Python 3.11+
- Node.js 20+
- Docker and Docker Compose
- Git

### Getting Started

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/sentiment-analysis-app.git
   cd sentiment-analysis-app
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

## Code Quality

### Backend (Python)

We use the following tools for code quality:

- **ruff**: Fast Python linter
- **black**: Code formatter
- **isort**: Import sorter
- **pytest**: Testing framework

Run checks before committing:
```bash
cd backend
ruff check app
black app
isort app
pytest
```

### Frontend (TypeScript/React)

- **ESLint**: Linting
- **TypeScript**: Type checking
- **Jest**: Testing
- **Prettier**: Code formatting

Run checks:
```bash
cd frontend
npm run lint
npm run type-check
npm test
npm run format
```

## Testing

### Backend Tests
```bash
cd backend
pytest --cov=app --cov-report=html
```

### Frontend Tests
```bash
cd frontend
npm test -- --coverage
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clear, concise commit messages
   - Add tests for new features
   - Update documentation as needed

3. **Run all checks**
   - Ensure all tests pass
   - Run linters and formatters
   - Check that the app builds successfully

4. **Submit a pull request**
   - Provide a clear description of changes
   - Reference any related issues
   - Ensure CI checks pass

## Coding Standards

### Python
- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions and classes
- Keep functions focused and small

### TypeScript/React
- Use functional components with hooks
- Prefer TypeScript strict mode
- Use meaningful variable names
- Keep components small and reusable

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── models/       # ML model loaders
│   │   ├── services/     # Business logic
│   │   └── main.py       # FastAPI app
│   └── tests/            # Backend tests
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── types/        # TypeScript types
│   │   └── App.tsx       # Main app
│   └── tests/            # Frontend tests
└── docker-compose.yml    # Docker orchestration
```

## Adding New Features

### Backend API Endpoint
1. Add route in `backend/app/api/`
2. Implement service logic in `backend/app/services/`
3. Add tests in `backend/tests/`
4. Update API documentation

### Frontend Component
1. Create component in `frontend/src/components/`
2. Add TypeScript types in `frontend/src/types/`
3. Write tests in `frontend/src/components/__tests__/`
4. Update parent components as needed

## ML Model Updates

When updating or adding ML models:
1. Ensure CPU-only PyTorch compatibility
2. Test model loading and inference
3. Update model documentation in README
4. Consider memory and performance impact

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Questions about the codebase
- Suggestions for improvements

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
