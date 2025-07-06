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
        subject: '🎉 Welcome to HomeBuddy – Your Account Has Been Approved!',
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f4f4f4; border-radius: 8px;">
        <h2 style="color: #2c2c3a;">Welcome to HomeBuddy, ${user.firstName}!</h2>
        <p>Your account has been <strong>successfully approved</strong> by our team.</p>
      
        <p>You can now log in using your email and the password you created during registration:</p>
         <div style="background-color: #ffffff; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
        <strong>Email:</strong> ${user.email}<br/>
        <strong>Password:</strong> [Your password you registered with] 
      <p>If you've forgotten your password, simply use the <a href="http://localhost:5173/forgot-password">Forgot Password</a> option to reset it.</p>

        <br/><em style="color: #666;">(If you’ve forgotten your password, you can reset it at login)</em>
      </div>

      <a href="http://localhost:5173/login" style="display: inline-block; background-color: #2c2c3a; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
        👉 Log in to HomeBuddy
      </a>

      <p style="margin-top: 20px;">Need help getting started? Visit our <a href="http://localhost:5173" style="color: #2c2c3a;">homepage</a> to explore listings, read safety tips, and more.</p>
      
      <p style="font-size: 14px; color: #888;">This is an automated message from HomeBuddy. Please don’t reply directly to this email.</p>
    </div>
  `
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