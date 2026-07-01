const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function authenticate(req, res, next) {
  console.log("Authorization Header:", req.headers.authorization);

  const auth = req.headers.authorization || "";

  if (!auth) {
    return res.status(401).json({ error: "Missing auth header" });
  }

  const parts = auth.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Invalid auth header" });
  }

  try {
    req.user = jwt.verify(parts[1], JWT_SECRET);
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      error: "Invalid token",
    });
  }
}

module.exports = authenticate;
