// src/components/PropertyCard/PropertyCard.js

import React from 'react';
import './PropertyCard.css';
// --- 1. RIMUOVI L'IMPORT DI LINK, NON SERVE PIÙ ---
// import { Link } from 'react-router-dom'; 

const PropertyCard = ({ property, onMouseEnter, onMouseLeave }) => {
    // La variabile detailUrl non è più necessaria qui
    // const detailUrl = `/property/${property.idProperty}`;

    const imageUrl = property.imageUrls && property.imageUrls.length > 0 
        ? property.imageUrls[0]
        : `${process.env.PUBLIC_URL}/notFound.jpg`;

    const displayAddress = property.address
        ? `${property.address.street}, ${property.address.houseNumber}`
        : 'Indirizzo non disponibile';

    const displayLocation = property.address
        ? `${property.address.municipality.municipalityName}`
        : 'Località non disponibile';

    const displayZipCode = property.address
        ? `${property.address.municipality.zipCode}`
        : 'ZipCode non disponibile';
    
    const formattedPrice = property.price 
        ? new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(property.price)
        : 'Prezzo non disponibile';

    // --- 2. RIMUOVI IL COMPONENTE <Link> CHE AVVOLGE TUTTO ---
    // Il return ora inizia direttamente con il <div>
    return (
        <div className="property-card" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <div className="card-image-container">
                <img src={imageUrl} alt={`Immagine di ${displayAddress}`} />
                {property.tags && property.tags.map(tag => (
                    <span key={tag} className="card-tag">{tag}</span>
                ))}
            </div>
            <div className="card-details">
                <p className="card-price">{formattedPrice}</p>
                <p className="card-specs">
                    <span>{property.numberOfRooms || 'N/A'} stanze</span>
                    <span> • {property.squareMeters || 'N/A'} m²</span>
                </p>
                <p className="card-address">{displayAddress}</p>
                <p className="card-city">{displayLocation} - {displayZipCode}</p>
                <button className="card-cta-btn">Maggiori Dettagli</button>
            </div>
        </div>
    );
};

export default PropertyCard;