import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/authmodel.js';
import cloudinary from '../utils/cloudinary.js';

// LOGIN CONTROLLER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: 'Invalid email or password' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    res.json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// SIGNUP CONTROLLER
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, role, university, country, password, confirmPassword, idType} = req.body;

    // Validate required fields
    if (
      !firstName || !lastName || !email || !role || !password || !confirmPassword ||
      !idType || !req.files?.idDocument || !req.files?.criminalRecord
    ) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    // Upload ID Document to Cloudinary
    const idDocUpload = await cloudinary.uploader.upload(
      req.files.idDocument.tempFilePath,
      { folder: 'homebuddy/ids' }
    );

    // Upload Criminal Record to Cloudinary
    const criminalUpload = await cloudinary.uploader.upload(
      req.files.criminalRecord.tempFilePath,
      { folder: 'homebuddy/criminal_records' }
    );

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      firstName, lastName, email, role, university, country,password: hashedPassword,idType,idDocumentUrl: idDocUpload.secure_url,criminalRecordUrl: criminalUpload.secure_url, });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user account.' });
  }
};
