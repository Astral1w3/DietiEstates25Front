import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from './context/AuthContext'; 
import Header from './components/Header/Header.js'; 
import NoMatch from './components/NoMatch';
import RoleBasedProtectedRoute from './components/RoleBasedProtectedRoute';
import PropertyDetailPage from './pages/PropertyDetailPage/PropertyDetailPage';
import "./App.css";

function App() {

  const Home = lazy(() => import('./pages/Home/Home.js'));
  const Signup = lazy(() => import('./pages/Signup.js'));
  const Login = lazy(() => import('./pages/Login.js'));
  const Profile = lazy(() => import('./pages/Profile/Profile.js'));
  const PropertiesPage = lazy(() => import('./pages/PropertiesPage/PropertiesPage.js'));

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
            <Route path="/property/:propertyId" element={<PropertyDetailPage />} /> 
            
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