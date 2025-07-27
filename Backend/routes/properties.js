import express from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  togglePropertyStatus,
  getPropertiesByOwner
} from '../controllers/propertycontroller.js';

// Import middleware (you'll need to create these)
// import { protect, authorize } from '../middleware/auth.js';
// import { validateProperty } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Protected routes (uncomment when you have auth middleware)
// router.use(protect); // All routes below require authentication

// Property CRUD operations
router.post('/create', createProperty); // Create property
router.put('/:id', updateProperty); // Update property
router.delete('/:id', deleteProperty); // Delete property

// Property status management
router.patch('/:id/toggle-status', togglePropertyStatus); // Toggle active status

// Owner-specific routes
router.get('/owner/:userId', getPropertiesByOwner); // Get properties by owner

// Admin-only routes (uncomment when you have role-based auth)
// router.patch('/:id/approve', authorize('admin'), approveProperty); // Approve property

export default router;