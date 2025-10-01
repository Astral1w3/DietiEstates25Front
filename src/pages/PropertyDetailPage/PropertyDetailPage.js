
    import { Link, useParams } from 'react-router-dom';
    import React, { useState } from 'react';
    import { useAuth } from '../../context/AuthContext.js';
    import PropertyGallery from '../../components/PropertyGallery/PropertyGallery';
    import MapDisplay from '../../components/MapDisplay/MapDisplay';
    import DatePicker from 'react-datepicker';
    import 'react-datepicker/dist/react-datepicker.css';
    import './PropertyDetailPage.css';


    import { mockProperties } from '../PropertiesPage/PropertiesPage.js';

    const getNumericPrice = (priceString) => {
        if (!priceString) return 0;
        const cleanedString = String(priceString).replace(/,/g, '').split('-')[0].trim();
        return parseFloat(cleanedString);
    };






    const PropertyDetailPage = () => {

        const { propertyId } = useParams(); 
        const property = mockProperties.find(p => p.id === parseInt(propertyId));

        const [isTourModalOpen, setIsTourModalOpen] = useState(false);
        const [selectedDate, setSelectedDate] = useState(null);
        const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
        const [offerPrice, setOfferPrice] = useState('');
        const [offerError, setOfferError] = useState('');

        const { isAuthenticated } = useAuth();
        

        if (!property) {
            return <div className="property-detail-container"><h2>Property not found.</h2></div>;
        }

        const numericPrice = getNumericPrice(property.price);
        const isForRent = property.transactionType === 'rent';

        const handleOpenTourModal = () => setIsTourModalOpen(true);
        const handleCloseTourModal = () => {
            setIsTourModalOpen(false);
            setSelectedDate(null);
        };
        const handleTourSubmit = () => {
            if (selectedDate) {
                alert(`Visit requested for: ${selectedDate.toLocaleDateString()}`);
                handleCloseTourModal();
            } else {
                alert("Please select a date.");
            }
        };

        const handleOpenOfferModal = () => setIsOfferModalOpen(true);
        const handleCloseOfferModal = () => {
            setIsOfferModalOpen(false);
            setOfferPrice('');
            setOfferError('');
        };
        
        const handleOfferSubmit = () => {
            const priceValue = parseFloat(offerPrice);

            if (!priceValue || priceValue <= 0) {
                setOfferError('Please enter a valid offer.');
                return;
            }
            // La validazione controlla che l'offerta sia inferiore al prezzo
            if (priceValue >= numericPrice) {
                setOfferError(`Offer must be less than the current price of ${property.price}.`);
                return;
            }

            setOfferError('');
            alert(`Offer of $${priceValue.toLocaleString()} submitted successfully!`);
            handleCloseOfferModal();
        };

        const mapProperties = [property];

        return (
            <div className="property-detail-container">
                <main className="property-detail-main">
                    <Link to="/properties" className="back-to-search-link">← Back to Search</Link>
                        <PropertyGallery images={property.images} />
                    <div className="detail-grid">
                        <div className="info-primary">
                            {/* MODIFICA: Tutti i dati ora vengono dall'oggetto 'property' */}
                            <h1>{property.address}</h1>
                            <h2>{isForRent ? `${property.price} / month` : `$${numericPrice.toLocaleString()}`}</h2> 
                            <p>{property.city} · {property.municipality}</p>
                            <div className="stats">
                                <span>{property.beds} {property.beds === 1 ? 'Bed' : 'Beds'}</span>
                                <span>{property.baths} {property.baths === 1 ? 'Bath' : 'Baths'}</span>
                                <span>{property.energyClass} Energy Class</span>
                            </div>
                            {/* La logica dei tag ora è dinamica */}
                            {property.tags.includes('PET FRIENDLY') && <p className="pet-policy">✓ Pets Allowed</p>}
                        </div>

                        <div className="contact-box">
                            <button className="btn btn-primary btn-contact" onClick={handleOpenTourModal} disabled={!isAuthenticated}>Request a Tour</button>
                            <button className="btn btn-primary btn-contact" onClick={handleOpenOfferModal} disabled={!isAuthenticated}>Make an Offer</button>
                            {!isAuthenticated && (<p className="auth-message">You must be logged in to perform this action.</p>)}
                        </div>
                    </div>

                    {isAuthenticated && isTourModalOpen && (
                        <div className="modal-overlay" onClick={handleCloseTourModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <h2>Select a Date for Your Tour</h2>
                                <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} inline minDate={new Date()} />
                                <div className="modal-actions">
                                    <button className="btn btn-secondary" onClick={handleCloseTourModal}>Cancel</button>
                                    <button className="btn btn-primary" onClick={handleTourSubmit}>Submit</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isAuthenticated && isOfferModalOpen && (
                        <div className="modal-overlay" onClick={handleCloseOfferModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <h2>Make an Offer for {isForRent ? 'Monthly Rent' : 'Purchase'}</h2>
                                <p>Current {isForRent ? 'rent' : 'price'}: {isForRent ? property.price : `$${numericPrice.toLocaleString()}`}</p>
                                <div className="offer-input-group">
                                    <label htmlFor="offerPrice">Your {isForRent ? 'Monthly' : ''} Offer Price ($)</label>
                                    <input
                                        type="number"
                                        id="offerPrice"
                                        value={offerPrice}
                                        onChange={(e) => setOfferPrice(e.target.value)}
                                        placeholder={isForRent ? "e.g., 2900" : "e.g., 940000"}
                                    />
                                </div>
                                {offerError && <p className="modal-error">{offerError}</p>}
                                <div className="modal-actions">
                                    <button className="btn btn-secondary" onClick={handleCloseOfferModal}>Cancel</button>
                                    <button className="btn btn-primary" onClick={handleOfferSubmit}>Submit Offer</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isForRent && (
                        <section className="info-section">
                            <h2>Costs & Fees</h2>
                            <div className="cost-item"><span>Base rent</span> <span>{property.price} / month</span></div>
                        </section>
                    )}


                    <section className="info-section">
                        <h2>Description</h2>
                        <p>A beautiful {property.beds} bed, {property.baths} bath property located in {property.municipality}. Features include {property.services.join(', ')} and more. Contact us today to learn more!</p>
                    </section>

                   
                   
                   <section className="info-section">
                    <h2>Key Features</h2>
                    <ul>{property.services.map((service, i) => <li key={i}>{service}</li>)}</ul>
                   </section>

                   <section className="info-section">
                    <h2>Local Information</h2>
                    <div className="map-wrapper"><MapDisplay properties={mapProperties} hoveredPropertyId={property.id} /></div>
                </section>
                </main>
            </div>
        );
    };

    export default PropertyDetailPage;