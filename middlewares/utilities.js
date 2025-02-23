import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Unauthorized: Invalid token" });
    }

    // ✅ Ensure decoded token has `id` property
    if (!decoded.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Token missing user ID" });
    }

    req.user = decoded; // ✅ Correctly set `req.user.id`
    next();
  });
}

export default authenticateToken;
