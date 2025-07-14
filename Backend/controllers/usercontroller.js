import User from '../models/authmodel.js';
import { sendEmail } from '../utils/email.js';

// Get all pending registrations
export const getPendingUsers = async (req, res) => {
  try {
    console.log(' Fetching pending users...');
    const pendingUsers = await User.find({ approvalStatus: 'pending' });
    console.log(` Found ${pendingUsers.length} pending users`);
    res.json(pendingUsers);
  } catch (error) {
    console.error(' Error fetching pending users:', error);
    res.status(500).json({ error: 'Failed to fetch pending users' });
  }
};

// Approve a user
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isApproved = true;
    user.approvalStatus = 'approved';
    await user.save();

    // Send approval email
    await sendEmail({
      to: user.email,
      subject: 'Your HomeBuddy Account Has Been Approved',
      html: `<p>Hello ${user.firstName},</p><p>Your account has been approved. You can now log in using your email and password.</p>`
    });

    console.log(` User ${user.email} approved successfully`);
    res.json({ message: 'User approved and notified.' });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ error: 'Failed to approve user' });
  }
};

// Reject a user
export const rejectUser = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.approvalStatus = 'rejected';
    user.rejectionReason = reason;
    await user.save();

    // Send rejection email
    await sendEmail({
      to: user.email,
      subject: 'HomeBuddy Registration Rejected',
      html: `<p>Hello ${user.firstName},</p><p>Your registration has been rejected for the following reason:</p><blockquote>${reason}</blockquote>`
    });

    console.log(`✅ User ${user.email} rejected successfully`);
    res.json({ message: 'User rejected and notified.' });
  } catch (error) {
    console.error('❌ Error rejecting user:', error);
    res.status(500).json({ error: 'Failed to reject user' });
  }
};

// ✅ Get logged-in user's profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
};

