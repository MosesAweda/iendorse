import React from 'react';
import {toast} from 'react-toastify';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

let userDataString:any = window.localStorage.getItem("userData");
let userData = JSON.parse(userDataString);
  const token = userData ? userData.jwtToken : null;
  const tokenExpirationTime = userData.jwtTokenExpirationTime
  
  // Check if the token exists and if it's still valid
  const isTokenValid = token && tokenExpirationTime && new Date(tokenExpirationTime) > new Date();

  // If token is not valid, redirect to the login page
  if (!isTokenValid) {
   toast.error("Please login to access this page");
    return <Navigate to="/SignIn" replace />;

  }

  // If the token is valid, render the children (protected route content)
  return <>{children}</>;
};

export default ProtectedRoute;
