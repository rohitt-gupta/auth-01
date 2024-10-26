import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from '../components/Login';
import Register from '../components/Register';
import Profile from '../components/Profile';
import authService from '../api/auth';

const AppRouter: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.validateSession();
        setIsAuthenticated(response.isAuthenticated);
      } catch (error) {
        console.error('Failed to validate session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/profile" replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/profile" replace /> : <Register />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/profile" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
