import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/authmodel.js"
import cloudinary from "../utils/cloudinary.js"
import { sendEmail } from "../utils/email.js"
import mongoose from "mongoose" // Declare mongoose variable

// FORGOT PASSWORD CONTROLLER - ENHANCED DEBUGGING VERSION
export const forgotPassword = async (req, res) => {
  console.log("=== FORGOT PASSWORD REQUEST START ===")
  console.log("Request body:", req.body)
  console.log("Environment check:", {
    hasSecretKey: !!process.env.SECRET_KEY,
    hasEmailUser: !!process.env.EMAIL_USER,
    hasEmailPass: !!process.env.EMAIL_PASS,
    mongoConnected: !!mongoose.connection.readyState,
  })

  try {
    const { email } = req.body

    // Step 1: Input validation
    console.log("Step 1: Validating input...")
    if (!email) {
      console.log("Error: No email provided")
      return res.status(400).json({ error: "Email is required" })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("Error: Invalid email format")
      return res.status(400).json({ error: "Please enter a valid email address" })
    }
    console.log("Step 1: Input validation passed")

    // Step 2: Check environment variables
    console.log("Step 2: Checking environment variables...")
    if (!process.env.SECRET_KEY) {
      console.log("Error: SECRET_KEY not found")
      return res.status(500).json({ error: "Server configuration error" })
    }
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Error: Email configuration missing")
      return res.status(500).json({ error: "Email service not configured" })
    }
    console.log("Step 2: Environment variables OK")

    // Step 3: Database query
    console.log("Step 3: Searching for user...")
    const user = await User.findOne({ email })
    if (!user) {
      console.log("User not found, but returning success for security")
      return res.status(200).json({
        message: "If an account with this email exists, a password reset link has been sent.",
      })
    }
    console.log("Step 3: User found:", { id: user._id, email: user.email, role: user.role })

    // Step 4: Check user approval
    console.log("Step 4: Checking user approval...")
    if (!user.isApproved && user.role !== "admin") {
      console.log("User not approved")
      return res.status(403).json({
        error: "Your account is not approved yet. Password reset is not available.",
      })
    }
    console.log("Step 4: User approval check passed")

    // Step 5: Generate token
    console.log("Step 5: Generating reset token...")
    const resetToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        type: "password_reset",
      },
      process.env.SECRET_KEY,
      { expiresIn: "15m" },
    )
    console.log("Step 5: Token generated successfully")

    // Step 6: Update user in database
    console.log("Step 6: Updating user with reset token...")
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000)
    await user.save()
    console.log("Step 6: User updated successfully")

    // Step 7: Send email
    console.log("Step 7: Attempting to send email...")
    try {
      const emailResult = await sendEmail({
        to: email,
        subject: "Password Reset Request - HomeBuddy",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>Hello ${user.firstName} ${user.lastName},</p>
            <p>We received a request to reset your password for your HomeBuddy account.</p>
            <p>Click the link below to reset your password (valid for 15 minutes):</p>
            <p>
              <a href="https://home-buddy-eta.vercel.app/resetpassword?token=${resetToken}" 
                 target="_blank" 
                 style="background-color: #2c2c3a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </p>
            <p>If you didn't request this reset, please ignore this email.</p>
            <p>Best regards,<br>HomeBuddy Team</p>
          </div>
        `,
      })

      console.log("Step 7: Email sent successfully:", emailResult.messageId)
      console.log("=== FORGOT PASSWORD REQUEST SUCCESS ===")

      res.json({
        message: "Password reset link has been sent to your email",
      })
    } catch (emailError) {
      console.error("Step 7: Email sending failed:", emailError)

      // Clear the reset token if email fails
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save()

      return res.status(500).json({
        error: "Failed to send password reset email. Please try again later.",
      })
    }
  } catch (error) {
    console.error("=== FORGOT PASSWORD REQUEST ERROR ===")
    console.error("Error details:", error)
    console.error("Error stack:", error.stack)
    res.status(500).json({ error: "Internal server error. Please try again later." })
  }
}

// RESET PASSWORD CONTROLLER
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" })
    }

    const hasUpperCase = /[A-Z]/.test(newPassword)
    const hasLowerCase = /[a-z]/.test(newPassword)
    const hasNumbers = /\d/.test(newPassword)

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return res.status(400).json({
        error: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY)
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError)
      return res.status(400).json({ error: "Invalid or expired reset token" })
    }

    if (decoded.type !== "password_reset") {
      return res.status(400).json({ error: "Invalid token type" })
    }

    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (user.resetPasswordToken !== token) {
      return res.status(400).json({ error: "Invalid reset token" })
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ error: "Reset token has expired" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    console.log(`Password reset successfully for user: ${user.email}`)

    res.json({
      message: "Password reset successfully. You can now login with your new password.",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    res.status(500).json({ error: "Internal server error. Please try again later." })
  }
}

// LOGIN CONTROLLER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: "Invalid email or password" })

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) return res.status(401).json({ error: "Invalid email or password" })

    if (user.role === "admin" && !user.isApproved) {
      user.isApproved = true
      user.approvalStatus = "approved"
      await user.save()
    }

    if (!user.isApproved && user.role !== "admin") {
      return res.status(403).json({
        error: "Your account is not approved yet. Please wait for admin approval.",
      })
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" })

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// SIGNUP CONTROLLER
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, role, university, country, password, confirmPassword, idType } = req.body

    if (
      !firstName ||
      !lastName ||
      !email ||
      !role ||
      !password ||
      !confirmPassword ||
      !idType ||
      !req.files?.idDocument ||
      !req.files?.criminalRecord
    ) {
      return res.status(400).json({ error: "Please fill in all required fields." })
    }

    if (role === "student" && !university) {
      return res.status(400).json({ error: "University is required for students." })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ error: "Email already registered." })
    }

    const idDocUpload = await cloudinary.uploader.upload(req.files.idDocument.tempFilePath, { folder: "homebuddy/ids" })
    const criminalUpload = await cloudinary.uploader.upload(req.files.criminalRecord.tempFilePath, {
      folder: "homebuddy/criminal_records",
    })

    const hashedPassword = await bcrypt.hash(password, 10)

    const isAdmin = role === "admin"
    const userData = {
      firstName,
      lastName,
      email,
      role,
      university: role === "student" ? university : undefined,
      country,
      password: hashedPassword,
      idType,
      idDocumentUrl: idDocUpload.secure_url,
      criminalRecordUrl: criminalUpload.secure_url,
      isApproved: isAdmin,
      approvalStatus: isAdmin ? "approved" : "pending",
    }

    const user = new User(userData)
    await user.save()

    if (!isAdmin) {
      sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New ${role} Registration - Approval Needed`,
        html: `
          <h3>New ${role.charAt(0).toUpperCase() + role.slice(1)} Registered</h3>
          <p>Please review and approve or reject this new account:</p>
          <ul>
            <li><strong>Name:</strong> ${firstName} ${lastName}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Role:</strong> ${role}</li>
            ${role === "student" ? `<li><strong>University:</strong> ${university}</li>` : ""}
            <li><strong>Country:</strong> ${country}</li>
            <li><strong>ID Type:</strong> ${idType}</li>
          </ul>
          <p>
            <a href="https://home-buddy-eta.vercel.app/admin" target="_blank">
              Go to Admin Dashboard
            </a>
          </p>
        `,
      }).catch((err) => console.error("Failed to send admin notification:", err))
    }

    res.status(201).json({
      message: "Account created. Awaiting admin approval.",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ error: "Failed to create user account." })
  }
}
