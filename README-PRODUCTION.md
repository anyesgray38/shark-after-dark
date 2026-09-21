# Shark After Dark Production Platform

## Architecture
- GitHub Pages: public static website
- Render: private API service
- Render Postgres: customer and appointment data
- No third-party booking platform

## API
- GET /health
- GET /api/services
- GET /api/availability?service_id=1&from=...&to=...
- POST /api/appointments
- GET /api/appointments (requires X-Admin-Key)

## Required environment variables
- DATABASE_URL
- ADMIN_KEY
- FRONTEND_ORIGIN