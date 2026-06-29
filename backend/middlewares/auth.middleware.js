import jwt from "jsonwebtoken";

export function protect(req, res, next) {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required"
      });
    }

    const token = auth.split(" ")[1];
    const secret = process.env.JWT_SECRET || process.env.JWT_SECRETE;

    if (!secret) {
      console.error("JWT secret not configured");
      return res.status(500).json({
        success: false,
        message: "Server configuration error"
      });
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
}

export function adminOnly(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Authorization error"
    });
  }
}
