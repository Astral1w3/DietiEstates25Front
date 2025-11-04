import api from './api'; // Importa la tua istanza di axios configurata

/**
 * Recupera le date già prenotate per un dato immobile.
 * @param {number} propertyId L'ID dell'immobile.
 * @returns {Promise<Date[]>} Una promessa che si risolve con un array di oggetti Date.
 */
export const getBookedDates = async (propertyId) => {
    try {
        const response = await api.get(`/visits/property/${propertyId}/booked-dates`);
        // L'API restituisce stringhe di data, le convertiamo in oggetti Date
        return response.data.map(dateString => new Date(dateString));
    } catch (error) {
        console.error("Errore nel recupero delle date prenotate:", error);
        throw error; // Rilancia l'errore per gestirlo nel componente
    }
};

/**
 * Invia una richiesta per prenotare una visita.
 * @param {object} visitData Dati della visita { propertyId, visitDate }.
 * @returns {Promise<object>} Una promessa che si risolve con i dati della visita creata.
 */
export const bookVisit = async (visitData) => {
    try {
        const response = await api.post('/visits/book', visitData);
        return response.data;
    } catch (error) {
        console.error("Errore durante la prenotazione della visita:", error);
        throw error;
    }
};