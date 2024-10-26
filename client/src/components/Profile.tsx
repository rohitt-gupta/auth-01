import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/auth';
import { UserProfile } from '../types';
import { AxiosError } from 'axios';


const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      navigate('/login');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.updatePassword({ currentPassword, newPassword });
      setSuccessMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setError('');
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        setError(error.response.data.message || 'Failed to update password');
      } else {
        setError('Failed to update password');
      }
      setSuccessMessage('');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="flex flex-col justify-center items-center bg-gray-900 min-h-screen">
      <div className="bg-gray-800 shadow-md p-6 rounded-lg w-full max-w-md">
        <h2 className="mb-6 font-bold text-2xl text-center">Profile</h2>
        <p className="mb-2">Name: {user.name}</p>
        <p className="mb-4">Email: {user.email}</p>

        <h3 className="mb-4 font-semibold text-xl">Update Password</h3>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        {successMessage && <p className="mb-4 text-green-500">{successMessage}</p>}
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
            required
            className="border-gray-600 bg-gray-700 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full focus:outline-none"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            required
            className="border-gray-600 bg-gray-700 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full focus:outline-none"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md w-full transition duration-200">
            Update Password
          </button>
        </form>

        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 mt-6 px-4 py-2 rounded-md w-full transition duration-200">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
