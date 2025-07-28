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

    // ✅ Auto-approve admin on login if not already approved
    if (user.role === 'admin' && !user.isApproved) {
      user.isApproved = true;
      user.approvalStatus = 'approved';
      await user.save();
    }

    // ✅ Block unapproved users (except admin)
    if (!user.isApproved && user.role !== 'admin') {
      return res.status(403).json({
        error: 'Your account is not approved yet. Please wait for admin approval.'
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
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

    // Validate fields
    if (
      !firstName || !lastName || !email || !role || !password ||
      !confirmPassword || !idType || !req.files?.idDocument || !req.files?.criminalRecord
    ) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

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

    // Upload files
    const idDocUpload = await cloudinary.uploader.upload(
      req.files.idDocument.tempFilePath,
      { folder: 'homebuddy/ids' }
    );

    const criminalUpload = await cloudinary.uploader.upload(
      req.files.criminalRecord.tempFilePath,
      { folder: 'homebuddy/criminal_records' }
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    // Auto-approve if admin
    const isAdmin = role === 'admin';

    const userData = {
      firstName,
      lastName,
      email,
      role,
      university: role === 'student' ? university : undefined,
      country,
      password: hashedPassword,
      idType,
      idDocumentUrl: idDocUpload.secure_url,
      criminalRecordUrl: criminalUpload.secure_url,
      isApproved: isAdmin,
      approvalStatus: isAdmin ? 'approved' : 'pending',
    };

    const user = new User(userData);
    await user.save();

    // Send admin notification in background (don't await to prevent delays)
    if (!isAdmin) {
      sendEmail({
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
      }).catch(err => console.error('Failed to send admin notification:', err));
    }

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

// FORGOT PASSWORD CONTROLLER
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User with this email does not exist' });
    }

    // Check if user is approved - only approved users can reset passwords
    if (!user.isApproved && user.role !== 'admin') {
      return res.status(403).json({
        error: 'Your account is not approved yet. Password reset is not available.'
      });
    }

    // Generate password reset token
    const resetToken = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        type: 'password_reset'
      },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Send password reset email immediately
    await sendEmail({
      to: email,
      subject: '🔐 Password Reset Request - HomeBuddy',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.firstName} ${user.lastName},</p>
        <p>We received a request to reset your password for your HomeBuddy account.</p>
        <p>Click the link below to reset your password (valid for 1 hour):</p>
        <p>
          <a href="https://home-buddy-eta.vercel.app/resetpassword?token=${resetToken}" 
             target="_blank" 
             style="background-color: #2c2c3a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>HomeBuddy Team</p>
      `
    });

    res.json({
      message: 'Password reset link has been sent to your email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to send password reset email' });
  }
};

// RESET PASSWORD CONTROLLER
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ error: 'Invalid token type' });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({
      message: 'Password reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};