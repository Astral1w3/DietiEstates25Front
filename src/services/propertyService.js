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
 * Crea una nuova proprietà, includendo il caricamento di immagini.
 * @param {object} propertyData - I dati JSON della proprietà.
 * @param {File[]} images - Un array di oggetti File da caricare.
 * @returns {Promise<object>}
 */
export const createProperty = async (propertyData, images) => {
    try {
        // FormData è necessario per inviare sia dati JSON che file.
        const formData = new FormData();

        // Aggiungi i dati JSON della proprietà come stringa.
        // Il backend dovrà quindi fare il parse di questa stringa.
        formData.append('propertyData', JSON.stringify(propertyData));

        // Aggiungi ogni immagine al FormData.
        images.forEach(image => {
            formData.append('images', image);
        });

        // Esegui la richiesta POST con FormData.
        // Axios imposterà automaticamente l'header 'Content-Type' a 'multipart/form-data'.
        const response = await api.post('/properties', formData);
        
        return response.data;
    } catch (error) {
        console.error("Errore nella creazione della proprietà:", error);
        // È una buona pratica rilanciare l'errore o gestirlo in modo più specifico.
        throw error;
    }
};


// --- ECCO LA FUNZIONE CHE HAI CHIESTO, IMPLEMENTATA CON 'api' ---
/**
 * Traccia la visualizzazione di una proprietà.
 * Fa una chiamata POST per incrementare il contatore sul backend.
 * @param {string | number} propertyId - L'ID della proprietà da tracciare.
 */
export const trackPropertyView = async (propertyId) => {
    try {
        // L'endpoint è relativo al baseURL di 'api'.
        await api.post(`/properties/${propertyId}/increment-view`);
    } catch (error) {
        // Il tracciamento non è un'operazione critica, quindi basta un log in caso di errore.
        console.error('Failed to track property view:', error);
    }
};
