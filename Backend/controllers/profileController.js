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
    const user = await User.findById(req.user.id).select('email role profile');
    res.json({ profile: user.profile });
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch profile' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.profile = { ...user.profile, ...updates };
    await user.save();

    res.json({ message: 'Profile updated', profile: user.profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const uploadProfilePhoto = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      user.profile.photo = `/uploads/profile_photos/${req.file.filename}`;
      await user.save();

      res.json({ message: 'Photo uploaded', photo: user.profile.photo });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save photo' });
    }
  });
};




