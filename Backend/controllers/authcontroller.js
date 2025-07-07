import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/authmodel.js';
import cloudinary from '../utils/cloudinary.js';
import { sendEmail } from '../utils/email.js';

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

    // 🚫 Check approval
    if (!user.isApproved || user.approvalStatus !== 'approved') {
      return res.status(403).json({
        error: 'Your account is pending approval. Please wait for admin verification.',
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Set secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 3600000, // 1 hour
    });

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// SIGNUP CONTROLLER
export const signup = async (req, res) => {
  try {
    const {
      firstName, lastName, email, role, university,
      country, password, confirmPassword, idType
    } = req.body;

    // Required field validation
    if (
      !firstName || !lastName || !email || !role || !password ||
      !confirmPassword || !idType || !req.files?.idDocument || !req.files?.criminalRecord
    ) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    // Student-specific check
    if (role === 'student' && !university) {
      return res.status(400).json({ error: 'University is required for students.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Upload files to Cloudinary
    const idDocUpload = await cloudinary.uploader.upload(
      req.files.idDocument.tempFilePath,
      { folder: 'homebuddy/ids' }
    );

    const criminalUpload = await cloudinary.uploader.upload(
      req.files.criminalRecord.tempFilePath,
      { folder: 'homebuddy/criminal_records' }
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      firstName,
      lastName,
      email,
      role,
      country,
      password: hashedPassword,
      idType,
      idDocumentUrl: idDocUpload.secure_url,
      criminalRecordUrl: criminalUpload.secure_url,
      isApproved: false,
      approvalStatus: 'pending',
    };

    // Include university only if student
    if (role === 'student') {
      userData.university = university;
    }

    const user = new User(userData);
    await user.save();

    // Notify Admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `🔔 New ${role} Registration - Approval Needed`,
      html: `
      <h3>New ${role.charAt(0).toUpperCase() + role.slice(1)} Registered</h3>
      <p>Please review and approve or reject this new account:</p>
    <ul>
      <li><strong>Name:</strong> ${firstName} ${lastName}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Role:</strong> ${role}</li>
      ${role === 'student' ? `<li><strong>University:</strong> ${university}</li>` : ''}
      <li><strong>Country:</strong> ${country}</li>
      <li><strong>ID Type:</strong> ${idType}</li>
    </ul>
  <p>
    👉 <a href="https://home-buddy-eta.vercel.app/admin" target="_blank" style="font-weight: bold; color: #2c2c3a;">
      Go to Admin Dashboard
    </a>
  </p>
`
,
    });

    res.status(201).json({
      message: 'Account created. Awaiting admin approval.',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user account.' });
  }
};
