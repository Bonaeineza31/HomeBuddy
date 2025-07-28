"use client"

import { useState, useEffect } from "react"
import './index.css'
import './Auth.css'
const ResetPasswordPage = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(null)
  const [token, setToken] = useState("")

  useEffect(() => {
    // Get token from URL query parameter
    const urlParams = new URLSearchParams(window.location.search)
    const tokenFromUrl = urlParams.get("token")

    if (tokenFromUrl) {
      setToken(tokenFromUrl)
      // You could add token verification here if your backend supports it
      setTokenValid(true)
    } else {
      setTokenValid(false)
      setError("No reset token found in URL")
    }
  }, [])

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

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    setIsLoading(true)

    try {
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
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password.")
      }

      setMessage("Password reset successful! Redirecting to login...")
      setTimeout(() => {
        window.location.href = "/login"
      }, 2000)
    } catch (err) {
      setError(err.message || "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  if (tokenValid === null) {
    return (
      <div>
        <h1>Verifying Reset Link</h1>
        <p>Please wait while we verify your reset link...</p>
      </div>
    )
  }

  if (tokenValid === false) {
    return (
      <div>
        <h1>Invalid Reset Link</h1>
        <p>This password reset link is invalid or has expired.</p>
        {error && (
          <div>
            <span>⚠️</span>
            {error}
          </div>
        )}
        <a href="/forgot-password">Request New Reset Link</a>
        <br />
        <a href="/login">Back to Sign In</a>
      </div>
    )
  }

  return (
    <div>
      <h1>Reset Your Password</h1>
      <p>Enter your new password below.</p>

      {error && (
        <div>
          <span>⚠️</span>
          {error}
        </div>
      )}

      {message && (
        <div>
          <span>✅</span>
          {message}
        </div>
      )}

      <div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <small>Password must be at least 8 characters long</small>
        </div>

        <button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </div>

      <a href="/login">Back to Login</a>
    </div>
  )
}

export default ResetPasswordPage
