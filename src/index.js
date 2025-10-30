import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'

import { AuthProvider } from './context/AuthContext'; 
 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <React.StrictMode>
      <BrowserRouter>
         <AuthProvider>
            <GoogleOAuthProvider clientId="969831002111-klk9reapa789775260iqhr0nj39lhmvt.apps.googleusercontent.com">
               <App />
            </GoogleOAuthProvider>
         </AuthProvider>
      </BrowserRouter>
   </React.StrictMode>
);