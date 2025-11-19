# Railway Deployment Guide

This guide explains how to deploy the BERT Sentiment Analysis application to Railway.

## Overview

Railway will deploy three services:
1. **Backend** - FastAPI application (Python)
2. **Frontend** - React application (Node.js)
3. **Redis** - Caching service (provided by Railway)

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. GitHub repository with your code
3. Railway CLI (optional, for local testing)

## Deployment Steps

### Option 1: Deploy via Railway Dashboard (Recommended)

1. **Create a New Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Deploy Backend Service**
   - Click "New Service" → "GitHub Repo"
   - Select your repository
   - Railway will auto-detect the Dockerfile in `backend/`
   - Set the **Root Directory** to `backend` in service settings
   - Add environment variables (see below)

3. **Deploy Frontend Service**
   - Click "New Service" → "GitHub Repo"
   - Select the same repository
   - Set the **Root Directory** to `frontend`
   - Add environment variables (see below)

4. **Add Redis Service**
   - Click "New Service" → "Database" → "Add Redis"
   - Railway will provision a Redis instance
   - Copy the connection URL

5. **Configure Environment Variables**

   **Backend Service:**
   ```
   REDIS_URL=<redis-connection-url-from-railway>
   PORT=8000
   GUNICORN_WORKERS=2
   PYTHONUNBUFFERED=1
   ```

   **Frontend Service:**
   ```
   VITE_API_URL=<your-backend-railway-url>/api
   ```

   > **Note:** Railway automatically sets the `PORT` environment variable. The backend is configured to use it.

6. **Generate Public URLs**
   - In each service, go to "Settings" → "Networking"
   - Click "Generate Domain" to get public URLs
   - Update `VITE_API_URL` in frontend with the backend URL

### Option 2: Deploy via Railway CLI

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   railway init
   ```

4. **Link to Existing Project** (if applicable)
   ```bash
   railway link
   ```

5. **Deploy Backend**
   ```bash
   cd backend
   railway up
   ```

6. **Deploy Frontend** (in a separate terminal)
   ```bash
   cd frontend
   railway up
   ```

## Environment Variables

### Backend Service

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REDIS_URL` | Redis connection URL | - | Yes |
| `PORT` | Server port (Railway sets this automatically) | 8000 | No |
| `GUNICORN_WORKERS` | Number of Gunicorn workers | Auto-detected | No |
| `GUNICORN_LOGLEVEL` | Log level (info, debug, warning) | info | No |
| `PYTHONUNBUFFERED` | Disable Python output buffering | 1 | No |

### Frontend Service

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | - | Yes |

## Service Configuration

### Backend Service Settings

- **Root Directory:** `backend`
- **Build Command:** (auto-detected from Dockerfile)
- **Start Command:** (auto-detected from Dockerfile CMD)
- **Health Check Path:** `/health`

### Frontend Service Settings

- **Root Directory:** `frontend`
- **Build Command:** (auto-detected from Dockerfile)
- **Start Command:** (auto-detected from Dockerfile CMD)

## Networking

Railway automatically:
- Assigns a dynamic `PORT` to each service
- Provides public URLs for each service
- Handles HTTPS/SSL certificates

### Connecting Services

1. **Backend → Redis:** Use the `REDIS_URL` from Railway's Redis service
2. **Frontend → Backend:** Use the backend's public Railway URL

## Health Checks

The backend includes a health check endpoint at `/health`:
```bash
curl https://your-backend.railway.app/health
```

Railway will automatically monitor this endpoint.

## Monitoring & Logs

- **View Logs:** Railway dashboard → Service → Logs tab
- **Metrics:** Railway dashboard → Service → Metrics tab
- **Deployments:** Railway dashboard → Service → Deployments tab

## Troubleshooting

### Backend Issues

1. **Port Binding Errors**
   - Ensure `gunicorn_conf.py` uses `PORT` environment variable (already configured)
   - Check that Railway's `PORT` is being read correctly

2. **Redis Connection Issues**
   - Verify `REDIS_URL` is set correctly
   - Check Redis service is running
   - Ensure Redis URL format: `redis://default:<password>@<host>:<port>`

3. **Model Loading Timeouts**
   - Railway has a 5-minute deployment timeout
   - First deployment may take longer due to model downloads
   - Consider using Railway's persistent storage for model cache

### Frontend Issues

1. **API Connection Errors**
   - Verify `VITE_API_URL` points to backend Railway URL
   - Check CORS settings in backend (currently allows all origins)
   - Ensure backend service is running

2. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies in `package.json`

## Cost Optimization

1. **Use Railway's Free Tier:**
   - $5 free credit monthly
   - Suitable for development/testing

2. **Optimize Image Size:**
   - Already optimized (1.43 GB backend image)
   - Uses CPU-only PyTorch (saves ~3 GB)

3. **Worker Configuration:**
   - Default: 2 workers (optimal for Railway's free tier)
   - Adjust `GUNICORN_WORKERS` based on your plan

## Production Considerations

1. **Environment Variables:**
   - Use Railway's environment variable management
   - Never commit secrets to repository

2. **Database/Redis:**
   - Railway's Redis is suitable for production
   - Consider upgrading for higher availability

3. **Scaling:**
   - Railway auto-scales based on traffic
   - Monitor usage in Railway dashboard

4. **Custom Domains:**
   - Add custom domain in Railway settings
   - Railway handles SSL automatically

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app)

## Support

For Railway-specific issues, contact Railway support through their dashboard or Discord.

For application issues, check the application logs in Railway dashboard.

