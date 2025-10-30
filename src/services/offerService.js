import api from './api'; // Corretto il percorso

/**
 * Crea una nuova offerta per una proprietà.
 * @param {object} offerData - Dati dell'offerta ({ propertyId, offerPrice }).
 * @returns {Promise<any>} - La risposta del server.
 */
export const createOffer = async (offerData) => {
    try {
        const response = await api.post('/offers/create', offerData);
        return response.data;
    } catch (error) {
        console.error("Errore nell'invio dell'offerta:", error);
        throw error;
    }
};

   