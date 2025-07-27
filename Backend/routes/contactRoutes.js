import express from 'express';
import { handleContact } from '../controllers/contactController.js';

const router = express.Router();

<<<<<<< HEAD
router.post('/contact', handleContact);
=======
router.post('/', handleContact);
>>>>>>> ec6ee404d7809c3e885cf573a043f89efb4f6254

export default router;