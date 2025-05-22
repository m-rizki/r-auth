# Auth Example : Client

This is the frontend for the Auth Example project. It demonstrates flexible authentication using JWT access and refresh tokens, with support for HTTP-only cookies, Authorization headers, or both. Built with React Router v7, TypeScript, Tailwind CSS, and Axios.

---

## Features

- Login, logout, and protected routes
- Flexible Axios config: use cookies, Authorization header, or both
- Modern UI with Tailwind CSS and DaisyUI
- SSR-ready, Docker-ready

---

## Usage

- By default, the app uses HTTP-only cookies for authentication.
- To use Authorization header or both, change the import in your code:

```typescript
import apiWithCredentials from "~/api/axios"; // cookies (default)
import { apiWithAuthHeader } from "~/api/axios"; // header
import { apiWithBoth } from "~/api/axios"; // both
```

1. Copy `.env.example` to `.env` and set your environment
2. Install dependencies: `npm install`
3. Start server: `npm run dev`

---

## Authentication Flow

- Login: POST `/login` (tokens set as cookies or returned in response)
- Access protected: GET `/me`
- Refresh Token : POST `/refresh-token` (Get new access token)
- Logout: POST `/logout`

---

## Project Structure

- `app/` — Main app code (routes, components, API, and axios configuration)
- `public/` — Static assets
- `utils/` — Utility functions

---

---

## License

MIT
