// middleware/authorize.js

// Middleware to check if the user has the required role
const authorize = (requiredRole) => {
  return (req, res, next) => {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Ensure the user has the correct role
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // User is authorized
    next();
  };
};

export default authorize; // ✅ THIS LINE FIXES THE ERROR
