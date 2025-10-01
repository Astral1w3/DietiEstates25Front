import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import MapDisplay from '../../components/MapDisplay/MapDisplay';
import FilterDropdown from '../../components/FilterDropdown/FilterDropdown';
import { useSearchParams, Link } from 'react-router-dom';
import './PropertiesPage.css';

// ---- DATI AGGIORNATI CON ENERGYCLASS ----
export const mockProperties = [
    { id: 1, price: '3,000 - 3,200', beds: 1, baths: 1, address: '30 Dore St #3e6110519', city: 'San Francisco, CA 94103', municipality: 'SoMa', images: ['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1613490493576-75de62addb69?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&q=80'], lat: 37.772, lon: -122.414, tags: ['PET FRIENDLY'], services: ['elevator', 'garage', 'concierge'], energyClass: 'A', transactionType: 'rent' },
    { id: 2, price: '800 - 850', beds: 0, baths: 1, address: '205 9th Street | 205 9th St #13', city: 'San Francisco, CA 94103', municipality: 'SoMa', images: ['https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&q=80'], lat: 37.775, lon: -122.416, tags: ['NEW - 1 DAY AGO'], services: ['heating', 'close to public transport'], energyClass: 'C', transactionType: 'rent' },
    { id: 3, price: '950,000', beds: 2, baths: 2, address: '123 Main St', city: 'San Francisco, CA 94105', municipality: 'Financial District', images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80'], lat: 37.790, lon: -122.401, tags: ['PET FRIENDLY'], services: ['air conditioning', 'elevator', 'balcony', 'close to parks'], energyClass: 'B', transactionType: 'buy' },
    { id: 4, price: '1,200,000', beds: 3, baths: 2, address: '456 Market St', city: 'San Francisco, CA 94105', municipality: 'Financial District', images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1556912173-35f35c9ba959?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80'], lat: 37.792, lon: -122.403, tags: [], services: ['concierge', 'heating', 'garage', 'terrace', 'elevator'], energyClass: 'A', transactionType: 'buy' },
    { id: 5, price: '2,800', beds: 1, baths: 1, address: '789 Mission St', city: 'San Francisco, CA 94103', municipality: 'SoMa', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1592595896551-8c3562145fb6?auto=format&fit=crop&q=80'], lat: 37.781, lon: -122.409, tags: [], services: ['air conditioning', 'close to public transport', 'Cellar'], energyClass: 'D', transactionType: 'rent' },
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
    minPrice: '', maxPrice: '', listingType: '', rooms: '', energyClass: '', city: '', region: '', municipality: '', transactionType: 'any'
};


const PropertiesPage = () => {
    const [properties, setProperties] = useState(mockProperties);
    const [hoveredPropertyId, setHoveredPropertyId] = useState(null);
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState(initialFilters);
    const [selectedServices, setSelectedServices] = useState([]);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const typeFromUrl = searchParams.get('type'); // Legge il valore del parametro 'type'

        if (typeFromUrl === 'buy' || typeFromUrl === 'rent') {
            // Se troviamo un filtro valido nell'URL, lo applichiamo subito
            
            // 1. Aggiorna lo stato dei filtri, così il dropdown mostra la selezione corretta
            const newFilters = { ...initialFilters, transactionType: typeFromUrl };
            setFilters(newFilters);
            
            // 2. Filtra la lista delle proprietà
            const preFilteredProperties = mockProperties.filter(
                p => p.transactionType === typeFromUrl
            );
            setProperties(preFilteredProperties);
        } else {
            // Se non c'è un filtro nell'URL, mostra tutte le proprietà
            setProperties(mockProperties);
            setFilters(initialFilters);
        }
    // La dipendenza [searchParams] assicura che questo effetto si riattivi se l'URL cambia
    }, [searchParams]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceChange = (serviceId) => {
        setSelectedServices(prev => 
            prev.includes(serviceId) 
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const handleApplyFilters = () => {
        const getPriceValue = (priceString) => {
            const cleanedString = String(priceString).replace(/,/g, '').split('-')[0].trim();
            return parseFloat(cleanedString);
        };

        let filteredProperties = [...mockProperties];

        if (filters.transactionType && filters.transactionType !== 'any') {
            filteredProperties = filteredProperties.filter(p => p.transactionType === filters.transactionType);
        }

        // 1. Filtra per Prezzo
        const minPrice = parseFloat(filters.minPrice);
        const maxPrice = parseFloat(filters.maxPrice);

        if (!isNaN(minPrice)) {
            filteredProperties = filteredProperties.filter(p => getPriceValue(p.price) >= minPrice);
        }
        if (!isNaN(maxPrice)) {
            filteredProperties = filteredProperties.filter(p => getPriceValue(p.price) <= maxPrice);
        }
        
        // 2. Filtra per municipality
        if (filters.municipality) {
            filteredProperties = filteredProperties.filter(p => 
                p.municipality.toLowerCase().includes(filters.municipality.toLowerCase())
            );
        }

        // ---- NUOVO: 3. Filtra per numero di stanze (usa la proprietà 'beds' dei dati) ----
        if (filters.rooms) {
            filteredProperties = filteredProperties.filter(p => p.beds === parseInt(filters.rooms, 10));
        }

        // ---- NUOVO: 4. Filtra per classe energetica ----
        if (filters.energyClass) {
            filteredProperties = filteredProperties.filter(p => p.energyClass === filters.energyClass);
        }

        // 5. Filtra per servizi
        if (selectedServices.length > 0) {
            filteredProperties = filteredProperties.filter(property => 
                selectedServices.every(serviceId => property.services.includes(serviceId))
            );
        }

        setProperties(filteredProperties);
        setFilterOpen(false);
    };

    const handleResetFilters = () => {
        setFilters(initialFilters);
        setSelectedServices([]);
        setProperties(mockProperties);
    };

    const handleSearch = (query) => {
        console.log("Ricerca per:", query);
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
                                    availableServices={availableServices}
                                    selectedServices={selectedServices}
                                    onServiceChange={handleServiceChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="property-grid">
                        {properties.map(property => {
                            // MODIFICA: Passa la prima immagine dell'array a PropertyCard
                            const cardProperty = { ...property, image: property.images[0] };
                            return (
                                <Link to={`/property/${property.id}`} key={property.id} className="property-card-link">
                                    <PropertyCard 
                                        property={cardProperty}
                                        onMouseEnter={() => setHoveredPropertyId(property.id)}
                                        onMouseLeave={() => setHoveredPropertyId(null)}
                                    />
                                </Link>
                            )
                        })}
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