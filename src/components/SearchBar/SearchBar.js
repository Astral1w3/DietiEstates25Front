import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GeoapifyGeocoderAutocomplete,
    GeoapifyContext
} from '@geoapify/react-geocoder-autocomplete';

// Importa lo stile base per i suggerimenti. Puoi personalizzarlo nel tuo CSS.
import '@geoapify/geocoder-autocomplete/styles/minimal.css'; 
import './SearchBar.css'; // Il tuo CSS personalizzato

const SearchBar = () => {
    const navigate = useNavigate();

    // Funzione che viene chiamata quando l'utente SELEZIONA un suggerimento dalla lista.
    // 'place' è l'oggetto completo restituito da Geoapify.
    const handlePlaceSelect = (place) => {
        if (place) {
            const props = place.properties;
            const locationName = props.city || props.state || props.postcode || props.name;

            if (locationName) {
                navigate(`/properties?location=${encodeURIComponent(locationName)}`);
            }
        }
    };

     const filterSuggestions = (suggestions) => {
        const allowedTypes = [
            'city', 
            'state',      // Le regioni sono spesso di tipo 'state'
            'county',     // Le province
            'postcode',
            'region'      // Aggiungiamo 'region' per sicurezza
        ];
        return suggestions.filter(suggestion => 
            allowedTypes.includes(suggestion.properties.result_type)
        );
    };

    // La tua API Key di Geoapify
    const GEOAPIFY_API_KEY = "10c85af945f84d199501c9b466918a85"; // Sostituisci con la tua chiave se diversa

    return (
        // Non usiamo più un <form> tradizionale, perché la logica è gestita dal componente Geoapify.
        <div className="page-search-form">
            
            {/* Il provider GeoapifyContext è necessario per passare la API Key */}
            <GeoapifyContext apiKey={GEOAPIFY_API_KEY} className="geopify-context">
            
                {/* Questo è il componente di autocompletamento */}
                <GeoapifyGeocoderAutocomplete
                    placeholder="Cerca per città o regione "
                    
                    lang="it" // Lingua dei risultati
                    filterByCountryCode={["it"]} // Limita la ricerca solo all'Italia
                    suggestionsFilter={filterSuggestions}
                    // --- GESTIONE DEGLI EVENTI ---
                    placeSelect={handlePlaceSelect} // Attivato quando si clicca un suggerimento
                    className="geopify-geocoder-autocomplete"
                />

            </GeoapifyContext>

            {/* Il pulsante non è più di tipo "submit", ma potrebbe essere usato
                per attivare la ricerca manualmente se lo si desidera, anche se
                la logica di Geoapify è già molto efficiente. Lo lasciamo per coerenza visiva. */}
            <button type="button" aria-label="Search" className="search-button-static">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
        </div>
    );
};

export default SearchBar;