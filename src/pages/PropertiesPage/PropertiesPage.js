import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

// Componenti UI
import SearchBar from '../../components/SearchBar/SearchBar';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import MapDisplay from '../../components/MapDisplay/MapDisplay';
import FilterDropdown from '../../components/FilterDropdown/FilterDropdown';

// CSS
import './PropertiesPage.css';

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


// --- Componente Principale ---
const PropertiesPage = () => {
    // STATO 1: Risultati originali dalla ricerca (non cambiano finché non si fa una nuova ricerca)
    const [originalProperties, setOriginalProperties] = useState([]);
    // STATO 2: Proprietà visualizzate, che possono essere filtrate a partire da quelle originali
    const [displayedProperties, setDisplayedProperties] = useState([]);
    
    // Altri stati per la UI
    const [hoveredPropertyId, setHoveredPropertyId] = useState(null);
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState(initialFilters);
    const [selectedServices, setSelectedServices] = useState([]);
    const [searchParams] = useSearchParams();

    // Hook principale per recuperare i dati dal backend quando la URL cambia
    useEffect(() => {
        const location = searchParams.get('location');
        const type = searchParams.get('type');

        const fetchProperties = async () => {
            if (location) {
                try {
                    const response = await axios.get(`http://localhost:8080/properties/search?location=${location}`);
                    let fetchedData = response.data;
                    console.log(fetchedData);

                    // Se l'URL contiene anche un filtro 'type', lo applichiamo subito
                    if (type === 'buy' || type === 'rent') {
                        fetchedData = fetchedData.filter(p => p.transactionType === type);
                        setFilters(prev => ({ ...prev, transactionType: type }));
                    } else {
                        setFilters(initialFilters); // Se non c'è type, resetta il filtro
                    }

                    setOriginalProperties(fetchedData); // Salviamo i dati originali
                    setDisplayedProperties(fetchedData); // E li mostriamo
                } catch (error) {
                    console.error("Errore nel recupero delle proprietà:", error);
                    setOriginalProperties([]);
                    setDisplayedProperties([]);
                }
            } else {
                // Se non c'è una location nella URL, non mostriamo risultati
                setOriginalProperties([]);
                setDisplayedProperties([]);
            }
        };

        fetchProperties();
    }, [searchParams]); // Questo hook si attiva ogni volta che i parametri della URL cambiano

    // Funzione per applicare i filtri sui dati già caricati
    const handleApplyFilters = () => {
        let filtered = [...originalProperties]; // Si parte sempre dai dati originali!

        // Filtro per tipo (Affitto/Vendita)
        if (filters.transactionType && filters.transactionType !== 'any') {
            filtered = filtered.filter(p => p.transactionType === filters.transactionType);
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
        if (filters.rooms) {
            filtered = filtered.filter(p => p.beds === parseInt(filters.rooms, 10));
        }

        // Filtro per classe energetica
        if (filters.energyClass) {
            filtered = filtered.filter(p => p.energyClass === filters.energyClass);
        }

        // Filtro per servizi
        if (selectedServices.length > 0) {
            filtered = filtered.filter(property => 
                selectedServices.every(serviceId => property.services.includes(serviceId))
            );
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
    
    // Titolo dinamico basato sulla ricerca
    const locationQuery = searchParams.get('location');
    const pageTitle = locationQuery ? `Risultati per: "${locationQuery}"` : "Cerca una località per iniziare";

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
                                <Link to={`/property/${property.idProperty}`} key={property.idProperty} className="property-card-link">
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