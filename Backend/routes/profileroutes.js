
import express from 'express';
import { getUserProfile, updateUserProfile, uploadProfilePhoto } from '../controllers/profileController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// GET /api/profile - View logged-in user's profile
router.get('/', authenticate, getUserProfile);

// PUT /api/profile - Update profile (optional)
router.put('/', authenticate, updateUserProfile);

router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
router.post('/profile/photo', authenticate, uploadProfilePhoto);


export default router;
