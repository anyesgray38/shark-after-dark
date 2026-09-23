# Shark After Dark Production Platform

## Architecture
- GitHub Pages: public static website
- Render: private API service
- Render Postgres: customer and appointment data
- No third-party booking platform

`render.yaml` is the reproducible Render Blueprint for the API and Postgres database. Apply it from the public GitHub repository, then set the generated `ADMIN_KEY` secret in Render. The public frontend continues to use the API hostname through `NEXT_PUBLIC_API_BASE_URL` or its production default.

## API
- GET /health
- GET /api/services
- GET /api/availability?service_id=1&from=...&to=...
- POST /api/appointments
- GET /api/appointments (requires X-Admin-Key)
- GET /api/admin/metrics (requires X-Admin-Key)
- PATCH /api/appointments/:id (requires X-Admin-Key; status or notes)

## Required environment variables
- DATABASE_URL
- ADMIN_KEY
- FRONTEND_ORIGIN

## AEGIS integration

The private AEGIS Control Center can manage this service through its server-side Shark Ops proxy. Configure the AEGIS web service with `SHARK_API_URL` pointing to this API and `SHARK_ADMIN_KEY` matching `ADMIN_KEY`. The admin key must never be exposed to the public GitHub Pages frontend or browser JavaScript.
