import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  const [formError, setFormError] = useState('');
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Basic form validation
    if (!formData.email || !formData.password || !formData.first_name || !formData.last_name) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setFormError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    try {
      // Send registration data (excluding passwordConfirm)
      const { passwordConfirm, ...registerData } = formData;
      await register(registerData);
      navigate('/'); // Redirect to home page after successful registration
    } catch (err) {
      // Auth context already handles the error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="form-card max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Register</h2>
        
        {(formError || error) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {formError || error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First and Last name - row with two inputs */}
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
                First Name *
              </label>
              <input
                className="input-field"
                id="first_name"
                name="first_name"
                type="text"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">
                Last Name *
              </label>
              <input
                className="input-field"
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email *
            </label>
            <input
              className="input-field"
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Phone */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone (optional)
            </label>
            <input
              className="input-field"
              id="phone"
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password *
            </label>
            <input
              className="input-field"
              id="password"
              name="password"
              type="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>
          
          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passwordConfirm">
              Confirm Password *
            </label>
            <input
              className="input-field"
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              placeholder="Confirm Password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Submit & Login Link */}
          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="btn-primary w-full text-center"
            >
              Create Account
            </button>
            
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:underline">
                Login here
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;