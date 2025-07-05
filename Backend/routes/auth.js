// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const authenticate = require('../middleware/auth');
// const authorize = require('../middleware/roles');

// // In-memory users for demo
// const users = [];
// const SECRET = process.env.JWT_SECRET || 'fallbacksecret';

// // Register
// router.post('/register', async (req, res) => {
//   const { username, email, password, role } = req.body;

//   if (!username || !email || !password || !role) {
//     return res.status(400).json({ error: 'All fields (username, email, password, role) are required' });
//   }

//   const existing = users.find(u => u.email === email);
//   if (existing) {
//     return res.status(400).json({ error: 'User already exists' });
//   }

//   const hashed = await bcrypt.hash(password, 10);
//   const user = {
//     id: users.length + 1,
//     username,
//     email,
//     password: hashed,
//     role: role.toLowerCase(),
//   };

//   users.push(user);
//   const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' });

//   res.status(201).json({ user: { id: user.id, username, email, role: user.role }, token });
// });

// // Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   const user = users.find(u => u.email === email);
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(400).json({ error: 'Invalid credentials' });
//   }

//   const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
//   res.json({ user: { id: user.id, username: user.username, email, role: user.role }, token });
// });

// // Me route
// router.get('/me', authenticate, (req, res) => {
//   res.json({ user: req.user });
// });

// // Example protected role-based routes
// router.get('/student/view-listings', authenticate, authorize('student'), (req, res) => {
//   res.json({ message: 'Student can view listings and contact landlords' });
// });

// router.post('/landlord/post-listing', authenticate, authorize('landlord'), (req, res) => {
//   res.json({ message: 'Landlord can post property listings' });
// });

// router.get('/admin/dashboard', authenticate, authorize('admin'), (req, res) => {
//   res.json({ message: 'Admin can view all listings and users' });
// });

// module.exports = router;
