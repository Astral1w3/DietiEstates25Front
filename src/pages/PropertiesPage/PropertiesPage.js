import React, { useState } from 'react';
import Header from '../../components/Header/Header'; // Assicurati che il percorso sia corretto
import SearchBar from '../../components/SearchBar/SearchBar';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import MapDisplay from '../../components/MapDisplay/MapDisplay';
import FilterDropdown from '../../components/FilterDropdown/FilterDropdown';
import './PropertiesPage.css';

// ---- DATI AGGIORNATI CON MUNICIPALITY E SERVICES ----
const mockProperties = [
    { id: 1, price: '3,000 - 3,200', beds: 1, baths: 1, address: '30 Dore St #3e6110519', city: 'San Francisco, CA 94103', municipality: 'SoMa', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80', lat: 37.772, lon: -122.414, tags: ['PET FRIENDLY'], services: ['elevator', 'garage', 'concierge'] },
    { id: 2, price: '800 - 850', beds: 0, baths: 1, address: '205 9th Street | 205 9th St #13', city: 'San Francisco, CA 94103', municipality: 'SoMa', image: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&q=80', lat: 37.775, lon: -122.416, tags: ['NEW - 1 DAY AGO'], services: ['heating', 'close to public transport'] },
    { id: 3, price: '4,500', beds: 2, baths: 2, address: '123 Main St', city: 'San Francisco, CA 94105', municipality: 'Financial District', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80', lat: 37.790, lon: -122.401, tags: ['PET FRIENDLY'], services: ['air conditioning', 'elevator', 'balcony', 'close to parks'] },
    { id: 4, price: '6,200', beds: 3, baths: 2, address: '456 Market St', city: 'San Francisco, CA 94105', municipality: 'Financial District', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80', lat: 37.792, lon: -122.403, tags: [], services: ['concierge', 'heating', 'garage', 'terrace', 'elevator'] },
    { id: 5, price: '2,800', beds: 1, baths: 1, address: '789 Mission St', city: 'San Francisco, CA 94103', municipality: 'SoMa', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80', lat: 37.781, lon: -122.409, tags: [], services: ['air conditioning', 'close to public transport', 'Cellar'] },
];

// ---- LISTA DEI SERVIZI DISPONIBILI ----
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

// ---- FILTRI INIZIALI AGGIORNATI ----
const initialFilters = {
    minPrice: '', maxPrice: '', listingType: '', rooms: '', energyClass: '', city: '', region: '', municipality: ''
};


const PropertiesPage = () => {
    const [properties, setProperties] = useState(mockProperties);
    const [hoveredPropertyId, setHoveredPropertyId] = useState(null);
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState(initialFilters);

    // ---- NUOVO STATO PER I SERVIZI SELEZIONATI ----
    const [selectedServices, setSelectedServices] = useState([]);

    // ---- HANDLER PER I CAMPI DI TESTO DEI FILTRI ----
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // ---- NUOVO HANDLER PER LE CHECKBOX DEI SERVIZI ----
    const handleServiceChange = (serviceId) => {
        setSelectedServices(prev => 
            prev.includes(serviceId) 
                ? prev.filter(id => id !== serviceId) // Se già presente, lo rimuove (uncheck)
                : [...prev, serviceId] // Altrimenti, lo aggiunge (check)
        );
    };

    const handleApplyFilters = () => {
        // Funzione helper per estrarre un valore numerico pulito da una stringa di prezzo
        const getPriceValue = (priceString) => {
            // Rimuove le virgole, poi prende solo la prima parte (es. da '3,000 - 3,200' prende '3000')
            const cleanedString = String(priceString).replace(/,/g, '').split('-')[0].trim();
            return parseFloat(cleanedString);
        };

        let filteredProperties = [...mockProperties];

        // 1. Filtra per Prezzo
        const minPrice = parseFloat(filters.minPrice);
        const maxPrice = parseFloat(filters.maxPrice);

        if (!isNaN(minPrice)) {
            filteredProperties = filteredProperties.filter(p => {
                const propertyPrice = getPriceValue(p.price);
                return propertyPrice >= minPrice;
            });
        }

        if (!isNaN(maxPrice)) {
            filteredProperties = filteredProperties.filter(p => {
                const propertyPrice = getPriceValue(p.price);
                return propertyPrice <= maxPrice;
            });
        }
        
        // 2. Filtra per municipality (se specificata)
        if (filters.municipality) {
            filteredProperties = filteredProperties.filter(p => 
                p.municipality.toLowerCase().includes(filters.municipality.toLowerCase())
            );
        }

        // 3. Filtra per servizi (se selezionati)
        if (selectedServices.length > 0) {
            filteredProperties = filteredProperties.filter(property => 
                selectedServices.every(serviceId => property.services.includes(serviceId))
            );
        }

        // Aggiungi qui altre logiche di filtro (stanze, etc.) se necessario

        setProperties(filteredProperties);
        setFilterOpen(false); // Chiudi il dropdown dopo aver applicato
    };

    // ---- LOGICA DI RESET AGGIORNATA ----
    const handleResetFilters = () => {
        setFilters(initialFilters);
        setSelectedServices([]);
        setProperties(mockProperties); // Ricarica le proprietà originali
    };

    const handleSearch = (query) => {
        console.log("Ricerca per:", query);
        // La logica di ricerca potrebbe essere integrata con i filtri
        const results = mockProperties.filter(p => 
            p.address.toLowerCase().includes(query.toLowerCase()) ||
            p.city.toLowerCase().includes(query.toLowerCase()) ||
            p.municipality.toLowerCase().includes(query.toLowerCase())
        );
        setProperties(results);
    };

    return (
        <>
            <div className="properties-page-layout">
                <div className="listings-column">
                    <SearchBar onSearch={handleSearch} />
                    
                    <div className="listings-header">
                        <h2>San Francisco, CA Apartments & Homes For Rent</h2>
                        <div className="listings-actions">
                            <span>{properties.length} rentals</span>
                            
                            <div className="filter-wrapper">
                                <button onClick={() => setFilterOpen(prev => !prev)} className="btn-filter">
                                    Filter ▼
                                </button>
                                <FilterDropdown
                                    isOpen={isFilterOpen}
                                    onClose={() => setFilterOpen(false)}
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                    onApplyFilters={handleApplyFilters}
                                    onResetFilters={handleResetFilters}
                                    // --- NUOVE PROPS PER I SERVIZI ---
                                    availableServices={availableServices}
                                    selectedServices={selectedServices}
                                    onServiceChange={handleServiceChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="property-grid">
                        {properties.map(property => (
                            <PropertyCard 
                                key={property.id} 
                                property={property}
                                onMouseEnter={() => setHoveredPropertyId(property.id)}
                                onMouseLeave={() => setHoveredPropertyId(null)}
                            />
                        ))}
                    </div>
                </div>

                <div className="map-column">
                    <MapDisplay 
                        properties={properties} 
                        hoveredPropertyId={hoveredPropertyId} 
                    />
                </div>
            </div>
        </>
    );
};

export default PropertiesPage;