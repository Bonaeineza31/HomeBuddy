import User from '/models/user.js';

// GET logged-in user's profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('email role profile');
    res.json(user.profile);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch profile' });
  }
};

// UPDATE profile
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.profile = { ...user.profile, ...updates };
    await user.save();

    res.json({ message: 'Profile updated successfully', profile: user.profile });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update profile' });
  }
};