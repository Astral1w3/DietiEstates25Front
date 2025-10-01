const API_BASE_URL = '/api'; // O 'http://localhost:8080/api' se il backend è su un'altra porta

/**
 * Funzione per creare una nuova proprietà.
 * Gestisce la chiamata fetch, la gestione degli errori e la restituzione dei dati.
 * @param {object} payload - L'oggetto contenente i dati della proprietà da inviare.
 * @returns {Promise<object>} - Una Promise che si risolve con i dati della proprietà creata.
 * @throws {Error} - Lancia un errore se la chiamata fallisce.
 */
export const createProperty = async (payload) => {
    try {
        const response = await fetch(`${API_BASE_URL}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            // Se il server risponde con un errore, cerchiamo di leggere il messaggio
            // e lanciamo un errore che verrà catturato nel componente.
            const errorData = await response.json().catch(() => ({})); // .catch per evitare errori se il corpo non è JSON
            throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
        }

        // Se la chiamata ha successo, restituiamo i dati JSON.
        return await response.json();

    } catch (error) {
        // Rilanciamo l'errore per permettere al componente di gestirlo.
        // Questo cattura sia gli errori di rete (es. server non raggiungibile) 
        // sia gli errori che abbiamo lanciato manualmente sopra.
        console.error("API Error in createProperty:", error);
        throw error;
    }
};
