import React, { createContext, useState, useContext } from 'react';
import { ROLES } from '../config/permissions'; // Importa i ruoli

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // SIMULAZIONE: Inizia con un utente 'admin' loggato per il testing.
  // In un'app reale, questo sarebbe 'null' all'inizio.
  const [user, setUser] = useState({
    id: 'admin01',
    username: 'giovy03',
    email: 'admin@diestiestates25.com',
    role: ROLES.AGENT
  }); 

   const login = (userData) => {
    setUser(userData);
    // da fare: sarvare il token JWT o i dati in localStorage
    // per mantenere la sessione attiva tra i refresh della pagina.
  };
  
  const logout = () => setUser(null); 

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};