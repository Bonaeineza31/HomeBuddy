import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authroutes.js';
import userRoutes from './routes/userroutes.js';
import profileRoutes from './routes/profileroutes.js'; 
import contactRoutes from './routes/contactRoutes.js'; 
import propertyRoutes from './routes/properties.js'; 

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Get current directory (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: ['https://home-buddy-eta.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './tmp'
}));

// Swagger Configuration - Load YAML file from docs folder
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Home Buddy API Documentation"
}));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/admin', userRoutes);
app.use('/contact', contactRoutes);
app.use('/api', profileRoutes);
app.use('/properties', propertyRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Home Buddy API is running',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`
  });
});

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
});