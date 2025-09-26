// src/pages/PropertyDetailPage/PropertyDetailPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import PropertyGallery from '../../components/PropertyGallery/PropertyGallery'; // Assicurati che il percorso sia corretto
import MapDisplay from '../../components/MapDisplay/MapDisplay'; // Assicurati che il percorso sia corretto
import './PropertyDetailPage.css';

// --- DATI DI ESEMPIO ---
// In un'applicazione reale, questi dati arriverebbero da un'API (es. tramite un fetch in un useEffect)
const propertyData = {
    id: 101,
    address: "205 9th Street",
    city: "San Francisco",
    state: "CA",
    zip: "94103",
    neighborhood: "South of Market",
    priceRange: "800 - 850",
    type: "Studio",
    baths: 1,
    sqft: "85-100",
    petsAllowed: false,
    lat: 37.775, // Latitudine per la mappa
    lon: -122.416, // Longitudine per la mappa
    images: [
        'https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg', // Immagine principale dalla tua screenshot
        'https://www.houseplans.net/news/wp-content/uploads/2023/07/57260-768.jpeg',
        'https://cdn.houseplansservices.com/content/1ejsiv8an572jogir72p0013mb/w991x660.jpg?v=9', // Lavanderia
        'https://medias.renoassistance.ca/image/upload/ar_4:3,c_crop/v1730239142/renoassistance/residential/articles/2023-12/styles-de-maison/Modern-house-with-pool.jpg', // Immagine placeholder
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdYC_kWlqhsSTmk2YwsdYBMOWf4GIMpsyynA&s',       // Immagine placeholder
        'https://media.istockphoto.com/id/2159247990/photo/front-view-of-modern-style-small-cottage-house-on-the-green-lawn-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=gnHL_022aV03ZpQApKdky5JLVjZEIFrc2u7xpaGnsE4=',          // Immagine placeholder
    ],
    description: "This SRO unit offers an affordable and convenient living option right in the heart of SOMA. Located just steps from Market Street, you'll have easy access to downtown, Civic Center, and countless neighborhood restaurants, shops, and nightlife. Public transit is just around the corner, with nearby BART, MUNI bus lines, and light rail making commuting simple. You'll also be close to Trader Joe's, Costco, and the lively Mid-Market corridor.",
    keyFeatures: [
        "Shared laundry in building",
        "Shared kitchen in building"
    ],
    qualifications: [
        "Credit Score of 650+",
        "Monthly income of 3x the amount of rent",
        "Positive references"
    ],
    terms: ["1-year lease"],
    costs: {
        rent: "$800 - $850/mo",
        securityDeposit: "$800 - $850",
        applicationFee: "Contact",
        adminFee: "Contact"
    }
};


const PropertyDetailPage = () => {
    // Poiché MapDisplay si aspetta un array 'properties', gli passiamo i nostri dati dentro un array.
    // L'hoveredPropertyId fa sì che la nostra unica puntina sia evidenziata (rossa).
    const mapProperties = [propertyData];

    return (
        <div className="property-detail-container">
            <main className="property-detail-main">
                <Link to="/properties"className="back-to-search-link">← Back to Search</Link>
                
                <PropertyGallery images={propertyData.images} />

                {/* --- SEZIONE INFO PRINCIPALI E CONTATTO --- */}
                <div className="detail-grid">
                    <div className="info-primary">
                        <h1>{propertyData.address}</h1>
                        <p>{propertyData.city}, {propertyData.state} {propertyData.zip} · <a href="#">{propertyData.neighborhood}</a></p>
                        <div className="stats">
                            <span>{propertyData.type}</span>
                            <span>{propertyData.baths} Bath</span>
                            <span>{propertyData.sqft} sqft</span>
                        </div>
                        <p className="pet-policy">{propertyData.petsAllowed ? '✓ Pets Allowed' : '✓ No Pets'}</p>
                    </div>
                    
                    <button className="btn btn-primary btn-contact">Contact This Property</button>
                    
                </div>

                {/* --- SEZIONE COSTI --- */}
                <section className="info-section">
                    <h2>Costs & Fees</h2>
                    <div className="cost-item"><span>Base rent</span> <span>{propertyData.costs.rent}</span></div>
                    <div className="cost-item"><span>Security deposit</span> <span>{propertyData.costs.securityDeposit}</span></div>
                    <div className="cost-item"><span>Application fee</span> <span>{propertyData.costs.applicationFee}</span></div>
                    <div className="cost-item"><span>Administrative fee</span> <span>{propertyData.costs.adminFee}</span></div>
                </section>
                
                {/* --- SEZIONE DESCRIZIONE --- */}
                 <section className="info-section">
                    <h2>Description</h2>
                    <p>{propertyData.description}</p>
                 </section>

                {/* --- ALTRE SEZIONI --- */}
                <section className="info-section">
                    <h2>KEY FEATURES</h2>
                    <ul>{propertyData.keyFeatures.map((f, i) => <li key={i}>{f}</li>)}</ul>

                    <h2>QUALIFICATIONS</h2>
                    <ul>{propertyData.qualifications.map((q, i) => <li key={i}>{q}</li>)}</ul>
                    
                    <h2>TERMS</h2>
                    <ul>{propertyData.terms.map((t, i) => <li key={i}>{t}</li>)}</ul>
                </section>

                {/* --- SEZIONE MAPPA --- */}
                <section className="info-section">
                    <h2>Local Information</h2>
                    <div className="map-wrapper">
                        <MapDisplay 
                            properties={mapProperties} 
                            hoveredPropertyId={propertyData.id} 
                        />
                    </div>
                </section>

            </main>
        </div>
    );
};

export default PropertyDetailPage;