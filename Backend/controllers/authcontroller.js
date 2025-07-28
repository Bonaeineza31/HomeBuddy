import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/authmodel.js"
import cloudinary from "../utils/cloudinary.js"
import { sendEmail } from "../utils/email.js"

// LOGIN CONTROLLER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: "Invalid email or password" })

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) return res.status(401).json({ error: "Invalid email or password" })

    // ✅ Block unapproved users (except admin)
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

    // Validate fields
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

    // Upload files
    const idDocUpload = await cloudinary.uploader.upload(req.files.idDocument.tempFilePath, { folder: "homebuddy/ids" })
    const criminalUpload = await cloudinary.uploader.upload(req.files.criminalRecord.tempFilePath, {
      folder: "homebuddy/criminal_records",
    })

    const hashedPassword = await bcrypt.hash(password, 10)

    // Auto-approve if admin
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

    // Notify admin (if not an admin registering)
    if (!isAdmin) {
      try {
        await sendEmail({
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
              <a href="https://home-buddy-eta.vercel.app/admin" target="_blank" style="font-weight: bold; color: #2c2c3a;">
                Go to Admin Dashboard
              </a>
            </p>
          `,
        })
      } catch (emailError) {
        console.error("Failed to send admin notification:", emailError)
        // Don't fail the signup if email fails
      }
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

// FORGOT PASSWORD CONTROLLER - MATCHING YOUR ORIGINAL STRUCTURE
export const forgotPassword = async (req, res) => {
  console.log("Forgot password request received:", req.body)

  try {
    const { email } = req.body

    if (!email) {
      console.log("No email provided")
      return res.status(400).json({ error: "Email is required" })
    }

    console.log("Looking for user with email:", email)

    // Check if user exists and is approved (matching your original logic)
    const user = await User.findOne({ email, isApproved: true })
    if (!user) {
      console.log("User not found or not approved")
      return res.status(404).json({ error: "User with this email does not exist or account is not approved" })
    }

    console.log("User found:", user.firstName, user.lastName)

    // Generate password reset token (using SECRET_KEY to match your setup)
    const resetToken = jwt.sign(
      {
        email: user.email,
        userId: user._id,
        type: "password_reset",
      },
      process.env.SECRET_KEY, // Using SECRET_KEY instead of JWT_SECRET
      { expiresIn: "1h" },
    )

    console.log("Reset token generated, attempting to send email...")

    // Send password reset email
    try {
      await sendEmail({
        to: email,
        subject: "Password Reset Request - HomeBuddy",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c2c3a;">Password Reset Request</h2>
            <p>Hello ${user.firstName} ${user.lastName},</p>
            <p>We received a request to reset your password for your HomeBuddy account.</p>
            <p>Click the button below to reset your password (valid for 1 hour):</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://home-buddy-eta.vercel.app/resetpassword?token=${resetToken}"
                 target="_blank"
                 style="background-color: #2c2c3a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>Best regards,<br>HomeBuddy Team</p>
          </div>
        `,
      })

      console.log("Password reset email sent successfully")

      return res.status(200).json({
        message: "Password reset link has been sent to your email",
      })
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError)
      return res.status(500).json({ error: "Failed to send password reset email" })
    }
  } catch (error) {
    console.error("Forgot password error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// RESET PASSWORD CONTROLLER - MATCHING YOUR ORIGINAL STRUCTURE
export const resetPassword = async (req, res) => {
  console.log("Reset password request received:", req.body)

  try {
    const { token, newPassword, confirmPassword } = req.body

    // Validate inputs
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ error: "Both new password and confirm password are required" })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" })
    }

    try {
      // Verify the reset token (using SECRET_KEY to match your setup)
      const decoded = jwt.verify(token, process.env.SECRET_KEY)

      if (decoded.type !== "password_reset") {
        return res.status(400).json({ error: "Invalid token type" })
      }

      console.log("Token verified for user:", decoded.email)

      // Find the user
      const user = await User.findOne({
        email: decoded.email,
        _id: decoded.userId,
        isApproved: true,
      })

      if (!user) {
        return res.status(404).json({ error: "User not found or account is not approved" })
      }

      console.log("User found, updating password...")

      // Hash and update the new password
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      user.password = hashedPassword
      await user.save()

      console.log("Password updated successfully for user:", user.email)

      return res.status(200).json({
        message: "Password updated successfully. You can now log in with your new password.",
      })
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError)
      if (jwtError.name === "JsonWebTokenError" || jwtError.name === "TokenExpiredError") {
        return res.status(400).json({ error: "Invalid or expired reset token" })
      }
      throw jwtError
    }
  } catch (error) {
    console.error("Reset password error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
