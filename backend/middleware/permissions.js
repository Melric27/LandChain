/**
 * Permission middleware for role-based access control.
 *
 * Reads the role from the `x-user-role` request header.
 * Valid roles: "admin", "user"
 * Default (if header missing): "user"
 */

function extractRole(req, _res, next) {
  const role = (req.headers['x-user-role'] || 'user').toLowerCase();
  req.userRole = ['admin', 'user'].includes(role) ? role : 'user';
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.userRole !== role) {
      return res.status(403).json({
        success: false,
        error: `Access denied. "${role}" role required. Your role: "${req.userRole}".`,
      });
    }
    next();
  };
}

module.exports = { extractRole, requireRole };
