const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "url_shortener_secret_jwt_key_2025";

// Middleware to extract and verify user token if present (does not block requests)
function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    req.user = null;
  }

  next();
}

// Middleware to require authentication (blocks unauthenticated requests)
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: Please log in to continue" });
  }
  next();
}

module.exports = {
  authenticateUser,
  requireAuth,
  JWT_SECRET,
};
