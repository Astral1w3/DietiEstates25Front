import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Salviamo la pagina che stava cercando di visitare, così possiamo
    // reindirizzarlo lì dopo il login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAuthorized = allowedRoles.includes(user?.role);

  if (!isAuthorized) {
    return <Navigate to="/" replace />; 
  }

  // Se entrambi i controlli passano, l'utente può vedere la pagina.
  return children;
};

export default RoleBasedProtectedRoute;