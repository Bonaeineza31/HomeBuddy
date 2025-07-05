import express from 'express';
import {
  getPendingUsers,
  approveUser,
  rejectUser
} from '../controllers/usercontroller.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();


router.use(authenticate, authorize('admin'));

router.get('/pending', getPendingUsers);

router.post('/approve/:id', approveUser);

router.post('/reject/:id', rejectUser);

export default router;
