require('dotenv').config();
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Setup middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Configure CORS to work with credentials
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Check if db.json exists, if not create it with initial data
if (!fs.existsSync("./db.json")) {
  const initialData = {
    users: [
      {
        id: 1,
        username: "user1",
        password: "password1",
        name: "User One",
      },
      {
        id: 2,
        username: "user2",
        password: "password2",
        name: "User Two",
      },
    ],
    refreshTokens: [],
  };

  fs.writeFileSync("./db.json", JSON.stringify(initialData, null, 2));
  console.log("Created db.json with initial data");
}

// Routes
app.use("/", authRoutes);

// Protected route example
app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "This is a protected route",
    user: req.user,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`- POST /login (authenticate user)`);
  console.log(`- GET /protected (protected route)`);
  console.log(`- POST /refresh-token (get new access token)`);
  console.log(`- GET /me (get user info)`);
});
