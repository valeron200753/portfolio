
# TOKYO.DEV — Full-Stack Portfolio

A personal developer portfolio and full-stack learning project,
built with React, TypeScript, Node.js, Express and SQLite.

The project combines a developer portfolio with an authenticated
task management application.

## Overview

This repository contains two connected applications:

- **Frontend:** a responsive React portfolio and Task Manager.
- **Backend:** an Express REST API with authentication and SQLite storage.

It was developed during a 30-day hands-on full-stack learning
marathon and continues to evolve.

## Features

### Portfolio

- Responsive Dark Forest visual design
- Light and dark themes
- Home, Projects, Contact and Account pages
- Project search and filtering
- Individual project detail pages
- GitHub profile integration
- Contact form that prepares an email draft

### Task Manager

- Account registration and login
- Session-based authentication
- Create, view, update and delete personal tasks
- Search and filter tasks by status
- Task statistics and completion progress
- Loading, error and retry states
- Protection against duplicate requests
- Separation of tasks between users

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, React Router |
| Styling | CSS3, Responsive Design, CSS Variables |
| Backend | Node.js, Express |
| Database | SQLite |
| Testing | Node Test Runner, Vitest, React Testing Library |
| Security | HTTP-only cookies, CSRF Origin checks, Helmet, Rate Limiting |
| Tools | Git, GitHub, Linux |

## Project Structure

```text
portfolio/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── types/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── scripts/
│   ├── tests/
│   ├── database.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Requirements

- Node.js with support for `node:sqlite`
- npm
- Git

Node.js 24 or newer is recommended for this project.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/valeron200753/portfolio.git
cd portfolio
```

### 1. Start the Backend

Open a terminal:

```bash
cd backend
npm ci
npm start
```

The API runs at:

```text
http://localhost:3001
```

By default, SQLite data is stored locally in
`backend/tasks.db`.

The production database location can be configured with
the `TASKS_DB_PATH` environment variable.

### 2. Start the Frontend

Open another terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open:

```text
http://localhost:5173
```

During local development, Vite proxies requests from
`/api` to the Express Backend.

Both servers need to be running for authenticated
Task Manager features to work.

## Environment Configuration

The Backend includes `.env.example` documenting
production configuration variables.

Relevant variables include:

| Variable | Purpose |
| --- | --- |
| NODE_ENV | Application environment |
| PORT | Express server port |
| FRONTEND_ORIGINS | Allowed browser origins for unsafe API requests |
| TASKS_DB_PATH | SQLite database path |

Production configuration must use a real HTTPS frontend
origin and persistent database storage.

The frontend optionally supports:

```dotenv
VITE_CONTACT_EMAIL=your-public-email@example.com
```

Set this in `frontend/.env.local`, replacing the example
with a public contact address.

`VITE_` variables are included in the client-side
application and must not contain secrets.

The contact form uses `mailto:`. It prepares an email
draft but does not send messages automatically.

## API Overview

Authentication endpoints:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

Task endpoints:

```text
GET    /api/tasks
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

Task operations require authentication. Users can only
access tasks belonging to their own accounts.

## Testing

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

### Production Build

```bash
cd frontend
npm run build
```

### Linting

```bash
cd frontend
npm run lint
```

## Security Notes

The project includes:

- Password hashing
- Server-managed sessions
- HTTP-only session cookies
- SameSite cookie configuration
- Origin checking for state-changing API requests
- Authentication and ownership checks
- Request rate limiting
- Security headers using Helmet
- Automated Backend and Frontend tests

These measures provide a foundation, but public deployment
requires additional environment-specific review.

Before production deployment:

- Enable HTTPS
- Configure the reverse proxy correctly
- Set trusted frontend origins
- Use persistent storage for SQLite
- Configure and test database backups
- Review rate limiting for the deployment architecture
- Verify cookie security and deployment configuration

## Project Status

**Active development**

The application runs locally. The interface and
documentation are being refined for portfolio use.

A public deployment URL will be added after deployment
and verification.

## Developer

**Tokyo** — Junior Full-Stack Developer

GitHub: https://github.com/valeron200753
```
