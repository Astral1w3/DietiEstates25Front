import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// --- Componenti UI ---
import PropertyGallery from '../../components/PropertyGallery/PropertyGallery';
import MapDisplay from '../../components/MapDisplay/MapDisplay';
import DatePicker from 'react-datepicker';

// --- CSS ---
import 'react-datepicker/dist/react-datepicker.css';
import './PropertyDetailPage.css';

// --- Componente Principale ---
const PropertyDetailPage = () => {
    // STATO: Dati dell'immobile, caricamento e errori
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // STATO per i modali (finestre popup)
    const [isTourModalOpen, setIsTourModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [offerPrice, setOfferPrice] = useState('');
    const [offerError, setOfferError] = useState('');

    // HOOKS: Per ottenere l'ID dalla URL, navigare e controllare l'autenticazione
    const { propertyId } = useParams();
    const { isAuthenticated} = useAuth(); // Assumiamo che il contesto fornisca anche i dati dell'utente


    // --- EFFETTO PRINCIPALE: Caricamento dati dal backend ---
    useEffect(() => {
        // Funzione asincrona per caricare i dati dell'immobile
        const fetchProperty = async () => {
            if (!propertyId) return;
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/properties/${propertyId}`);
                setProperty(response.data);
                setError(null);
            } catch (err) {
                console.error("Errore nel recupero dei dettagli dell'immobile:", err);
                setError("Immobile non trovato o errore nel caricamento.");
                setProperty(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [propertyId]); // Si riattiva solo se l'ID nella URL cambia

    // --- GESTORI DI EVENTI PER LE AZIONI ---

    // Prenotazione visita
    const handleTourSubmit = async () => {
        if (!selectedDate) {
            alert("Per favore, seleziona una data.");
            return;
        }
        try {
            // L'endpoint deve corrispondere a quello del tuo backend
            await axios.post('http://localhost:8080/visits/book', {
                propertyId: property.idProperty,
                visitDate: selectedDate.toISOString(), // Invia la data in formato standard
                // Il backend ricaverà l'utente dal token di autenticazione
            });
            alert(`Visita richiesta con successo per il giorno: ${selectedDate.toLocaleDateString()}`);
            setIsTourModalOpen(false);
            setSelectedDate(null);
        } catch (error) {
            console.error("Errore nella prenotazione della visita:", error);
            alert("Si è verificato un errore. Riprova più tardi.");
        }
    };

    // Invio offerta
    const handleOfferSubmit = async () => {
        const priceValue = parseFloat(offerPrice);

        if (!priceValue || priceValue <= 0) {
            setOfferError('Inserisci un importo valido.');
            return;
        }
        if (priceValue >= property.price) {
            setOfferError(`L'offerta deve essere inferiore al prezzo attuale.`);
            return;
        }

        try {
            // L'endpoint deve corrispondere a quello del tuo backend
            await axios.post('http://localhost:8080/offers/create', {
                propertyId: property.idProperty,
                offerPrice: priceValue,
                // Il backend ricaverà l'utente dal token di autenticazione
            });
            setOfferError('');
            alert(`Offerta di ${priceValue.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })} inviata con successo!`);
            setIsOfferModalOpen(false);
            setOfferPrice('');
        } catch (error) {
            console.error("Errore nell'invio dell'offerta:", error);
            setOfferError("Errore del server. Riprova più tardi.");
        }
    };

    // --- LOGICA DI RENDER ---

    // Gestione degli stati di caricamento ed errore
    if (loading) return <div className="property-detail-container"><h2>Caricamento...</h2></div>;
    if (error) return <div className="property-detail-container"><h2>{error}</h2></div>;
    if (!property) return <div className="property-detail-container"><h2>Immobile non trovato.</h2></div>;

    // Preparazione dati per la vista
    const isForRent = property.saleTypes.some(st => st.saleType.toLowerCase() === 'rent');
    const fullAddress = `${property.address.street}, ${property.address.houseNumber} - ${property.address.municipality.municipalityName} (${property.address.municipality.province.acronym})`;
    
    // Lista dei servizi da mostrare
    const featureList = property.services.map(service => service.serviceName);

    return (
        <div className="property-detail-container">
            <main className="property-detail-main">
                <Link to="/properties" className="back-to-search-link">← Torna alla Ricerca</Link>
                {/* Il componente gallery ora riceve le immagini dal backend */}
                <PropertyGallery images={property.images} />
                
                <div className="detail-grid">
                    <div className="info-primary">
                        <h1>{fullAddress}</h1>
                        <h2>
                            {/* Formattazione del prezzo dal dato numerico */}
                            {property.price.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                            {isForRent && ' / mese'}
                        </h2>
                        <div className="stats">
                            {/* Dati presi direttamente dal modello Property */}
                            <span>{property.numberOfRooms} {property.numberOfRooms === 1 ? 'Locale' : 'Locali'}</span>
                            <span>{property.squareMeters} m²</span>
                            <span>Classe Energetica {property.energyClass}</span>
                        </div>
                    </div>

                    <div className="contact-box">
                        <button className="btn btn-primary btn-contact" onClick={() => setIsTourModalOpen(true)} disabled={!isAuthenticated}>
                            Richiedi una Visita
                        </button>
                        {!isForRent && (
                            <button className="btn btn-primary btn-contact" onClick={() => setIsOfferModalOpen(true)} disabled={!isAuthenticated}>
                                Fai un'Offerta
                            </button>
                        )}
                        {!isAuthenticated && (<p className="auth-message">Devi effettuare l'accesso per eseguire questa azione.</p>)}
                    </div>
                </div>

                {/* --- Modali per Visita e Offerta (Logica invariata ma ora funzionali) --- */}
                {isAuthenticated && isTourModalOpen && (
                    <div className="modal-overlay" onClick={() => setIsTourModalOpen(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Seleziona una data per la visita</h2>
                            <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} inline minDate={new Date()} />
                            <div className="modal-actions">
                                <button className="btn btn-secondary" onClick={() => setIsTourModalOpen(false)}>Annulla</button>
                                <button className="btn btn-primary" onClick={handleTourSubmit}>Invia Richiesta</button>
                            </div>
                        </div>
                    </div>
                )}
                 {isAuthenticated && isOfferModalOpen && (
                     <div className="modal-overlay" onClick={() => setIsOfferModalOpen(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Fai la tua offerta</h2>
                            <p>Prezzo attuale: {property.price.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</p>
                            <div className="offer-input-group">
                                <label htmlFor="offerPrice">La tua offerta (€)</label>
                                <input
                                    type="number"
                                    id="offerPrice"
                                    value={offerPrice}
                                    onChange={(e) => setOfferPrice(e.target.value)}
                                    placeholder="Es. 450000"
                                />
                            </div>
                            {offerError && <p className="modal-error">{offerError}</p>}
                            <div className="modal-actions">
                                <button className="btn btn-secondary" onClick={() => setIsOfferModalOpen(false)}>Annulla</button>
                                <button className="btn btn-primary" onClick={handleOfferSubmit}>Invia Offerta</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Sezioni informative dinamiche --- */}
                <section className="info-section">
                    <h2>Descrizione</h2>
                    <p>{property.description}</p>
                </section>
                
                <section className="info-section">
                    <h2>Caratteristiche Principali</h2>
                    <ul>{featureList.map((feature, i) => <li key={i}>{feature}</li>)}</ul>
                </section>

                <section className="info-section">
                    <h2>Posizione</h2>
                    {/* La mappa ora mostra la posizione dell'immobile specifico */}
                    <div className="map-wrapper"><MapDisplay properties={[property]} hoveredPropertyId={property.idProperty} /></div>
                </section>
            </main>
        </div>
    );
};

export default PropertyDetailPage;