const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');

const Property = require('../models/Property');

// Approve property
router.patch('/properties/:id/approve', 
  authenticate, 
  isAdmin,
  async (req, res) => {
    try {
      const property = await Property.findByIdAndUpdate(
        req.params.id,
        { isApproved: true },
        { new: true }
      );
      res.json(property);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Get all users
router.get('/users', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;