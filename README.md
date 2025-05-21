# Auth Example (Monorepo)

This project demonstrates a full-stack authentication system using JWT access and refresh tokens, with both HTTP-only cookies and Authorization headers. It consists of a React frontend and an Express backend.

## Structure

- `front-end/` — React + React Router v7 client (see `front-end/README.md`)
- `back-end/` — Express.js API server (see `back-end/README.md`)

## Quick Start

### 1. Clone the repository

```bash
git clone <repo-url>
cd auth-example
```

### 2. Start the backend

```bash
cd back-end
cp .env.example .env
npm install
npm run dev
```

### 3. Start the frontend

```bash
cd ../front-end
cp .env.example .env
npm install
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

## Authentication Flow

- **Login:** Obtain access and refresh tokens
- **Get current user:** Use access token (via cookie or Authorization header)
- **Refresh token:** Get a new access token using the refresh token (cookie)
- **Logout:** Invalidate refresh token and clear cookies

See each subfolder's README for more details.

## License

MIT
