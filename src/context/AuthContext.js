import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decodedUser = jwtDecode(storedToken);
        
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser(decodedUser);
          setToken(storedToken);
        } else {
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error("Token non valido:", error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username: email,
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
        const response = await axios.post('http://localhost:8080/api/auth/register', {
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

  // --- NUOVA FUNZIONE PER IL LOGIN CON GOOGLE ---
  const loginWithGoogle = async (googleUserData) => {
    try {
      // Invia le informazioni dell'utente di Google al tuo backend
      const response = await axios.post('http://localhost:8080/api/auth/google-login', {
        email: googleUserData.email,
        name: googleUserData.name,
        googleId: googleUserData.sub, // 'sub' è l'ID univoco di Google
      });

      const { jwt } = response.data;
      handleSuccessfulAuth(jwt);

    } catch (error) {
      console.error("Errore durante il login con Google:", error);
      throw error;
    }
  };
  
  // --- FUNZIONE HELPER PER EVITARE DUPLICAZIONE DI CODICE ---
  const handleSuccessfulAuth = (jwt) => {
    // Salva il token nel localStorage
    localStorage.setItem('token', jwt);
    
    // Decodifica il token per estrarre le informazioni sull'utente
    const decodedUser = jwtDecode(jwt);
    
    // Aggiorna gli stati
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