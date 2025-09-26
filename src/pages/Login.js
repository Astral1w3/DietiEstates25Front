import React from "react";
import { useAuth } from '../context/AuthContext';

import { useNavigate, useLocation } from 'react-router-dom';

function Login(){
    const { login, logout, user, isAuthenticated } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    //Leggi la "nota" dalla location.
    //    'location.state?.from?.pathname' cerca in modo sicuro l'indirizzo originale.
    //    Se l'utente è arrivato su /login direttamente (senza essere reindirizzato),
    //    lo stato non esisterà. In quel caso, usiamo '/profile' come destinazione di default.
    const from = location.state?.from?.pathname || "/profile";

    const handleTestLogin = () => {
        // Creiamo un oggetto utente finto, come se arrivasse da un backend.
        const fakeUserData = { 
            id: 123, 
            name: 'Mario Prova', 
            role: 'admin' 
        };

        // Chiamiamo la funzione 'login' che abbiamo preso dal contesto,
        // passandole i dati del nostro utente finto.
        console.log("Chiamata a login() con i dati:", fakeUserData);
        login(fakeUserData);

        console.log(`Login riuscito. Reindirizzamento a: ${from}`);
        navigate(from, { replace: true });
    };


    const handleTestLogout = () => {
        console.log("Chiamata a logout()");
        logout();
    };
    

    return(
        <>
            <h1>Pagina di Login</h1>
            
            <button onClick={handleTestLogin}>
                Simula Login (come Admin)
            </button>
            <button onClick={handleTestLogout} style={{ marginLeft: '10px' }}>
                Simula Logout
            </button>

            <hr style={{ margin: '20px 0' }} />

            <h2>Stato Attuale dal Contesto:</h2>
            {isAuthenticated ? (
                <div>
                    <p><strong>Utente Autenticato:</strong> Sì</p>
                    <p><strong>Dati Utente:</strong></p>
                    {/* Usiamo <pre> e JSON.stringify per mostrare l'oggetto user in modo leggibile */}
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </div>
            ) : (
                <p><strong>Utente Autenticato:</strong> No</p>
            )}
        </>
    )
}

export default Login;