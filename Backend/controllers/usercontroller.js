import User from '../models/authmodel.js';
import { sendEmail } from '../utils/email.js';

// ✅ Get all pending registrations (student & landlord only)
export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      approvalStatus: 'pending',
      role: { $in: ['student', 'landlord'] } 
    });

    res.json(pendingUsers);
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ error: 'Failed to fetch pending users' });
  }
};

// ✅ Approve a user and notify by email
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
      subject: '🎉 Welcome to HomeBuddy – Your Account Has Been Approved!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f4f4f4; border-radius: 8px;">
          <h2 style="color: #2c2c3a;">Welcome to HomeBuddy, ${user.firstName}!</h2>
          <p>Your account has been <strong>successfully approved</strong> by our team.</p>
          <p>You can now log in using your email and the password you created during registration.</p>

          <a href="https://home-buddy-eta.vercel.app/login" style="display: inline-block; background-color: #2c2c3a; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            👉 Log in to HomeBuddy
          </a>

          <p style="margin-top: 20px;">If you've forgotten your password, use the 
            <a href="https://home-buddy-eta.vercel.app/forgot-password" style="color: #2c2c3a;">Forgot Password</a> option to reset it.
          </p>

          <p style="font-size: 14px; color: #888;">This is an automated message from HomeBuddy. Please don’t reply directly to this email.</p>
        </div>
      `
    });

    console.log(`✅ User ${user.email} approved successfully`);
    res.json({ message: 'User approved and notified.' });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ error: 'Failed to approve user' });
  }
};

// ✅ Reject a user and notify with reason
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
      html: `
        <p>Hello ${user.firstName},</p>
        <p>Your registration has been rejected for the following reason:</p>
        <blockquote>${reason}</blockquote>
        <p>If you believe this was a mistake, you may contact support to clarify or reapply.</p>
      `
    });

    console.log(`✅ User ${user.email} rejected successfully`);
    res.json({ message: 'User rejected and notified.' });
  } catch (error) {
    console.error('❌ Error rejecting user:', error);
    res.status(500).json({ error: 'Failed to reject user' });
  }
};
