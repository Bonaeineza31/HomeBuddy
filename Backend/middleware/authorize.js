import jwt from 'jsonwebtoken';
HEAD
import User from '/models/user.js';
import User from '/models/user.js';
b34d1ddc6a42d9d54ebe66ad450531785966bf18

const auth = async (req, res, next) => {
  try {
    // Get token from cookie or git Authorization header
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and ensure the token is valid
    const user = await User.findOne({ _id: decoded.id, 'tokens.token': token });
    if (!user) {
      return res.status(401).json({ error: 'Invalid token or user not found.' });
    }

    // Attach user and token to request object
    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    console.error('❌ Auth middleware error:', err.message);
    res.status(403).json({ error: 'Unauthorized access. Token invalid or expired.' });
  }
};

export default auth;
