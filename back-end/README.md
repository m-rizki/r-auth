# Auth Example API Documentation

This backend provides authentication APIs using JWT access and refresh tokens, supporting both HTTP-only cookies and Authorization headers. Users can control the access token's max age via the payload.

## Base URL

```bash
http://localhost:5000/
```

---

## Authentication Flow

- **Login:** Obtain access and refresh tokens.
- **Get current user:** Use access token (via cookie or Authorization header).
- **Refresh Token:** Get a new access token using the refresh token (cookie).
- **Logout:** Invalidate refresh token and clear cookies.

---

## Endpoints

### 1. `POST /login`

Authenticate user and receive tokens.

**Request Body:**

```json
{
  "username": "user1",
  "password": "password1",
  "accessTokenMaxAge": 30 // (optional, in minutes, default: 15)
}
```

**Response:**

- Sets `accessToken` and `refreshToken` as HTTP-only cookies.
- Returns access token and user info in JSON.

```json
{
  "user": { "id": 1, "username": "user1", "name": "User One" },
  "accessToken": "...",
  "accessTokenMaxAge": 30,
  "message": "Login successful"
}
```

### 2. `POST /refresh-token`

Get a new access token using the refresh token cookie.

**Request Body:**

```json
{
  "accessTokenMaxAge": 60 // (optional, in minutes, default: 15)
}
```

**Cookies:**

- Requires `refreshToken` cookie.

**Response:**

- Sets new `accessToken` and `refreshToken` cookies.
- Returns new access token in JSON.

```json
{
  "accessToken": "...",
  "accessTokenMaxAge": 60,
  "message": "Token refreshed successfully"
}
```

### 3. `GET /me`

Get current user info (protected route).

**Authentication:**

- Send access token via:
  - `Authorization: Bearer <accessToken>` header (preferred), or
  - `accessToken` HTTP-only cookie

**Response:**

```json
{
  "user": { "id": 1, "username": "user1", "name": "User One" }
}
```

### 4. `POST /logout`

Logout user and invalidate refresh token.

**Cookies:**

- Requires `refreshToken` cookie.

**Response:**

- Clears `accessToken` and `refreshToken` cookies.

```json
{
  "message": "Logged out successfully"
}
```

---

## Notes

- Access token can be sent via HTTP-only cookie or Authorization header. If both are present, the header is preferred.
- The `accessTokenMaxAge` parameter (in minutes) controls the access token's expiry and cookie max age. Default is 15 minutes.
- Refresh token is always stored as an HTTP-only cookie and is valid for 7 days.
- All responses are JSON.

---

## Example Users

```json
{
  "users": [
    {
      "id": 1,
      "username": "user1",
      "password": "password1",
      "name": "User One"
    },
    {
      "id": 2,
      "username": "user2",
      "password": "password2",
      "name": "User Two"
    }
  ]
}
```

---

## Error Responses

- `401 Unauthorized` for invalid or expired tokens, missing credentials, or invalid refresh tokens.
- `400 Bad Request` for missing required fields.

---

## License

MIT
