"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./index.css"

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!email) {
      return setError("Please enter your email address.")
    }

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return setError("Please enter a valid email address.")
    }

    try {
      setIsLoading(true)

      const response = await fetch("https://homebuddy-yn9v.onrender.com/auth/forgotpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      })

      const result = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 403) {
          throw new Error("Your account is not approved yet. Password reset is not available.")
        } else if (response.status === 400) {
          throw new Error(result.error || "Please enter a valid email address.")
        } else {
          throw new Error(result.error || "Failed to send reset email. Please try again.")
        }
      }

      setMessage("Password reset link has been sent to your email. Please check your inbox and spam folder.")
      setEmail("") // Clear the email field
    } catch (err) {
      console.error("Forgot password error:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Reset Your Password</h1>
          <p>Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span> {error}
            </div>
          )}

          {message && (
            <div
              className="success-message"
              style={{
                backgroundColor: "#f0f9ff",
                borderColor: "#bae6fd",
                color: "#0369a1",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid",
                marginBottom: "16px",
              }}
            >
              <span>✅</span> {message}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-full" disabled={isLoading || !email}>
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>

          <div className="form-footer">
            <Link to="/login" className="link">
              ← Remember your password? Back to Login
            </Link>
          </div>
        </form>

        <div className="auth-switch">
          <p>
            Don't have an account?
            <Link to="/signup" className="link-button">
              {" "}
              Get Started
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const ForgotPasswordPage = () => {
  return (
    <div className="auth-page">
      <ForgotPasswordForm />
    </div>
  )
}

export default ForgotPasswordPage
