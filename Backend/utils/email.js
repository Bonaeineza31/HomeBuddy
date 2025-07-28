import nodemailer from "nodemailer"

// OPTIMIZED EMAIL CONFIGURATION FOR FASTER DELIVERY
let transporter = null

const getTransporter = () => {
  if (!transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email configuration missing: EMAIL_USER and EMAIL_PASS are required")
    }

    console.log("Creating email transporter...")
    transporter = nodemailer.createTransporter({
      service: "gmail", // Use service instead of manual config for better reliability
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Optimized settings for faster delivery
      pool: false, // Disable pooling for immediate sending
      maxConnections: 1,
      maxMessages: 1,
      rateDelta: 1000, // 1 second between emails
      rateLimit: 5, // max 5 emails per rateDelta
      // Timeout settings
      connectionTimeout: 30000, // 30 seconds
      greetingTimeout: 15000, // 15 seconds
      socketTimeout: 30000, // 30 seconds
    })

    // Test connection immediately
    transporter.verify((error, success) => {
      if (error) {
        console.error("Email transporter verification failed:", error)
      } else {
        console.log("Email transporter verified and ready")
      }
    })
  }
  return transporter
}

export const sendEmail = async ({ to, subject, html }) => {
  const startTime = Date.now()
  console.log(`Starting email send to: ${to}`)

  try {
    if (!to || !subject || !html) {
      throw new Error("Missing required email parameters: to, subject, html")
    }

    const emailTransporter = getTransporter()

    const mailOptions = {
      from: `"HomeBuddy" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      // Priority settings for faster delivery
      priority: "high",
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
      },
    }

    console.log("Sending email with options:", {
      to: mailOptions.to,
      subject: mailOptions.subject,
      from: mailOptions.from,
    })

    const result = await emailTransporter.sendMail(mailOptions)
    const endTime = Date.now()

    console.log("Email sent successfully:", {
      messageId: result.messageId,
      to: to,
      subject: subject,
      timeTaken: `${endTime - startTime}ms`,
      response: result.response,
    })

    return result
  } catch (error) {
    const endTime = Date.now()
    console.error("Email sending failed:", {
      error: error.message,
      to: to,
      subject: subject,
      timeTaken: `${endTime - startTime}ms`,
      stack: error.stack,
    })
    throw error
  }
}

// Test email function
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
