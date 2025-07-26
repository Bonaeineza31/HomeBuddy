import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authroutes.js';
import userRoutes from './routes/userroutes.js';
import profileRoutes from './routes/profileroutes.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ CORS Configuration
const corsOptions = {
  origin: ['https://home-buddy-eta.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

// ✅ Global Middlewares
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './tmp'
}));

// ✅ Logger
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ✅ Routes
app.use('/auth', authRoutes);        // auth/login/register
app.use('/admin', userRoutes);       // admin/user-related routes
app.use('/api', profileRoutes);      // /api/profile GET and PUT

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('✅ API is running');
});

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// ✅ Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/`);
  });
});
