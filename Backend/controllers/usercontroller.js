import User from '../models/authmodel.js';
import { sendEmail } from '../utils/email.js';

export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ approvalStatus: 'pending' });
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending users' });
  }
};

export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.isApproved = true;
    user.approvalStatus = 'approved';
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Your HomeBuddy Account Has Been Approved',
      html: `<p>Hello ${user.firstName},</p><p>Your account has been approved.</p>`
    });

    res.json({ message: 'User approved and notified.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve user' });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.approvalStatus = 'rejected';
    user.rejectionReason = reason;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'HomeBuddy Registration Rejected',
      html: `<p>Hello ${user.firstName},</p><blockquote>${reason}</blockquote>`
    });

    res.json({ message: 'User rejected and notified.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject user' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
};
