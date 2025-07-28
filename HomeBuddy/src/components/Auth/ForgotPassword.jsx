import React, { useState } from 'react';
import './Auth.css'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      return setError('Please enter your email address.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError('Please enter a valid email address.');
    }

    try {
      setIsLoading(true);

      const response = await fetch('https://homebuddy-yn9v.onrender.com/auth/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User with this email does not exist');
        } else if (response.status === 403) {
          throw new Error('Your account is not approved yet. Password reset is not available.');
        } else {
          throw new Error(result.error || 'Failed to send reset email');
        }
      }

      setMessage('Password reset link has been sent to your email. Please check your inbox and spam folder.');
      setEmail('');

    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Reset Your Password</h1>
      <p>Enter your email address and we'll send you a link to reset your password.</p>

      <form onSubmit={handleSubmit}>
        {error && (
          <div>
            <span>⚠️</span> {error}
          </div>
        )}

        {message && (
          <div>
            <span>✅</span> {message}
          </div>
        )}

        <div>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <div>
          <a href="/login">Remember your password? Sign in</a>
        </div>
      </form>

      <div>
        <p>Don't have an account? <a href="/signup">Get Started</a></p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;