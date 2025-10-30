import api from './api'; // Corretto il percorso

/**
 * Recupera una singola proprietà tramite il suo ID.
 * @param {number | string} propertyId - L'ID della proprietà.
 * @returns {Promise<object>}
 */
export const getPropertyById = async (propertyId) => {
    try {
        const response = await api.get(`/properties/${propertyId}`);
        return response.data;
    } catch (error) {
        console.error(`Errore nel recupero della proprietà con ID ${propertyId}:`, error);
        throw error;
    }
};

/**
 * Cerca le proprietà in base a una località.
 * @param {string} location - La località da cercare.
 * @returns {Promise<Array>}
 */
export const searchPropertiesByLocation = async (location) => {
    if (!location) return [];
    try {
        const response = await api.get(`/properties/search?location=${location}`);
        return response.data;
    } catch (error) {
        console.error("Errore nel recupero delle proprietà:", error);
        throw error;
    }
};

/**
 * Crea una nuova proprietà.
 * @param {object} propertyData - I dati della proprietà.
 * @returns {Promise<object>}
 */
export const createProperty = async (propertyData) => {
    try {
        const response = await api.post('/properties', propertyData); // Corretto: usa 'api'
        return response.data;
    } catch (error) {
        console.error("Errore nella creazione della proprietà:", error);
        throw error;
    }
};