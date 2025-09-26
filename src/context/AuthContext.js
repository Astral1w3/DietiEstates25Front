import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null); 

  // Simuliamo una funzione di login che riceve questi dati.
  const login = (userData) => {
    setUser(userData);
    // da fare: sarvare il token JWT o i dati in localStorage
    // per mantenere la sessione attiva tra i refresh della pagina.
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user, // Es: { id: 1, name: 'Mario Rossi', role: 'admin' } o null
    isAuthenticated: !!user,
    login,
    logout,
  };

  //Questa riga crea un componente speciale chiamato Provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};