import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authroutes.js';
import userRoutes from './routes/userroutes.js';
import profileRoutes from './routes/profileroutes.js'; 
import contactRoutes from './routes/contactRoutes.js'; 

// Load environment variables
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

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// ✅ Global Middleware
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
app.use('/auth', authRoutes);
app.use('/admin', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/profile', profileRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ API is running');
});

// ✅ Connect to MongoDB
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

// ✅ Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/`);
  });
});
