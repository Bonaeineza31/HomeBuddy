import express from 'express';
import { login, signup,forgotPassword,resetPassword } from '../controllers/authcontroller.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);
export default router;
