import React from 'react';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  
  // Check if the user is authenticated
  const isUserAuthenticated = isAuthenticated();

  // If the user is not authenticated, redirect to the login page
  if (!isUserAuthenticated) {
    window.localStorage.clear();
    toast.error("Please login to access this page");
    return <Navigate to="/SignIn" replace />;
  }

  // If the user is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
