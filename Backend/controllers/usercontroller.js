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
      subject: ' Welcome to HomeBuddy - Your Account Has Been Approved!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c2c3a; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
              <div style="width: 50px; height: 3px; background-color: #4CAF50; margin: 15px auto;"></div>
            </div>
            
            <p style="color: #333; font-size: 18px; line-height: 1.6;">Hello <strong>${user.firstName} ${user.lastName}</strong>,</p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Great news! Your HomeBuddy account has been <strong style="color: #4CAF50;">approved</strong> and is now active.
            </p>
            
            <div style="background-color: #f0f8f0; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4CAF50;">
              <h3 style="color: #2c2c3a; margin: 0 0 10px 0;">What's Next?</h3>
              <ul style="color: #333; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Log in to your account and complete your profile</li>
                <li style="margin-bottom: 8px;">${user.role === 'student' ? 'Start browsing available accommodations' : 'Begin listing your properties'}</li>
                <li style="margin-bottom: 8px;">Connect with other members of the HomeBuddy community</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://home-buddy-eta.vercel.app/login" 
                 style="background-color: #2c2c3a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
                Login to Your Account
              </a>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h4 style="color: #2c2c3a; margin: 0 0 10px 0;">Account Details:</h4>
              <p style="color: #666; margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Role:</strong> ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
              ${user.university ? `<p style="color: #666; margin: 5px 0;"><strong>University:</strong> ${user.university}</p>` : ''}
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5; margin-top: 30px;">
              If you have any questions or need assistance, feel free to contact our support team. We're here to help make your HomeBuddy experience amazing!
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                Welcome to the HomeBuddy family! <br>
                <strong>The HomeBuddy Team</strong>
              </p>
            </div>
          </div>
        </div>
      `
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
