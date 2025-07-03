import User from '../models/authmodel.js';
import { sendEmail } from '../utils/email.js';

// Get all pending registrations
export const getPendingUsers = async (req, res) => {
  const pendingUsers = await User.find({ approvalStatus: 'pending' });
  res.json(pendingUsers);
};

// Approve a user
export const approveUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.isApproved = true;
  user.approvalStatus = 'approved';
  await user.save();

  await sendEmail({
    to: user.email,
    subject: 'Your HomeBuddy Account Has Been Approved',
    html: `<p>Hello ${user.firstName},</p><p>Your account has been approved. You can now log in using your email and password.</p>`
  });

  res.json({ message: 'User approved and notified.' });
};

// Reject a user
export const rejectUser = async (req, res) => {
  const { reason } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.approvalStatus = 'rejected';
  user.rejectionReason = reason;
  await user.save();

  await sendEmail({
    to: user.email,
    subject: 'HomeBuddy Registration Rejected',
    html: `<p>Hello ${user.firstName},</p><p>Your registration has been rejected for the following reason:</p><blockquote>${reason}</blockquote>`
  });

  res.json({ message: 'User rejected and notified.' });
};
