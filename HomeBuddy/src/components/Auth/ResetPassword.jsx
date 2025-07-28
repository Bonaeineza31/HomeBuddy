"use client"

import { useState, useEffect } from "react"

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(null)
  const [token, setToken] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    // Get token from URL query parameter
    const urlParams = new URLSearchParams(window.location.search)
    const tokenFromUrl = urlParams.get("token")

    if (tokenFromUrl) {
      setToken(tokenFromUrl)
      setTokenValid(true)
    } else {
      setTokenValid(false)
      setError("No reset token found in URL")
    }
  }, [])

  const validatePassword = (pwd) => {
    const errors = []
    if (pwd.length < 8) errors.push("at least 8 characters")
    if (!/[A-Z]/.test(pwd)) errors.push("one uppercase letter")
    if (!/[a-z]/.test(pwd)) errors.push("one lowercase letter")
    if (!/\d/.test(pwd)) errors.push("one number")

    return errors
  }

  const handleSubmit = async () => {
    setError("")
    setMessage("")

    if (!token) {
      setError("Invalid or missing token.")
      return
    }

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    const passwordErrors = validatePassword(password)
    if (passwordErrors.length > 0) {
      setError(`Password must contain ${passwordErrors.join(", ")}.`)
      return
    }

    setIsLoading(true)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      const response = await fetch("https://homebuddy-yn9v.onrender.com/auth/resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token,
          newPassword: password,
          confirmPassword: confirmPassword,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 400 && data.error.includes("token")) {
          throw new Error("Your reset link has expired or is invalid. Please request a new one.")
        } else if (response.status === 404) {
          throw new Error("User account not found.")
        } else {
          throw new Error(data.error || "Failed to reset password.")
        }
      }

      setMessage("Password reset successful! Redirecting to login...")
      setPassword("")
      setConfirmPassword("")

      setTimeout(() => {
        window.location.href = "/login"
      }, 2000)
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.")
      } else {
        setError(err.message || "Something went wrong.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  if (tokenValid === null) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading-container">
            <div className="loading-icon">⟳</div>
            <h1 className="loading-title">Verifying Reset Link</h1>
            <p className="loading-text">Please wait while we verify your reset link...</p>
          </div>
        </div>
      </div>
    )
  }

  if (tokenValid === false) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="invalid-token">
            <div className="invalid-icon">⚠️</div>
            <h1 className="invalid-title">Invalid Reset Link</h1>
            <p className="invalid-text">This password reset link is invalid or has expired.</p>
            {error && (
              <div className="alert alert-error mb-3">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}
            <div className="invalid-actions">
              <button className="btn btn-primary w-full" onClick={() => (window.location.href = "/forgot-password")}>
                Request New Reset Link
              </button>
              <button className="btn btn-secondary w-full" onClick={() => (window.location.href = "/login")}>
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Reset Your Password</h2>
          <p className="auth-subtitle">Enter your new password below.</p>
        </div>

        <div className="auth-form">
          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="alert alert-success">
              <span>✅</span>
              <span>{message}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              New Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="form-input"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <p className="password-help">
              Password must contain at least 8 characters, including uppercase, lowercase, and numbers
            </p>
          </div>

          <button
            className="btn btn-primary w-full"
            onClick={handleSubmit}
            disabled={isLoading || !password || !confirmPassword}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>

          <div className="text-center mt-2">
            <button className="btn-link" onClick={() => (window.location.href = "/login")}>
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
