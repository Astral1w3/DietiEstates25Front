import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios'; // <-- 1. RIMUOVI L'IMPORTAZIONE GLOBALE
import api from '../services/api'; // <-- 2. IMPORTA LA TUA ISTANZA CONFIGURATA (il percorso potrebbe variare)
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // L'useEffect rimane perfetto com'è
  useEffect(() => {
    // ...
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      });

      const { jwt } = response.data;
      handleSuccessfulAuth(jwt);

    } catch (error) {
      console.error("Errore durante il login:", error);
      throw error;
    }
  };

  const register = async (email, username, password) => {
    try {
        // 3. USA 'api' INVECE DI 'axios' E ACCORCIA L'URL
        const response = await api.post('/auth/register', {
            email: email,
            username: username,
            password: password
        });
        return response.data;
    } catch (error) {
        console.error("Errore durante la registrazione:", error.response?.data || error.message);
        throw error;
    }
  };

  const loginWithGoogle = async (googleUserData) => {
    try {
      // 3. USA 'api' INVECE DI 'axios' E ACCORCIA L'URL
      const response = await api.post('/auth/google-login', {
        email: googleUserData.email,
        name: googleUserData.name,
        googleId: googleUserData.sub,
      });

      const { jwt } = response.data;
      handleSuccessfulAuth(jwt);

    } catch (error) {
      console.error("Errore durante il login con Google:", error);
      throw error;
    }
  };
  
  // Il resto del file è già corretto
  const handleSuccessfulAuth = (jwt) => {
    localStorage.setItem('token', jwt);
    const decodedUser = jwtDecode(jwt);
    setUser(decodedUser);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    window.location.href = '/'; 
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
    register,
    loginWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};