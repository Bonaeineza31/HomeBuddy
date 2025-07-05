// src/components/Auth/login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const mockUsers = [
  {
    id: 'user_001',
    email: 'student@example.com',
    password: 'password123',
    name: 'Atete Norette',
    role: 'student',
    verified: true
  },
  {
    id: 'user_002',
    email: 'landlord@example.com',
    password: 'password123',
    name: 'John Landlord',
    role: 'landlord',
    verified: true
  }
];

const authenticateUser = (email, password) => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (user) {
    // Store user data in memory (not localStorage as it's not supported)
    return { success: true, user };
  }
  return { success: false, error: 'Invalid email or password' };
};

const AuthContainer = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        {children}
      </div>
    </div>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const authResult = authenticateUser(formData.email, formData.password);

      if (authResult.success) {
        // Redirect based on user role
        if (authResult.user.role === 'student') {
          navigate('/student', { 
            state: { user: authResult.user } 
          });
        } else if (authResult.user.role === 'landlord') {
          navigate('/dashboard', { 
            state: { user: authResult.user } 
          });
        }
      } else {
        setError(authResult.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <div className="auth-header">
        <h1>Welcome Back</h1>
        <p>Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>

        <div className="form-footer">
          <Link to="/forgot-password" className="link">Forgot your password?</Link>
        </div>
      </form>

      <div className="auth-switch">
        <p>Don't have an account? 
          <Link to="/signup" className="link-button">
            Get Started
          </Link>
        </p>
      </div>

      {/* Demo credentials for testing */}
      <div className="demo-credentials">
        <h4>Demo Credentials:</h4>
        <p><strong>Student:</strong> student@example.com / password123</p>
        <p><strong>Landlord:</strong> landlord@example.com / password123</p>
      </div>
    </AuthContainer>
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