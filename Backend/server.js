require('dotenv').config();
const express = require('express');
const app = express();

// ===== Middleware =====
app.use(express.json());

// ===== Dummy /api/auth/register Route =====
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Simulate success response (no DB)
  return res.status(201).json({
    message: 'User registered successfully',
    user: {
      username,
      email
    }
  });
});

// ===== Health Check Route =====
app.get('/', (req, res) => {
  res.send('HomeBuddy API v1.0 is running');
});

// ===== Error Handling =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
