import React, { useState } from 'react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      return setError('Please enter your email address.');
    }

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError('Please enter a valid email address.');
    }

    try {
      setIsLoading(true);

      console.log('Sending forgot password request for:', email);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('https://homebuddy-yn9v.onrender.com/auth/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      let result;
      try {
        result = await response.json();
        console.log('Response data:', result);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned an invalid response');
      }

      if (!response.ok) {
        // Handle specific error cases that match backend responses
        if (response.status === 404) {
          throw new Error('No account found with this email address.');
        } else if (response.status === 403) {
          throw new Error('Your account is not approved yet. Password reset is not available.');
        } else if (response.status === 500) {
          throw new Error('Server error occurred. Please try again later or contact support.');
        } else {
          throw new Error(result?.error || result?.message || `Server error: ${response.status}`);
        }
      }

      setMessage('Password reset link has been sent to your email. Please check your inbox and spam folder.');
      setEmail('');

    } catch (err) {
      console.error('Forgot password error:', err);
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Reset Your Password</h2>
          <p className="auth-subtitle">Enter your email address and we'll send you a link to reset your password.</p>
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
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              autoComplete="email"
              required
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>

          <div className="text-center mt-2">
            <button
              type="button"
              className="btn-link"
              onClick={() => window.location.href = '/login'}
            >
              Remember your password? Sign in
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <div className="auth-footer-text">
            Don't have an account?{' '}
            <button
              className="btn-link"
              onClick={() => window.location.href = '/signup'}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;