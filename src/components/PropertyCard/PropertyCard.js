import React from 'react';
import './PropertyCard.css';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property, onMouseEnter, onMouseLeave }) => {


    const detailUrl = `/property/${property.id}`;

    return (
        <Link to={detailUrl} className="property-card-link">
            <div className="property-card" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                <div className="card-image-container">
                    <img src={property.image} alt={`View of ${property.address}`} />
                    {property.tags && property.tags.map(tag => (
                        <span key={tag} className="card-tag">{tag}</span>
                    ))}
                </div>
                <div className="card-details">
                    <p className="card-price">${property.price}/mo</p>
                    <p className="card-specs">
                        {property.beds > 0 && <span>{property.beds} Bed</span>}
                        {property.beds === 0 && <span>Studio</span>}
                        • {property.baths} Bath
                    </p>
                    <p className="card-address">{property.address}</p>
                    <p className="card-city">{property.city}</p>
                    <button className="card-cta-btn">Check Availability</button>
                </div>
            </div>
        </Link>
    );
};

export default PropertyCard;