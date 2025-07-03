import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from '../Backend/routes/authroutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Basic middlewares
app.use(express.json());

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/auth', authRoutes);

// // Health check route
// app.get('/', (req, res) => {
//   res.send('✅ API is running');
// });

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Start server after DB connects
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});