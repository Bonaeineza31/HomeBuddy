// routes/profileroutes.js
import express from 'express';
import { getUserProfile, updateUserProfile, uploadProfilePhoto } from '../controllers/profilecontroller.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Add logging middleware for debugging
router.use((req, res, next) => {
  console.log(`📡 Profile API: ${req.method} ${req.originalUrl}`);
  next();
});

// GET /api/profile - View logged-in user's profile
router.get('/', authenticate, getUserProfile);

// PUT /api/profile - Update profile
router.put('/', authenticate, updateUserProfile);

// POST /api/profile/photo - Upload profile photo
router.post('/profile/photo', authenticate, uploadProfilePhoto);

export default router;