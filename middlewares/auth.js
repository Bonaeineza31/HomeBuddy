const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  authenticate: async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) throw new Error('Authentication required');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: decoded.id, 'tokens.token': token });

      if (!user) throw new Error('User not found');
      
      req.token = token;
      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  },

  authorize: (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Required role: ${roles.join(' or ')}` 
      });
    }
    next();
  },

  // Pre-defined role checks
  isStudent: (req, res, next) => module.exports.authorize(['student'])(req, res, next),
  isLandlord: (req, res, next) => module.exports.authorize(['landlord'])(req, res, next),
  isAdmin: (req, res, next) => module.exports.authorize(['admin'])(req, res, next),
  isLandlordOrAdmin: (req, res, next) => module.exports.authorize(['landlord', 'admin'])(req, res, next),
  isStudentOrLandlord: (req, res, next) => module.exports.authorize(['student', 'landlord'])(req, res, next)
};