const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'renovation_connect_secret_prod_key';

/**
 * Middleware to parse JWT tokens from the Authorization header and attach the decoded user payload to req.user.
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }
      req.user = user;
      next();
    });
  } else {
    next();
  }
};

/**
 * Middleware to require authentication for protected routes.
 */
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required' });
  }
  next();
};

/**
 * Middleware to restrict access to specific roles (case-insensitive).
 * @param {string[]} allowedRoles - List of allowed roles, e.g. ['Homeowner', 'Worker', 'Admin']
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }
    const userRole = (req.user.role || '').toLowerCase();
    const rolesLower = allowedRoles.map(role => role.toLowerCase());
    if (!rolesLower.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

module.exports = {
  authenticateJWT,
  requireAuth,
  requireRole
};
