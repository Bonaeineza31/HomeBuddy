// src/components/Auth/signup.jsx
import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import './signup.css';

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
    criminalRecord: null,
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
    setError('');

    const {
      firstName, lastName, email, password, confirmPassword,
      role, university, idDocument, criminalRecord, idType
    } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !idDocument || !criminalRecord) {
      return setError('Please fill in all required fields.');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (password.length < 8) {
      return setError('Password must be at least 8 characters.');
    }

    if (role === 'student' && !university) {
      return setError('Please enter your university.');
    }

    try {
      setIsLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const response = await fetch('https://homebuddy-yn9v.onrender.com/auth/signup', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Signup failed');
      }

      alert('Account created! Awaiting admin approval.');
      navigate('/login');

    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an Account</h2>
        {error && <p className="error-message">⚠️ {error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">

          <label>Role *</label>
          <select name="role" value={formData.role} onChange={(e) => {
            setRole(e.target.value);
            handleInputChange(e);
          }} required>
            <option value="student">Student</option>
            <option value="landlord">Landlord</option>
          </select>
           <label>First Name *</label>
          <input type="text" name="firstName" placeholder="First Name " value={formData.firstName} onChange={handleInputChange} required />
          <label>Last Name *</label>
          <input type="text" name="lastName" placeholder="Last Name *" value={formData.lastName} onChange={handleInputChange} required />
          <label>Email*</label>
          <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleInputChange} required />

          {role === 'student' && (
            <>
            <label>University </label>
              <input type="text" name="university" placeholder="University " value={formData.university} onChange={handleInputChange} required />
              <label>Country *</label>
              <select name="country" value={formData.country} onChange={handleInputChange} required>
                <option value="Rwanda">Rwanda</option>
                <option value="Uganda">Uganda</option>
                <option value="Congo">Congo</option>
                <option value="Kenya">Kenya</option>
              </select>
            </>
          )}
          <label>Password *</label>
          <input type="password" name="password" placeholder="Password " value={formData.password} onChange={handleInputChange} required />
          <label>Confirm Password *</label>
          <input type="password" name="confirmPassword" placeholder="Confirm Password " value={formData.confirmPassword} onChange={handleInputChange} required />

          <label>ID Type *</label>
          <select name="idType" value={formData.idType} onChange={handleInputChange} required>
            <option value="national_id">National ID</option>
            <option value="passport">Passport</option>
            <option value="student_id">Student ID</option>
            <option value="driver_license">Driver’s License</option>
          </select>

          <label>Upload ID Document *</label>
          <input type="file" name="idDocument" accept="image/*,application/pdf" onChange={handleInputChange} required />

          <label>Upload Criminal Record *</label>
          <input type="file" name="criminalRecord" accept="application/pdf,image/*" onChange={handleInputChange} required />

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-switch">
       <p>
         Already have an account?{' '}
         <Link to="/login" className="link-button">
           Sign In
          </Link>
        </p>
          </div>
      </div>
    </div>
  );
};

export default SignupPage;
