// controllers/profileController.js
import User from '../models/User.js';
import cloudinary from 'cloudinary';
import fs from 'fs';

// ✅ GET user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -tokens');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ UPDATE profile fields
export const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password -tokens');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
};

// ✅ Upload profile photo using Cloudinary
export const uploadProfilePhoto = async (req, res) => {
  try {
    const file = req.files?.photo;
    if (!file) return res.status(400).json({ error: 'No photo uploaded' });

    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: 'profile_photos'
    });

    // Update user photo
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { photo: result.secure_url },
      { new: true }
    ).select('-password -tokens');

    fs.unlinkSync(file.tempFilePath);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Photo upload failed' });
  }
};
