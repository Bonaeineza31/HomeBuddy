// src/components/Auth/login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
// import { toast } from 'react-toastify'; // optional if using toast

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://homebuddy-yn9v.onrender.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
         credentials: 'include' 
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      // Save token and role
      localStorage.setItem('accessToken', result.token);
      localStorage.setItem('userRole', result.user.role);

      // Optional: toast.success('Login successful!');

      // Redirect based on role
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else if (result.user.role === 'student') {
        navigate('/student');
      } else if (result.user.role === 'landlord') {
        navigate('/landlord');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      // toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="form-footer">
            <Link to="/forgot-password" className="link">Forgot your password?</Link>
          </div>
        </form>

        <div className="auth-switch">
          <p>Don't have an account? <Link to="/signup" className="link-button">Get Started</Link></p>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <div className="auth-page">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
