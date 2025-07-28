import nodemailer from "nodemailer"

// Create reusable transporter - keep it outside to reuse connections
let transporter = null

const getTransporter = () => {
  if (!transporter) {
    // Add validation for required environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email configuration missing: EMAIL_USER and EMAIL_PASS are required")
    }

    transporter = nodemailer.createTransporter({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add connection pooling to prevent delays
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      // Add timeout settings
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
    })

    // Verify transporter configuration
    transporter.verify((error, success) => {
      if (error) {
        console.error("Email transporter verification failed:", error)
      } else {
        console.log("Email transporter is ready to send messages")
      }
    })
  }
  return transporter
}

export const sendEmail = async ({ to, subject, html }) => {
  try {
    // Input validation
    if (!to || !subject || !html) {
      throw new Error("Missing required email parameters: to, subject, html")
    }

    const emailTransporter = getTransporter()

    const mailOptions = {
      from: `"HomeBuddy Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      // Add additional options for better deliverability
      replyTo: process.env.EMAIL_USER,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
      },
    }

    const result = await emailTransporter.sendMail(mailOptions)

    console.log("Email sent successfully:", {
      messageId: result.messageId,
      to: to,
      subject: subject,
    })

    return result
  } catch (error) {
    console.error("Email sending failed:", {
      error: error.message,
      to: to,
      subject: subject,
    })
    throw error
  }
}

// Add a function to test email configuration
export const testEmailConnection = async () => {
  try {
    const transporter = getTransporter()
    await transporter.verify()
    console.log("Email connection test successful")
    return true
  } catch (error) {
    console.error("Email connection test failed:", error)
    return false
  }
}
