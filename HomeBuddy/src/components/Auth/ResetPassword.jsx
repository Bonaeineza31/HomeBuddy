import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './Auth.css';

const ResetPasswordForm = ({ token, tokenValid }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      return setError('Please fill in all fields.');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (password.length < 8) {
      return setError('Password must be at least 8 characters long.');
    }

    try {
      setIsLoading(true);

      const response = await fetch('https://homebuddy-yn9v.onrender.com/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: password
        }),
        credentials: 'include'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset password');
      }

      alert('Password has been reset successfully!');
      navigate('/login');

    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Show error if token is invalid
  if (tokenValid === false) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Invalid Reset Link</h1>
            <p>This password reset link is invalid or has expired.</p>
          </div>

          <div className="error-message">
            <span className="error-icon">⚠️</span>
            Please request a new password reset link.
          </div>

          <div className="form-actions">
            <Link to="/forgot-password" className="btn btn-primary btn-full">
              Request New Reset Link
            </Link>
          </div>

          <div className="auth-switch">
            <p><Link to="/login" className="link-button">Back to Sign In</Link></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Set New Password</h1>
          <p>Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your new password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <div className="form-help">
              Password must be at least <span>8 characters long</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>

          <div className="form-footer">
            <Link to="/login" className="link">Back to Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => {
  const { token } = useParams(); // Get reset token from URL params
  const [tokenValid, setTokenValid] = useState(null); // null = checking, true = valid, false = invalid

  useEffect(() => {
    // Verify token validity when component mounts
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }

      try {
        const response = await fetch(`https://homebuddy-yn9v.onrender.com/auth/verify-reset-token/${token}`, {
          method: 'GET',
          credentials: 'include'
        });

        setTokenValid(response.ok);
      } catch (err) {
        console.error('Token verification error:', err);
        setTokenValid(false);
      }
    };

    verifyToken();
  }, [token]);

  // Show loading state while verifying token
  if (tokenValid === null) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Verifying Reset Link</h1>
              <p>Please wait while we verify your reset link...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <ResetPasswordForm token={token} tokenValid={tokenValid} />
    </div>
  );
};

export default ResetPasswordPage;