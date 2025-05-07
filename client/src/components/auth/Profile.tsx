import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, isLoading, updateProfile, changePassword, updateAddresses } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  // Change password state
  const [showChangePw, setShowChangePw] = useState(false);
  const [pwData, setPwData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMessage, setPwMessage] = useState({ type: '', text: '' });
  const [pwSubmitting, setPwSubmitting] = useState(false);

  // Addresses state
  const [showAddresses, setShowAddresses] = useState(false);
  const [addresses, setAddresses] = useState<any[]>(user?.shipping_addresses || []);
  const [addrMessage, setAddrMessage] = useState({ type: '', text: '' });
  const [addrSubmitting, setAddrSubmitting] = useState(false);

  // Automatically clear success message after 3 seconds
  useEffect(() => {
    if (message.type === 'success') {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Scroll to the confirmation message when it appears
  useEffect(() => {
    if (message.text && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [message]);

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

  // Initialize addresses when user loads
  useEffect(() => {
    setAddresses(user?.shipping_addresses || []);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwData({ ...pwData, [e.target.name]: e.target.value });
  };

  const handlePwSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwSubmitting(true);
    setPwMessage({ type: '', text: '' });
    if (pwData.newPassword !== pwData.confirmPassword) {
      setPwMessage({ type: 'error', text: 'New passwords do not match' });
      setPwSubmitting(false);
      return;
    }
    try {
      const msg = await changePassword(pwData.oldPassword, pwData.newPassword);
      setPwMessage({ type: 'success', text: msg });
      setPwData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPwMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setPwSubmitting(false);
    }
  };

  const handleAddrChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const copy = [...addresses];
    copy[idx] = { ...copy[idx], [e.target.name]: e.target.value };
    setAddresses(copy);
  };

  const addAddress = () => setAddresses([...addresses, { fullName: '', street: '', city: '', state: '', postalCode: '', country: '' }]);
  const removeAddress = (idx: number) => setAddresses(addresses.filter((_, i) => i !== idx));

  const handleAddrSubmit = async () => {
    setAddrSubmitting(true);
    setAddrMessage({ type: '', text: '' });
    try {
      const res = await updateAddresses(addresses);
      setAddrMessage({ type: 'success', text: res.message });
    } catch (err: any) {
      setAddrMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update addresses' });
    } finally {
      setAddrSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const confirmation = await updateProfile(formData);
      setMessage({ type: 'success', text: confirmation });
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
        <div ref={messageRef} className={`mb-4 p-3 rounded ${
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

      {/* Change Password Section */}
      <div className="mt-8">
        <button onClick={() => setShowChangePw(!showChangePw)} className="text-blue-500 hover:underline mb-2">
          {showChangePw ? 'Hide Change Password' : 'Change Password'}
        </button>
        {showChangePw && (
          <form onSubmit={handlePwSubmit} className="space-y-4 p-4 bg-gray-50 rounded">
            {pwMessage.text && <p className={pwMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}>{pwMessage.text}</p>}
            <input
              name="oldPassword"
              type="password"
              placeholder="Old Password"
              value={pwData.oldPassword}
              onChange={handlePwChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              name="newPassword"
              type="password"
              placeholder="New Password"
              value={pwData.newPassword}
              onChange={handlePwChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              value={pwData.confirmPassword}
              onChange={handlePwChange}
              className="w-full p-2 border rounded"
              required
            />
            <button type="submit" disabled={pwSubmitting} className="px-4 py-2 bg-blue-500 text-white rounded">
              {pwSubmitting ? 'Saving...' : 'Save Password'}
            </button>
          </form>
        )}
      </div>

      {/* Manage Addresses Section */}
      <div className="mt-8">
        <button onClick={() => setShowAddresses(!showAddresses)} className="text-blue-500 hover:underline mb-2">
          {showAddresses ? 'Hide Addresses' : 'Manage Saved Addresses'}
        </button>
        {showAddresses && (
          <div className="space-y-4 p-4 bg-gray-50 rounded">
            {addrMessage.text && <p className={addrMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}>{addrMessage.text}</p>}
            {addresses.map((addr, idx) => (
              <div key={idx} className="border rounded p-2 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Address #{idx + 1}</span>
                  <button type="button" onClick={() => removeAddress(idx)} className="text-red-500">
                    Remove
                  </button>
                </div>
                {['fullName', 'street', 'city', 'state', 'postalCode', 'country'].map((field) => (
                  <input
                    key={field}
                    name={field}
                    placeholder={field}
                    value={addr[field] || ''}
                    onChange={(e) => handleAddrChange(idx, e)}
                    className="w-full p-1 border rounded"
                  />
                ))}
              </div>
            ))}
            <button type="button" onClick={addAddress} className="px-4 py-2 bg-green-500 text-white rounded">
              Add Address
            </button>
            <div className="mt-2">
              <button onClick={handleAddrSubmit} disabled={addrSubmitting} className="px-4 py-2 bg-blue-500 text-white rounded">
                {addrSubmitting ? 'Saving...' : 'Save Addresses'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;