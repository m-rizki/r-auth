const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

const SECRET_KEY = "your_jwt_secret_key"; // In production, use environment variables
const REFRESH_SECRET_KEY = "your_refresh_secret_key"; // In production, use environment variables
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
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
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, username: user.username, name: user.name },
    SECRET_KEY,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  // Save refresh token to database
  const db = readDatabase();
  db.refreshTokens.push(refreshToken);
  writeDatabase(db);

  return { accessToken, refreshToken };
};

// Login route
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Find user in the database
  const db = readDatabase();
  const user = db.users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const tokens = generateTokens(user);

  // Set tokens as HTTP-only cookies
  res.cookie("accessToken", tokens.accessToken, ACCESS_COOKIE_OPTIONS);
  res.cookie("refreshToken", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

  // Return user information (but not the tokens, as they're in cookies now)
  res.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
    },
    message: "Login successful",
  });
});

// Refresh token route
router.post("/refresh-token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
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

    const tokens = generateTokens(user);

    res.cookie("accessToken", tokens.accessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie("refreshToken", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

    res.json({ message: "Token refreshed successfully" });
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

module.exports = router;
