import api from './api'; // Corretto il percorso

/**
 * Prenota una visita per una proprietà.
 * @param {object} visitData - Dati della visita ({ propertyId, visitDate }).
 * @returns {Promise<any>} - La risposta del server.
 */
export const bookVisit = async (visitData) => {
    try {
        const response = await api.post('/visits/book', visitData);
        return response.data;
    } catch (error) {
        console.error("Errore nella prenotazione della visita:", error);
        throw error;
    }
};

