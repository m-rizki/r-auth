const jwt = require("jsonwebtoken");

const SECRET_KEY = "your_jwt_secret_key"; // In production, use environment variables

const authMiddleware = (req, res, next) => {
  // Get the token from cookies instead of headers
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = {
      id: decoded.id,
      username: decoded.username,
      name: decoded.name,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
