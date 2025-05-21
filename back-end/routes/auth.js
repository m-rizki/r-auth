const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

// Cookie options for security
const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  sameSite: "strict",
  maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  // maxAge: 1 * 60 * 1000, // 1 minutes in milliseconds
};

// Helper functions
const readDatabase = () => {
  const data = fs.readFileSync("./db.json", "utf8");
  return JSON.parse(data);
};

const writeDatabase = (data) => {
  fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
};

// Generate tokens
const generateTokens = (user, accessTokenMaxAgeMinutes) => {
  // Use user-provided max age (in minutes) or default to 15
  let maxAgeMinutes = accessTokenMaxAgeMinutes || 15;
  if (typeof maxAgeMinutes === "string") maxAgeMinutes = Number(maxAgeMinutes);
  if (!Number.isInteger(maxAgeMinutes) || maxAgeMinutes <= 0) {
    throw new Error("access token duration must be a positive integer (minutes)");
  }
  const expiresIn = `${maxAgeMinutes}m`;

  const accessToken = jwt.sign(
    { id: user.id, username: user.username, name: user.name },
    SECRET_KEY,
    { expiresIn }
  );

  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  // Save refresh token to database
  const db = readDatabase();
  db.refreshTokens.push(refreshToken);
  writeDatabase(db);

  return { accessToken, refreshToken, accessTokenMaxAge: maxAgeMinutes };
};

// Login route
router.post("/login", (req, res) => {
  const { username, password, accessTokenMaxAge } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Validate accessTokenMaxAge if provided
  if (accessTokenMaxAge !== undefined) {
    const n = Number(accessTokenMaxAge);
    if (!Number.isInteger(n) || n <= 0) {
      return res.status(400).json({ message: "access token duration must be a positive integer (minutes)" });
    }
  }

  // Find user in the database
  const db = readDatabase();
  const user = db.users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Pass user-supplied max age (in minutes) if provided
  try {
    const tokens = generateTokens(user, accessTokenMaxAge);

    // Set tokens as HTTP-only cookies (accessToken maxAge matches token expiry)
    res.cookie("accessToken", tokens.accessToken, {
      ...ACCESS_COOKIE_OPTIONS,
      maxAge: tokens.accessTokenMaxAge * 60 * 1000, // ms
    });
    res.cookie("refreshToken", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

    // Return user information and access token in response (for Authorization header usage)
    res.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
      accessToken: tokens.accessToken,
      accessTokenMaxAge: tokens.accessTokenMaxAge,
      message: "Login successful",
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Refresh token route
router.post("/refresh-token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const { accessTokenMaxAge } = req.body || 15;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  // Validate accessTokenMaxAge if provided
  if (accessTokenMaxAge !== undefined) {
    const n = Number(accessTokenMaxAge);
    if (!Number.isInteger(n) || n <= 0) {
      return res.status(400).json({ message: "access token duration must be a positive integer (minutes)" });
    }
  }

  // Check if refresh token exists in database
  const db = readDatabase();
  const tokenExists = db.refreshTokens.includes(refreshToken);

  if (!tokenExists) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);

    // Find user by ID
    const user = db.users.find((u) => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Remove the old refresh token
    db.refreshTokens = db.refreshTokens.filter(
      (token) => token !== refreshToken
    );
    writeDatabase(db);

    // Pass user-supplied max age (in minutes) if provided
    const tokens = generateTokens(user, accessTokenMaxAge);

    // Set new tokens as HTTP-only cookies (accessToken maxAge matches token expiry)
    res.cookie("accessToken", tokens.accessToken, {
      ...ACCESS_COOKIE_OPTIONS,
      maxAge: tokens.accessTokenMaxAge * 60 * 1000, // ms
    });
    res.cookie("refreshToken", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

    // Return new access token in response (for Authorization header usage)
    res.json({ accessToken: tokens.accessToken, accessTokenMaxAge: tokens.accessTokenMaxAge, message: "Token refreshed successfully" });
  } catch (error) {
    // If refresh token is expired or invalid
    if (error.name === "TokenExpiredError") {
      db.refreshTokens = db.refreshTokens.filter(
        (token) => token !== refreshToken
      );
      writeDatabase(db);

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      return res.status(401).json({ message: "Refresh token expired" });
    }

    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

// Get user info
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    user: req.user,
  });
});

// Logout route
router.post("/logout", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const db = readDatabase();
    db.refreshTokens = db.refreshTokens.filter(
      (token) => token !== refreshToken
    );
    writeDatabase(db);
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out successfully" });
});

module.exports = router;
