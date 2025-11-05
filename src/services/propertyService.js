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

// --- INIZIO BLOCCO MODIFICATO ---

/**
 * Cerca le proprietà in base a una località, con supporto per la paginazione.
 * @param {string} location - La località da cercare.
 * @param {number} page - Il numero della pagina da recuperare (parte da 0).
 * @param {number} size - Il numero di elementi per pagina.
 * @returns {Promise<object>} - Restituisce l'intero oggetto Page dal backend.
 */
export const searchPropertiesByLocation = async (location, page = 0, size = 10) => {
    if (!location) {
        // Se non c'è una location, restituiamo una struttura di pagina vuota
        // per evitare errori nel componente che la riceve.
        return {
            content: [],
            totalPages: 0,
            totalElements: 0,
            number: 0
        };
    }
    try {
        // Usiamo l'oggetto `params` di Axios per costruire l'URL in modo pulito e sicuro.
        // Axios si occuperà di creare la stringa ?location=...&page=...&size=...
        const response = await api.get('/properties/search', {
            params: {
                location: location,
                page: page,
                size: size
                // Puoi aggiungere un ordinamento di default se vuoi, es:
                // sort: 'price,asc'
            }
        });
        
        // Restituisce l'intero oggetto Page { content: [...], ... }
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
