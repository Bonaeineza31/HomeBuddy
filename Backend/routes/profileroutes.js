import express from 'express';
import authenticate from '../middleware/authenticate.js';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePhoto
} from '../controllers/profileController.js';

const router = express.Router();

router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
router.post('/profile/photo', authenticate, uploadProfilePhoto);

export default router;
