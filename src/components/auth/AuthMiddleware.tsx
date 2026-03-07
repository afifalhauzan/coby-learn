import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

export const useAuth = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      console.warn("Token expired, redirecting to login...");
      localStorage.removeItem('token'); 
      return false;
    }

    return true;

  } catch (error) {
    console.error("Invalid token format");
    localStorage.removeItem('token');
    return false;
  }
};

export const ProtectedRoute = (): React.JSX.Element => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export const PublicRoute = (): React.JSX.Element => {
  const isAuth = useAuth();
  return isAuth ? <Navigate to="/dashboard" replace /> : <Outlet />;
};