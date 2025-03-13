const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req) => {
  console.log('Authorization Header:', req.headers.authorization);
  const token = req.headers.authorization?.split(' ')[1] || '';

  if (!token) {
    console.log('No token provided');
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);
    const user = await User.findById(decoded.id);
    return user ? user.toObject() : null;
  } catch (err) {
    console.error('Auth error:', err);
    return null;
  }
};


module.exports = authMiddleware;