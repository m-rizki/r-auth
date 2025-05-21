const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
  // Prefer access token from Authorization header if both are present, fallback to cookie
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

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
