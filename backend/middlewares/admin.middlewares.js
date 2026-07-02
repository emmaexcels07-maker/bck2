export const authorizeAdmin = (req, res, next) => {
  // Assuming 'protect' middleware has already attached the user to req.user
  if (req.user && req.user.role === 'admin') {
    next(); // Pass to the next function
  } else {
    res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
};