import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// --- Servizi ---
import { getPropertyById, trackPropertyView } from '../../services/propertyService';

// --- Componenti UI ---
import PropertyGallery from '../../components/PropertyGallery/PropertyGallery';
import MapDisplay from '../../components/MapDisplay/MapDisplay';
import BookingVisitModal from '../../components/BookingVisitModal/BookingVisitModal';
import MakeOfferModal from '../../components/MakeOfferModal/MakeOfferModal'; // <-- NUOVO IMPORT

// --- CSS ---
import './PropertyDetailPage.css';

// --- Componente Principale ---
const PropertyDetailPage = () => {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // STATO PER I MODALI (ORA MOLTO PIÙ SEMPLICE)
    const [isTourModalOpen, setIsTourModalOpen] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false); // <-- Un solo stato per il modale

    const { propertyId } = useParams();
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    useEffect(() => {
    const fetchPropertyAndTrackView = async () => {
        if (propertyId) {
            try {
                // Traccia la visualizzazione
                await trackPropertyView(propertyId);

                // Carica i dati della proprietà
                setLoading(true);
                const data = await getPropertyById(propertyId);
                setProperty(data);
                setError(null);
            } catch (err) {
                console.error("Error retrieving or tracking property:", err);
                setError("Property not found or loading error.");
                setProperty(null);
            } finally {
                setLoading(false);
            }
        }
    }; 
        fetchPropertyAndTrackView();
    }, [propertyId]); // Esegui l'effetto quando propertyId cambia

    // 3. Determina l'URL di ritorno.
    //    Usa quello passato nello stato, altrimenti usa un fallback generico.
    const backLinkUrl = location.state?.from || '/properties';

    // --- EFFETTO PRINCIPALE: Caricamento dati dal backend ---
    useEffect(() => {
        const fetchProperty = async () => {
            if (!propertyId) return;
            try {
                setLoading(true);
                const data = await getPropertyById(propertyId);
                setProperty(data);
                setError(null);
            } catch (err) {
                console.error("Error retrieving property details:", err);
                setError("Property not found or loading error.");
                setProperty(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [propertyId]);


    // --- LOGICA DI RENDER ---
    if (loading) return <div className="property-detail-container"><h2>Loading...</h2></div>;
    if (error) return <div className="property-detail-container"><h2>{error}</h2></div>;
    if (!property) return <div className="property-detail-container"><h2>Property not found.</h2></div>;

    const isForRent = property.saleTypes.some(st => st.saleType.toLowerCase() === 'rent');
    const fullAddress = `${property.address.street}, ${property.address.houseNumber} - ${property.address.municipality.municipalityName} (${property.address.municipality.province.acronym})`;
    const featureList = property.services.map(service => service.serviceName);
    return (
        <div className="property-detail-container">
            <main className="property-detail-main">
                <Link to={backLinkUrl} className="back-to-search-link">← Back to Search</Link>
                {/* Il componente gallery ora riceve le immagini dal backend */}
                <PropertyGallery images={property.imageUrls} />
                
                <div className="detail-grid">
                    <div className="info-primary">
                        <h1>{fullAddress}</h1>
                        <h2>
                            {/* Formattazione del prezzo dal dato numerico */}
                            {property.price.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                            {isForRent && ' / month'}
                        </h2>
                        <div className="stats">
                            {/* Dati presi direttamente dal modello Property */}
                            <span>{property.numberOfRooms} {property.numberOfRooms === 1 ? 'Locale' : 'Locali'}</span>
                            <span>{property.squareMeters} m²</span>
                            <span>Energy Class {property.energyClass}</span>
                        </div>
                    </div>

                    <div className="contact-box">
                        <button className="btn btn-primary btn-contact" onClick={() => setIsTourModalOpen(true)} disabled={!isAuthenticated}>
                            Request a Visit
                        </button>
                        {!isForRent && (
                            <button className="btn btn-primary btn-contact" onClick={() => setIsOfferModalOpen(true)} disabled={!isAuthenticated}>
                                Make an Offer
                            </button>
                        )}
                        {!isAuthenticated && (<p className="auth-message">You must log in to perform this action.</p>)}
                    </div>
                </div>

                {isAuthenticated && (
                    <>
                        <BookingVisitModal
                            isOpen={isTourModalOpen}
                            onClose={() => setIsTourModalOpen(false)}
                            propertyId={property.idProperty}
                        />
                        <MakeOfferModal
                            isOpen={isOfferModalOpen}
                            onClose={() => setIsOfferModalOpen(false)}
                            propertyId={property.idProperty}
                            currentPrice={property.price}
                        />
                    </>
                )}
                 

                {/* --- Sezioni informative dinamiche --- */}
                <section className="info-section">
                    <h2>Description</h2>
                    <p>{property.description}</p>
                </section>
                
                <section className="info-section">
                    <h2>Main Features</h2>
                    <ul>{featureList.map((feature, i) => <li key={i}>{feature}</li>)}</ul>
                </section>

                <section className="info-section">
                    <h2>Position</h2>
                    {/* La mappa ora mostra la posizione dell'immobile specifico */}
                    <div className="map-wrapper"><MapDisplay properties={[property]} hoveredPropertyId={property.idProperty} /></div>
                </section>
            </main>
        </div>
    );
};

export default PropertyDetailPage;