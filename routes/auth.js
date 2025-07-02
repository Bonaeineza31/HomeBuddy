const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate } = require('../middlewares/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const user = new User({
      ...req.body,
      role: req.body.role || 'student'
    });
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error('Invalid login credentials');

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) throw new Error('Invalid login credentials');

    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user
router.get('/me', authenticate, (req, res) => {
  res.json(req.user);
});

module.exports = router;