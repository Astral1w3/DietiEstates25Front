import React from 'react';
import './PropertyCard.css';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property, onMouseEnter, onMouseLeave }) => {

    // --- CORREZIONE 1: USA L'ID CORRETTO DAL BACKEND ---
    // Il tuo modello Java usa 'idProperty', non 'id'.
    const detailUrl = `/property/${property.idProperty}`;

    // --- CORREZIONE 2: GESTISCI LA STRUTTURA DATI DEL BACKEND ---
    // Il backend invia un array 'images', non un singolo campo 'image'.
    // Prendiamo la prima immagine o usiamo un placeholder se non ce ne sono.
    const imageUrl = property.images && property.images.length > 0 
        ? property.images[0].imageUrl // Assumendo che l'oggetto Image abbia un campo imageUrl
        : 'https://via.placeholder.com/400x260?text=Immagine+non+disponibile';

    // --- CORREZIONE 3 (LA CAUSA DELL'ERRORE): CREA STRINGHE LEGGIBILI DALL'OGGETTO ADDRESS ---
    // Controlliamo che 'property.address' esista prima di provare a leggerlo.
    const displayAddress = property.address
        ? `${property.address.street}, ${property.address.houseNumber}`
        : 'Indirizzo non disponibile';

    const displayLocation = property.address
        ? `${property.address.municipality}` // Usiamo 'municipality' invece del vecchio 'city'
        : 'Località non disponibile';
    
    // Formattiamo il prezzo per la valuta locale
    const formattedPrice = property.price 
        ? new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(property.price)
        : 'Prezzo non disponibile';


    return (
        <Link to={detailUrl} className="property-card-link">
            <div className="property-card" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                <div className="card-image-container">
                    {/* Usiamo le variabili sicure che abbiamo creato */}
                    <img src={imageUrl} alt={`Immagine di ${displayAddress}`} />
                    {property.tags && property.tags.map(tag => (
                        <span key={tag} className="card-tag">{tag}</span>
                    ))}
                </div>
                <div className="card-details">
                    {/* Mostriamo il prezzo formattato */}
                    <p className="card-price">{formattedPrice}</p>
                    <p className="card-specs">
                        {/* Usiamo 'numberOfRooms' dal modello Java invece di 'beds'/'baths' */}
                        <span>{property.numberOfRooms || 'N/A'} stanze</span>
                        <span> • {property.squareMeters || 'N/A'} m²</span>
                    </p>
                    {/* --- CORREZIONE 4: USA LE STRINGHE CREATE INVECE DEGLI OGGETTI --- */}
                    <p className="card-address">{displayAddress}</p>
                    <p className="card-city">{displayLocation}</p>
                    <button className="card-cta-btn">Maggiori Dettagli</button>
                </div>
            </div>
        </Link>
    );
};

export default PropertyCard;