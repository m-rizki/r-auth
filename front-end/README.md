# Auth Example : Client

This is the frontend for the Auth Example project. It demonstrates authentication using JWT access and refresh tokens, with support for both HTTP-only cookies and Authorization headers. The frontend is built with React Router v7, TypeScript, Tailwind CSS, and Axios.

## Features

- Login and protected routes
- Access token and refresh token handling
- Axios interceptor for Authorization header
- Server-side rendering (SSR) support
- Modern UI with Tailwind CSS and DaisyUI

## Getting Started

### Prerequisites

- Node.js (v20 or newer recommended)
- The backend server from this project running (see `../back-end/README.md`)

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

### Docker

You can build and run the frontend with Docker:

```bash
docker build -t auth-example-client .
docker run -p 3000:3000 auth-example-client
```

## Environment Variables

Copy `.env.example` to `.env` and set the backend URL:

```env
VITE_CLIENT_SERVICE=http://localhost:5000
```

## Project Structure

- `app/` — Main application code (routes, components, API)
- `public/` — Static assets
- `utils/` — Utility functions

## Authentication Flow

- Login with username and password
- Access token is sent via HTTP-only cookie and/or Authorization header
- Refresh token is managed via HTTP-only cookie
- Protected routes require authentication

## License

MIT
