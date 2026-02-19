const jwt = require('jsonwebtoken');
const User = require('../models/User');

function extractToken(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return '';
  return authHeader.slice(7).trim();
}

function authenticate(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: token missing' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: invalid token' });
  }
}

async function requireAdmin(req, res, next) {
  try {
    const user = await User.findById(req.userId).select('role');
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: user not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: admin access required' });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  authenticate,
  requireAdmin
};
