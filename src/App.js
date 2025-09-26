import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// 1. IMPORTA I COMPONENTI NECESSARI
import { AuthProvider } from './context/AuthContext'; // Fondamentale per far funzionare l'header condizionale
import Header from './components/Header'; // Il tuo nuovo componente header
import NoMatch from './components/NoMatch';
import RoleBasedProtectedRoute from './components/RoleBasedProtectedRoute';
import PropertiesPage from "./pages/PropertiesPage/PropertiesPage.js";
import "./App.css";

function App() {

  const Home = lazy(() => import('./pages/Home.js'));
  const Properties = lazy(() => import('./pages/Properties.js'));
  const Signup = lazy(() => import('./pages/Signup.js'));
  const Login = lazy(() => import('./pages/Login.js'));
  const Profile = lazy(() => import('./pages/Profile.js'));

  const ROLES = {
    USER: 'user',
    AGENT: 'agent',
    MANAGER: 'manager',
    ADMIN: 'admin',
  };

  return (
    //    Questo rende i dati di autenticazione disponibili a tutti i componenti figli (Header e Routes)
    <AuthProvider>
      <div className="App">
        <Header />

        <Suspense fallback={<div className="container">Wait...</div>}>
          <Routes>
            
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            
            <Route
              path="/profile"
              element={
                <RoleBasedProtectedRoute allowedRoles={[ROLES.USER, ROLES.AGENT, ROLES.MANAGER, ROLES.ADMIN]}>
                  <Profile />
                </RoleBasedProtectedRoute>
              }
            />

            <Route path="*" element={<NoMatch />} />
          </Routes>
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;