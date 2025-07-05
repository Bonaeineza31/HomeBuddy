import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import authRoutes from '../Backend/routes/authroutes.js';
import userRoutes from '../Backend/routes/userroutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable file upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './tmp' // You can also use '/tmp'
}));

// Basic request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
app.options('*', cors());


// Routes
app.use('/auth', authRoutes);
app.use('/admin', userRoutes);

// Optional: Health check
app.get('/', (req, res) => {
  res.send('✅ API is running');
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅Connected to MongoDB');
  } catch (error) {
    console.error(' MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Start server after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
  });
});
