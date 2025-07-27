// controllers/profilecontroller.js
import User from '../models/user.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/profile_photos';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Get userId from token or request body
    const userId = req.user?.id || req.body.userId || 'default_user';
    cb(null, userId + path.extname(file.originalname));
  }
});

// Add file filter and size limits
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    fieldSize: 2 * 1024 * 1024, // 2MB for non-file fields
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  }
}).single('photo');

// Helper function to get user from token or query
const getUserFromRequest = async (req) => {
  let userId;
  
  // Try to get user from JWT token first
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      userId = decoded.userId || decoded.id;
    } catch (err) {
      console.log('Token verification failed:', err.message);
    }
  }
  
  // Fallback to query parameter or request body
  if (!userId) {
    userId = req.query.userId || req.body.userId;
  }
  
  if (!userId) {
    // Get the first user as default (for testing)
    const user = await User.findOne().select('email role profile');
    return user;
  }
  
  return await User.findById(userId).select('email role profile');
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Getting profile for user:', user._id);

    // Initialize profile if it doesn't exist
    if (!user.profile) {
      user.profile = {
        name: '',
        nationality: '',
        gender: 'Prefer not to say',
        bio: '',
        budget: '',
        preference: '',
        hobbies: [],
        photo: ''
      };
      await user.save();
    }

    console.log('Profile retrieved successfully');
    res.json({ profile: user.profile });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Unable to fetch profile' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Updating profile for user:', user._id);
    console.log('Update data:', req.body);

    const updates = { ...req.body };
    delete updates.userId; // Remove userId from updates

    // Initialize profile if it doesn't exist
    if (!user.profile) {
      user.profile = {};
    }

    // Update profile with new data
    user.profile = { ...user.profile, ...updates };
    await user.save();

    console.log('Profile updated successfully');
    res.json({ message: 'Profile updated', profile: user.profile });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const uploadProfilePhoto = (req, res) => {
  console.log('Photo upload request received');
  console.log('Headers:', req.headers);
  console.log('Content-Type:', req.headers['content-type']);
  
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      
      // Handle specific multer errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
      }
      if (err.code === 'LIMIT_FIELD_VALUE') {
        return res.status(400).json({ error: 'Field value too large.' });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ error: 'Unexpected field. Use "photo" as field name.' });
      }
      
      return res.status(400).json({ error: err.message });
    }

    console.log('Multer processing completed');
    console.log('Request body:', req.body);
    console.log('File info:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Make sure to use "photo" as the field name.' });
    }

    try {
      const user = await getUserFromRequest(req);

      if (!user) {
        // Clean up uploaded file if user not found
        if (req.file && req.file.path) {
          fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting file:', unlinkErr);
          });
        }
        return res.status(404).json({ error: 'User not found' });
      }

      console.log('Uploading photo for user:', user._id);
      console.log('File details:', {
        originalname: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      });

      // Initialize profile if it doesn't exist
      if (!user.profile) {
        user.profile = {};
      }

      // Delete old photo if it exists
      if (user.profile.photo) {
        const oldPhotoPath = path.join(process.cwd(), 'uploads', 'profile_photos', path.basename(user.profile.photo));
        fs.unlink(oldPhotoPath, (unlinkErr) => {
          if (unlinkErr) console.log('Old photo deletion failed (file may not exist):', unlinkErr.message);
          else console.log('Old photo deleted successfully');
        });
      }

      user.profile.photo = `/uploads/profile_photos/${req.file.filename}`;
      await user.save();

      console.log('Photo uploaded successfully');
      res.json({ 
        message: 'Photo uploaded successfully', 
        photo: user.profile.photo,
        filename: req.file.filename
      });
    } catch (err) {
      console.error('Error saving photo:', err);
      
      // Clean up uploaded file on error
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting file after save error:', unlinkErr);
        });
      }
      
      res.status(500).json({ error: 'Failed to save photo' });
    }
  });
};