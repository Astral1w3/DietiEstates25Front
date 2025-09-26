import React, { useState } from 'react';
import Header from '../../components/Header/Header'; // Assicurati che il percorso sia corretto
import SearchBar from '../../components/SearchBar/SearchBar';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import MapDisplay from '../../components/MapDisplay/MapDisplay';
import './PropertiesPage.css';

// Dati di esempio. In un'applicazione reale, arriverebbero da un'API.
const mockProperties = [
    { id: 1, price: '3,000 - 3,200', beds: 1, baths: 1, address: '30 Dore St #3e6110519', city: 'San Francisco, CA 94103', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80', lat: 37.772, lon: -122.414, tags: ['PET FRIENDLY'] },
    { id: 2, price: '800 - 850', beds: 0, baths: 1, address: '205 9th Street | 205 9th St #13', city: 'San Francisco, CA 94103', image: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&q=80', lat: 37.775, lon: -122.416, tags: ['NEW - 1 DAY AGO'] },
    { id: 3, price: '4,500', beds: 2, baths: 2, address: '123 Main St', city: 'San Francisco, CA 94105', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80', lat: 37.790, lon: -122.401, tags: ['PET FRIENDLY'] },
    // Aggiungi altri immobili qui...
];

const PropertiesPage = () => {
    const [properties, setProperties] = useState(mockProperties);
    const [hoveredPropertyId, setHoveredPropertyId] = useState(null);

    const handleSearch = (query) => {
        console.log("Ricerca per:", query);
        // Qui andrebbe la logica per chiamare un'API e aggiornare lo stato 'properties'
    };

    return (
        <>
            <div className="properties-page-layout">
                {/* --- Colonna Sinistra: Ricerca e Risultati --- */}
                <div className="listings-column">
                    <SearchBar onSearch={handleSearch} />
                    
                    <div className="listings-header">
                        <h2>San Francisco, CA Apartments & Homes For Rent</h2>
                        <div className="listings-actions">
                            <span>{properties.length} rentals</span>
                            {/* Wildcard per il componente "More" */}
                            <button className="btn-more-placeholder">More ▼</button>
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

                {/* --- Colonna Destra: Mappa --- */}
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