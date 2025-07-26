 HEAD
// routes/profileRoute.js
backend
import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

 HEAD
// GET /api/profile - View logged-in user's profile
router.get('/', authenticate, getProfile);

// PUT /api/profile - Update profile (optional)
router.put('/', authenticate, updateProfile);

router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
router.post('/profile/photo', authenticate, uploadProfilePhoto);
backend

export default router;
