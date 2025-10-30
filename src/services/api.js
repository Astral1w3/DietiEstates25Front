// src/api/api.js
import axios from 'axios';

// Crea un'istanza di Axios con una configurazione di base
const api = axios.create({
    // --- MODIFICA CHIAVE ---
    // Aggiungi /api all'URL di base.
    // Tutte le richieste fatte con 'api' ora avranno questo prefisso.
    baseURL: 'http://localhost:8080/api' 
});

// L'interceptor rimane invariato, è corretto
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;