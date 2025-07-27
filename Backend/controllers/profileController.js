// controllers/profilecontroller.js
import User from '../models/user.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/profile_photos';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, req.user.id + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).single('photo');

export const getUserProfile = async (req, res) => {
  try {
    console.log('Getting profile for user:', req.user.id);
    
    const user = await User.findById(req.user.id).select('email role profile');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

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
    console.error(' Error fetching profile:', err);
    res.status(500).json({ error: 'Unable to fetch profile' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    console.log('Updating profile for user:', req.user.id);
    console.log('Update data:', req.body);
    
    const updates = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

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
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      console.log('Uploading photo for user:', req.user.id);
      console.log('File details:', req.file);
      
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Initialize profile if it doesn't exist
      if (!user.profile) {
        user.profile = {};
      }

      user.profile.photo = `/uploads/profile_photos/${req.file.filename}`;
      await user.save();

      console.log('Photo uploaded successfully');
      res.json({ message: 'Photo uploaded', photo: user.profile.photo });
    } catch (err) {
      console.error(' Error saving photo:', err);
      res.status(500).json({ error: 'Failed to save photo' });
    }
  });
};