import api from './api';

/**
 * Crea una nuova offerta per una proprietà.
 * @param {object} offerData - Dati dell'offerta ({ propertyId, offerPrice }).
 * @returns {Promise<any>} - La risposta del server con i dati dell'offerta creata.
 */
export const createOffer = async (offerData) => {
    try {
        // --- CORREZIONE CRUCIALE ---
        // L'endpoint corretto è '/offers', come definito nel Controller Spring Boot.
        const response = await api.post('/offers', offerData); 
        return response.data;
    } catch (error) {
        // Invece di loggare e basta, rilanciamo l'errore per gestirlo nel componente.
        // L'oggetto 'error' di Axios contiene dettagli preziosi.
        console.error("Errore nell'invio dell'offerta:", error.response || error);
        throw error;
    }
};