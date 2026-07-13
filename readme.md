# CerebroAtlas

CerebroAtlas is a healthcare records application with an Angular frontend, a Rust backend, and a PostgreSQL database. It provides a unified place to manage patients, medical records, reports, consents, audits, and administration data.

## Architecture

- Frontend: Angular 21 with Angular Material, SSR support, and Vitest.
- Backend: Rust with Axum, Tokio, SQLx, SeaORM, tracing, and CORS support.
- Database: PostgreSQL 16.
- Deployment: Docker Compose for the full stack.

## Frontend

The Angular app handles the UI for login, dashboards, patient management, medical records, consent management, audit logs, reports, and administration.

Key routes include:

- `/login`
- `/dashboard`
- `/patients`
- `/patients/new`
- `/patients/:id`
- `/medical-records`
- `/consent-management`
- `/audit-logs`
- `/reports`
- `/administration`
- `/administration/add-user`

## Backend

The Rust service starts on `127.0.0.1:8080` and loads configuration from `.env.local` first, then `.env`.

Available routes include:

- `GET /health`
- `POST /login`
- `GET /patients`, `POST /patients`
- `GET /patients/:id`, `PUT /patients/:id`, `DELETE /patients/:id`
- `GET /records`, `POST /records`
- `GET /records/:id`, `PUT /records/:id`, `DELETE /records/:id`
- `GET /analytics`
- `GET /administration`
- `POST /api/users`
- `GET /consents`
- `GET /consents/:id`, `PUT /consents/:id`

## Local Development

### Backend

1. Set `DATABASE_URL` in `backend/.env.local` or `backend/.env`.
2. From the `backend` directory, run `cargo run`.
3. Verify the service with `GET http://127.0.0.1:8080/health`.

### Frontend

1. From the `frontend` directory, run `npm install`.
2. Start the Angular app with `npm start`.
3. The frontend dev server uses the default Angular CLI configuration unless you change it.

## Docker Compose

The repository includes `docker-compose.yml` with three services:

- `frontend` on port `4200`
- `backend` on port `8080`
- `db` on port `5432`

Start the stack with:

```bash
docker compose up --build
```

## Repository Structure

- `backend/`: Rust API, migrations, and backend Dockerfile.
- `frontend/`: Angular application, SSR entry points, and frontend Dockerfile.
- `assets/`: Shared screenshots and static reference assets.

## Notes

- The backend uses SQLx migrations under `backend/migrations`.
- The frontend routes are guarded where authentication is required.
- This README reflects the current Axum-based backend rather than the earlier Actix example text.
