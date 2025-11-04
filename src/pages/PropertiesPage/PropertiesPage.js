import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useLocation} from 'react-router-dom';
import axios from 'axios';

// Componenti UI
import SearchBar from '../../components/SearchBar/SearchBar';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import MapDisplay from '../../components/MapDisplay/MapDisplay';
import FilterDropdown from '../../components/FilterDropdown/FilterDropdown';

// CSS
import './PropertiesPage.css';

import { searchPropertiesByLocation } from '../../services/propertyService'; // Assicurati che il percorso sia corretto

// --- Costanti ---
// Idealmente, anche questa lista dovrebbe arrivare dal backend per essere dinamica
const availableServices = [
    { id: 'concierge', label: 'Concierge', emoji: '🛎️' },
    { id: 'air conditioning', label: 'Air Conditioning', emoji: '❄️' },
    { id: 'close to schools', label: 'Schools Nearby', emoji: '🏫' },
    { id: 'close to parks', label: 'Parks Nearby', emoji: '🌳' },
    { id: 'close to public transport', label: 'Public Transport', emoji: '🚇' },
    { id: 'elevator', label: 'Elevator', emoji: '🛗' },
    { id: 'heating', label: 'Heating', emoji: '🔥' },
    { id: 'garage', label: 'Garage', emoji: '🚗' },
    { id: 'Cellar', label: 'Cellar', emoji: '🍷' },
    { id: 'balcony', label: 'Balcony', emoji: '🌇' },
    { id: 'terrace', label: 'Terrace', emoji: '🪴' },
];

const initialFilters = {
    minPrice: '', maxPrice: '', rooms: '', energyClass: '', municipality: '', transactionType: 'any'
};

const PropertiesPage = () => {
    const [originalProperties, setOriginalProperties] = useState([]);
    const [displayedProperties, setDisplayedProperties] = useState([]);
    
    // --- NUOVI STATI PER UNA UI MIGLIORE ---
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Altri stati UI (invariati)
    const [hoveredPropertyId, setHoveredPropertyId] = useState(null);
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState(initialFilters);
    const [selectedServices, setSelectedServices] = useState([]);
    const [searchParams] = useSearchParams();
    // --- useEffect REFACTORED ---
    // Ora si occupa solo di orchestrare la chiamata e aggiornare lo stato.
   useEffect(() => {
        const locationQuery = searchParams.get('location');
        const typeQuery = searchParams.get('type'); // Questo sarà "Sale" o "Rent"

        const fetchProperties = async () => {
            if (!locationQuery) {
                // Se non c'è una location, non facciamo nulla
                setOriginalProperties([]);
                setDisplayedProperties([]);
                return;
            }
            
            setIsLoading(true);
            setError(null);
            
            try {
                // 1. Chiamiamo l'API solo con la location. Il filtro per tipo lo facciamo dopo.
                const fetchedData = await searchPropertiesByLocation(locationQuery);

                let initialData = fetchedData; // Partiamo con tutti i dati
                const newFilters = { ...initialFilters };

                // --- INIZIO LOGICA CORRETTA ---
                // 2. Controlliamo se il parametro 'type' esiste nella URL
                if (typeQuery && (typeQuery.toLowerCase() === 'sale' || typeQuery.toLowerCase() === 'rent')) {
                    
                    // 3. Applichiamo il filtro sui dati appena scaricati
                    // Usiamo toLowerCase() per essere sicuri, anche se non strettamente necessario qui
                    initialData = fetchedData.filter(p => p.saleType.toLowerCase() === typeQuery.toLowerCase());
                    
                    // 4. Pre-impostiamo il valore corretto nel dropdown dei filtri
                    newFilters.transactionType = typeQuery;
                }
                // --- FINE LOGICA CORRETTA ---

                setOriginalProperties(fetchedData); // Salviamo sempre i dati originali non filtrati
                setDisplayedProperties(initialData); // Mostriamo i dati filtrati (o tutti se non c'è type)
                setFilters(newFilters); // Aggiorniamo lo stato dei filtri

            } catch (err) {
                console.error("Errore nel recupero delle proprietà:", err);
                setError("Impossibile caricare le proprietà. Riprova più tardi.");
            } finally { 
                setIsLoading(false); 
            }
        };

        fetchProperties();
    }, [searchParams]);

    // Funzione per applicare i filtri sui dati già caricati
    const handleApplyFilters = () => {
        let filtered = [...originalProperties]; // Si parte sempre dai dati originali!

       // 1. Filtro Tipo di Transazione
        if (filters.transactionType && filters.transactionType !== 'any') {
            filtered = filtered.filter(p => p.saleType === filters.transactionType);
        }


        // Filtro per prezzo
        const minPrice = parseFloat(filters.minPrice);
        const maxPrice = parseFloat(filters.maxPrice);
        if (!isNaN(minPrice)) {
            filtered = filtered.filter(p => p.price >= minPrice); // Assumendo che 'price' sia un numero
        }
        if (!isNaN(maxPrice)) {
            filtered = filtered.filter(p => p.price <= maxPrice);
        }

        // Filtro per numero di stanze (es. 'beds' o 'numberOfRooms')
        if (filters.rooms && filters.rooms !== "") {
        filtered = filtered.filter(p => p.numberOfRooms === parseInt(filters.rooms, 10));
        }

        // Filtro per classe energetica
        if (filters.energyClass) {
            filtered = filtered.filter(p => p.energyClass === filters.energyClass);
        }

        // Filtro per servizi
       if (selectedServices.length > 0) {
        filtered = filtered.filter(property => {
            // Controlla che la proprietà `services` esista e sia un array
            if (!property.services || !Array.isArray(property.services)) {
                return false;
            }
            
            // Per ogni servizio selezionato nel filtro (es. 'balcony')...
            return selectedServices.every(serviceId => 
                // ...controlla se esiste almeno UN oggetto nell'array dell'immobile...
                property.services.some(serviceObject => serviceObject.serviceName === serviceId)
                // ...il cui `serviceName` corrisponda.
            );
        });
    }

        setDisplayedProperties(filtered); // Aggiorna la vista con i risultati filtrati
        setFilterOpen(false); // Chiude il dropdown
    };

    // Funzione per resettare i filtri e tornare alla vista originale della ricerca
    const handleResetFilters = () => {
        setFilters(initialFilters);
        setSelectedServices([]);
        setDisplayedProperties(originalProperties); // Mostra di nuovo tutti i risultati originali
        setFilterOpen(false);
    };

    // Handler generico per il cambio dei valori nei campi di filtro
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Handler per la selezione/deselezione dei servizi
    const handleServiceChange = (serviceId) => {
        setSelectedServices(prev => 
            prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
        );
    };
    
    const location = useLocation();

    // Titolo dinamico basato sulla ricerca
    const locationQuery = searchParams.get('location');
    const pageTitle = locationQuery ? `Risultati per: "${locationQuery}"` : "Cerca una località per iniziare";
    
    // 3. Costruisci l'URL di ritorno che include percorso e parametri di ricerca
    const backUrlFromSearch = location.pathname + location.search;


    return (
        <>
            <div className="properties-page-layout">
                <div className="listings-column">
                        <SearchBar />
                    <div className="listings-header">
                        <h2>{pageTitle}</h2>
                        <div className="listings-actions">
                            <span>{displayedProperties.length} risultati</span>
                            <div className="filter-wrapper">
                                <button onClick={() => setFilterOpen(prev => !prev)} className="btn-filter">
                                    Filtri ▼
                                </button>
                                <FilterDropdown
                                    isOpen={isFilterOpen}
                                    onClose={() => setFilterOpen(false)}
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                    onApplyFilters={handleApplyFilters}
                                    onResetFilters={handleResetFilters}
                                    availableServices={availableServices}
                                    selectedServices={selectedServices}
                                    onServiceChange={handleServiceChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="property-grid">
                        {displayedProperties.length > 0 ? (
                            displayedProperties.map(property => (
                                // Usa 'idProperty' come definito nel tuo modello Java
                                <Link 
                                    to={`/property/${property.idProperty}`} 
                                    key={property.idProperty} 
                                    className="property-card-link"
                                    // Qui passiamo l'URL di ritorno alla pagina successiva
                                    state={{ from: backUrlFromSearch }}
                                >
                                    <PropertyCard 
                                        property={property}
                                        onMouseEnter={() => setHoveredPropertyId(property.idProperty)}
                                        onMouseLeave={() => setHoveredPropertyId(null)}
                                    />
                                </Link>

                            ))
                        ) : (
                            <p>Nessun risultato trovato. Prova una nuova ricerca.</p>
                        )}
                    </div>
                </div>

                <div className="map-column">
                    <MapDisplay 
                        properties={displayedProperties} 
                        hoveredPropertyId={hoveredPropertyId} 
                    />
                </div>
            </div>
        </>
    );
};

export default PropertiesPage;