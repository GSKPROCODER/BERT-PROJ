# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Rhetorical Intent Analysis**: New advanced insight feature that detects claim, justification, critique, explanation, and evidence patterns in text
- **Enhanced keyword detection**: Expanded pattern matching for more accurate rhetorical intent classification
- **Quick Start Guide**: New QUICK_START.md for faster onboarding
- **Contributing Guide**: New CONTRIBUTING.md with development guidelines
- **Model caching in CI**: GitHub Actions now caches Hugging Face models for faster builds
- **Comprehensive documentation**: Updated README with detailed feature descriptions, troubleshooting, and deployment guides

### Changed
- **CPU-only PyTorch**: Optimized for CPU-only deployment to reduce image size and costs
- **Requirements organization**: Better organized requirements.txt with comments and sections
- **Docker Compose**: Updated Redis port mapping to 7000 to avoid Windows port conflicts
- **CI/CD optimization**: Added dependency caching and CPU-optimized PyTorch installation
- **README structure**: Reorganized with clearer sections and better examples
- **.gitignore**: Added ML model cache directories and test files

### Removed
- **Railway deployment files**: Removed railway.toml, .railwayignore, and Railway-specific configs
- **Railway documentation**: Removed RAILWAY_DEPLOYMENT.md
- **Temporary docs**: Removed DEPLOYMENT_VERIFICATION.md and FRONTEND_IMPROVEMENTS.md

### Fixed
- **Rhetorical intent showing 0%**: Fixed normalization logic and expanded keyword patterns
- **TypeScript compilation**: Removed unused variables in AdvancedInsightsPanel component
- **Port conflicts on Windows**: Changed Redis port mapping to avoid reserved port ranges

## [1.0.0] - 2024-11-19

### Initial Release
- Sentiment analysis using RoBERTa models
- Emotion detection (7 emotions)
- Aspect-based sentiment analysis
- React + TypeScript frontend
- FastAPI backend
- Redis caching
- Rate limiting
- Docker Compose setup
- GitHub Actions CI/CD
- Comprehensive test coverage
