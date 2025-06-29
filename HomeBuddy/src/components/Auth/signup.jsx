// src/components/Auth/signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const AuthContainer = ({ children }) => (
  <div className="auth-container">
    <div className="auth-card">
      {children}
    </div>
  </div>
);

const SignupPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'student',
    university: '',
    country: 'Rwanda',
    password: '',
    confirmPassword: '',
    idType: 'national_id',
    idDocument: null,
    criminalRecord: null
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.firstName || !formData.lastName || !formData.email ||
      !formData.password || !formData.confirmPassword ||
      !formData.idDocument || !formData.criminalRecord
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.role === 'student' && !formData.university) {
      setError('Please select your university.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Signup data:', formData);

      // TODO: replace with API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Registration successful! Check your email for verification.');
      navigate('/login');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <div className="auth-header">
        <h1>Create an Account</h1>
        <p>Join our trusted rental community</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span> {error}
          </div>
        )}

        <div className="form-group">
          <label>Role *</label>
          <select name="role" value={formData.role} onChange={(e) => {
            setRole(e.target.value);
            handleInputChange(e);
          }} className="form-select" required>
            <option value="student">Student</option>
            <option value="landlord">Landlord</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>First Name *</label>
            <input type="text" name="firstName" value={formData.firstName}
              onChange={handleInputChange} className="form-input" required />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input type="text" name="lastName" value={formData.lastName}
              onChange={handleInputChange} className="form-input" required />
          </div>
        </div>

        <div className="form-group">
          <label>Email Address *</label>
          <input type="email" name="email" value={formData.email}
            onChange={handleInputChange} className="form-input" required />
        </div>

        {role === 'student' && (
          <>
            <div className="form-group">
              <label>University *</label>
              <select name="university" value={formData.university}
                onChange={handleInputChange} className="form-select" required>
                <option value="">-- Select --</option>
                <option value="ALU">African Leadership University</option>
              </select>
            </div>
            <div className="form-group">
              <label>Country *</label>
              <select name="country" value={formData.country}
                onChange={handleInputChange} className="form-select" required>
                <option value="Rwanda">Rwanda</option>
                <option value="Uganda">Uganda</option>
                <option value="Congo">Congo</option>
                <option value="Kenya">Kenya</option>
                <option value="Nigeria">Nigeria</option>
              </select>
            </div>
          </>
        )}

        <div className="form-group">
          <label>Password *</label>
          <input type="password" name="password" value={formData.password}
            onChange={handleInputChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label>Confirm Password *</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword}
            onChange={handleInputChange} className="form-input" required />
        </div>

        <div className="form-group">
          <label>ID Type *</label>
          <select name="idType" value={formData.idType}
            onChange={handleInputChange} className="form-select" required>
            <option value="national_id">National ID</option>
            <option value="passport">Passport</option>
            <option value="student_id">Student ID</option>
            <option value="driver_license">Driver’s License</option>
          </select>
        </div>

        <div className="form-group">
          <label>Upload ID Document *</label>
          <input type="file" name="idDocument" onChange={handleInputChange}
            className="form-input file-input" accept="image/*,application/pdf" required />
        </div>

        <div className="form-group">
          <label>Criminal Record Certificate *</label>
        <p className="form-help">
            Upload a recent certificate from <a href="https://support.irembo.gov.rw/en/support/solutions/articles/47001147721-how-to-apply-for-a-criminal-record-certificate" target="_blank" rel="noreferrer"> <span>irembo.gov.rw</span></a> for safety verification. 
            It takes 2-3 business days for us to review and accept your account creation
          </p>
          <input type="file" name="criminalRecord" onChange={handleInputChange}
            className="form-input file-input" accept="application/pdf,image/*" required />

        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>

      <div className="auth-switch">
        <p>Already have an account? <Link to="/login" className="link-button">Sign In</Link></p>
      </div>
    </AuthContainer>
  );
};



export default SignupPage;
