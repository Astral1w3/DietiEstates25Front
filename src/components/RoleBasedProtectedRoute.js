import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Estrai i ruoli dell'utente dal token decodificato.
  // Se non ci sono ruoli, usa un array vuoto per sicurezza.
  console.log(user);
  // Controlla se ALMENO UNO dei ruoli dell'utente è presente
  // nella lista dei ruoli permessi per questa rotta.
  const isAuthorized = allowedRoles.includes(user?.role)

  if (!isAuthorized) {
    // Reindirizza alla homepage se l'utente non ha i permessi
    return <Navigate to="/" replace />; 
  }

  return children;
};

export default RoleBasedProtectedRoute;