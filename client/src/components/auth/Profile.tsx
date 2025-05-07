import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../config/api';

const Profile: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data with user data when it's available
  React.useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      setIsEditing(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <p className="text-center text-gray-700">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-200">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6 dark:text-gray-100">My Profile</h2>

      {message.text && (
        <div className={`mb-4 p-3 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400' : 
          'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            id="email"
            type="email"
            value={user.email}
            disabled
          />
          <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Email cannot be changed</p>
        </div>

        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300" htmlFor="first_name">
              First Name
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                !isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
              } dark:text-gray-300 dark:border-gray-600`}
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300" htmlFor="last_name">
              Last Name
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                !isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
              } dark:text-gray-300 dark:border-gray-600`}
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300" htmlFor="phone">
            Phone
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              !isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
            } dark:text-gray-300 dark:border-gray-600`}
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="flex justify-between">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  // Reset form data to original user data
                  if (user) {
                    setFormData({
                      first_name: user.first_name,
                      last_name: user.last_name,
                      phone: user.phone || '',
                    });
                  }
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;