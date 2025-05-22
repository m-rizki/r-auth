# r-auth : Server

This backend provides authentication APIs using JWT access and refresh tokens, supporting both HTTP-only cookies and Authorization headers. You can use either or both, depending on your frontend config.

---

## Features

- JWT authentication (access & refresh tokens)
- HTTP-only cookie and Authorization header support
- Simple file-based user/token storage (`db.json`)
- CORS for local dev
- Easily configurable via `.env`

---

## Endpoints

- `POST /login` — Authenticate user, set tokens (cookie/header)
- `POST /refresh-token` — Get new access token (cookie/header)
- `GET /me` — Get user info (protected)
- `POST /logout` — Invalidate refresh token, clear cookies

---

## API Spec

### POST /login

- **Description:** Authenticate user and receive access/refresh tokens.
- **Request Body:**

  ```json
  {
    "username": "user1",
    "password": "password1",
    "accessTokenMaxAge": 30 // (optional, in minutes, default: 15)
  }
  ```

- **Response:**

  - Sets `accessToken` and `refreshToken` as HTTP-only cookies (and/or returns token in response if using header)
  - Returns user info and access token:

  ```json
  {
    "user": { "id": 1, "username": "user1", "name": "User One" },
    "accessToken": "...",
    "accessTokenMaxAge": 30,
    "message": "Login successful"
  }
  ```

### POST /refresh-token

- **Description:** Get a new access token using the refresh token cookie.
- **Request Body:**

  ```json
  {
    "accessTokenMaxAge": 60 // (optional, in minutes, default: 15)
  }
  ```

- **Cookies:** Requires `refreshToken` cookie
- **Response:**

  - Sets new `accessToken` and `refreshToken` cookies (and/or returns token in response if using header)
  - Returns new access token:

  ```json
  {
    "accessToken": "...",
    "accessTokenMaxAge": 60,
    "message": "Token refreshed successfully"
  }
  ```

### GET /me

- **Description:** Get current user info (protected route).
- **Authentication:**
  - Send access token via HTTP-only cookie or Authorization header
- **Response:**

  ```json
  {
    "user": { "id": 1, "username": "user1", "name": "User One" }
  }
  ```

### POST /logout

- **Description:** Logout user and invalidate refresh token.
- **Cookies:** Requires `refreshToken` cookie
- **Response:**

  - Clears `accessToken` and `refreshToken` cookies

  ```json
  {
    "message": "Logged out successfully"
  }
  ```

---

## Usage

1. Copy `.env.example` to `.env` and set your secrets
2. Install dependencies: `npm install`
3. Start server: `npm run dev`

---

## Example Users

See `db.json` for demo users:

- user1 / password1
- user2 / password2

---

## License

MIT
