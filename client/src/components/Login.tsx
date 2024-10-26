import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/auth';
import { AxiosError } from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.loginWithEmailPassword(email, password);
      navigate('/profile');
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        setError(error.response.data.message || 'Login failed');
      } else {
        setError('Login failed');
      }
    }
  };

  const handleGoogleLogin = () => {
    authService.loginWithGoogle();
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-900 min-h-screen">
      <div className="bg-gray-800 shadow-md p-6 rounded-lg w-full max-w-md">
        <h2 className="mb-6 font-bold text-2xl text-center">Login</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="border-gray-600 bg-gray-700 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full focus:outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="border-gray-600 bg-gray-700 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full focus:outline-none"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md w-full transition duration-200">
            Login
          </button>
        </form>
        <button onClick={handleGoogleLogin} className="bg-red-600 hover:bg-red-700 mt-4 px-4 py-2 rounded-md w-full transition duration-200">
          Sign in with Google
        </button>
        <button onClick={() => navigate('/register')} className="bg-gray-600 hover:bg-gray-700 mt-4 px-4 py-2 rounded-md w-full transition duration-200">
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
