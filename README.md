# Auth Example

A full-stack authentication system demonstrating flexible, JWT authentication using both HTTP-only cookies and Authorization headers. Built with React (frontend) and Express.js (backend), this project lets you choose your preferred authentication method with minimal code changes.

---

## Features

- Secure login, logout, and protected routes
- JWT access & refresh token flow
- Automatic token refresh on the frontend
- Flexible: supports HTTP-only cookies, Authorization header, or both
- Simple file-based user/token storage (no DB required)
- Modern UI with React, Tailwind CSS, DaisyUI
- Ready for SSR and Docker

---

## Tech Stack

**Frontend:**

- React 19, React Router v7, TypeScript
- Axios (flexible: cookies, header, or both)
- Tailwind CSS, DaisyUI, React Hook Form, Lucide React Icons, Vite

**Backend:**

- Node.js (Express.js), JSON Web Token (jsonwebtoken)
- dotenv, cookie-parser, cors, body-parser
- File-based storage (`db.json`)

---

## Project Structure

- `front-end/` — React client (see `front-end/README.md`)
- `back-end/` — Express.js API server (see `back-end/README.md`)

---

## Quick Start

1. Clone the repo
2. Start the backend:

   ```bash
   cd back-end
   cp .env.example .env
   npm install
   npm run dev
   ```

3. Start the frontend:

   ```bash
   cd ../front-end
   cp .env.example .env
   npm install
   npm run dev
   ```

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:5000>

---

## Authentication Flow

- **Login:** User logs in, receives access and refresh tokens (as cookies, tokens, or both)
- **Access Protected Route:** If the access token is valid, user proceeds. If expired, frontend auto-refreshes and retries
- **Logout:** Both tokens are invalidated and cleared

---

## Flexible Authentication

You can choose your preferred authentication method in the frontend by switching the API instance import:

```typescript
// Cookie-based (default)
import apiWithCredentials from "~/api/axios";

// Authorization header
import { apiWithAuthHeader } from "~/api/axios";

// Both
import { apiWithBoth } from "~/api/axios";
```

All token refresh, storage, and header logic is handled for you. See `front-end/app/api/axios.ts` for details.

---

## License

MIT
