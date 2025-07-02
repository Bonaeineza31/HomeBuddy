const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Calling User model defined in models
const User = require('../models/authmodel.js')


// Authenticataion handling on Login Page
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Compare the provided password with the stored hash
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Generate a JSON Web Token to authenticate the user
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: '1h',
  });

router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, role, university, country, password, confirmPassword, idType, idDocument, criminalRecord } = req.body;

  // Validate the request data
  if (!firstName || !lastName || !email || !role || !password || !confirmPassword || !idType || !idDocument || !criminalRecord) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user document
  const user = new User({
    firstName,
    lastName,
    email,
    role,
    university,
    country,
    password: hashedPassword,
    idType,
    idDocument,
    criminalRecord,
  });

  try {
    // Save the user document to the database
    await user.save();

    // Generate a JSON Web Token (JWT) to authenticate the user
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user account.' });
  }
});  res.json({ token, user });
});

// Authentication handling on signup page
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, role, university, country, password, confirmPassword, idType, idDocument, criminalRecord } = req.body;

  // Validate the request data
  if (!firstName || !lastName || !email || !role || !password || !confirmPassword || !idType || !idDocument || !criminalRecord) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user document
  const user = new User({
    firstName,
    lastName,
    email,
    role,
    university,
    country,
    password: hashedPassword,
    idType,
    idDocument,
    criminalRecord,
  });

  try {
    // Save the user document to the database
    await user.save();

    // Generate a JSON Web Token (JWT) to authenticate the user
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user account.' });
  }
});

module.exports = router;
