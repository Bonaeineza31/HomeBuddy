import ContactMessage from '../models/ContactMessage.js';
import { sendEmail } from '../utils/email.js';

export const handleContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Store in DB
    const savedMessage = await ContactMessage.create({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    // Send email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Message from ${firstName} ${lastName}`,
      html: `
        <h2>New Message Received</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Message:</strong><br/> ${message}</p>
      `,
    });

    res.status(200).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Contact Error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};