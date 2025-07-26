// routes/profileRoute.js
import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// GET /api/profile - View logged-in user's profile
router.get('/', authenticate, getProfile);

// PUT /api/profile - Update profile (optional)
router.put('/', authenticate, updateProfile);

export default router;
