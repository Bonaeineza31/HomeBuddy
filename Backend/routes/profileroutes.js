// routes/profileRoutes.js
import express from 'express';
import authenticate from '../middleware/authenticate.js';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePhoto
} from '../controllers/profileController.js';

const router = express.Router();

// ✅ GET logged-in user's profile
router.get('/profile', authenticate, getUserProfile);

// ✅ PUT update profile (name, gender, hobbies, etc.)
router.put('/profile', authenticate, updateUserProfile);

// ✅ POST upload profile photo
router.post('/profile/photo', authenticate, uploadProfilePhoto);

export default router;
