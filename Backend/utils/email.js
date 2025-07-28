import nodemailer from 'nodemailer';

// Create reusable transporter - keep it outside to reuse connections
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      // Add connection pooling to prevent delays
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });
  }
  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const emailTransporter = getTransporter();
    
    const result = await emailTransporter.sendMail({
      from: `"HomeBuddy Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};