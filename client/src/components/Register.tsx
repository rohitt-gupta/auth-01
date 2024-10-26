import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/auth';
import { AxiosError } from 'axios';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    age: '',
    dob: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.registerWithEmailPassword(formData);
      navigate('/profile');
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        setError(error.response.data.message || 'Registration failed');
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-900 min-h-screen">
      <div className="bg-gray-800 shadow-md p-6 rounded-lg w-full max-w-md">
        <h2 className="mb-6 font-bold text-2xl text-center">Register</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="border-gray-600 bg-gray-700 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full focus:outline-none"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="border-gray-600 bg-gray-700 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full focus:outline-none"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="border-gray-600 bg-gray-700 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full focus:outline-none"
          />
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="Gender"
            required
            className="border-gray-600 bg-gray-700 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full focus:outline-none"
          />
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            required
            className="border-gray-600 bg-gray-700 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full focus:outline-none"
          />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            placeholder="Date of Birth"
            required
            className="border-gray-600 bg-gray-700 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full focus:outline-none"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md w-full transition duration-200">
            Register
          </button>
        </form>
        <button onClick={() => navigate('/login')} className="bg-gray-600 hover:bg-gray-700 mt-4 px-4 py-2 rounded-md w-full transition duration-200">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Register;
