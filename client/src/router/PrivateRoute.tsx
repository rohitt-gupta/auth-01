import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../api/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.validateSession();
        setIsAuthenticated(response.isAuthenticated);
      } catch (error) {
        console.error('Failed to validate session:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Still checking authentication status
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
