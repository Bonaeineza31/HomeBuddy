const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const Property = require('../models/Property');

// Get all properties (public)
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find({ isApproved: true });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create property (landlord/admin only)
router.post('/', 
  authenticate, 
  authorize(['landlord', 'admin']),
  async (req, res) => {
    try {
      const property = new Property({
        ...req.body,
        owner: req.user._id
      });
      await property.save();
      res.status(201).json(property);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Get property details (public)
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) throw new Error('Property not found');
    res.json(property);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;