import React, { useState, useRef } from 'react';
import { FaUpload, FaTrash } from 'react-icons/fa';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import './AddPropertyForm.css';

import { createProperty } from '../../services/propertyService';

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

const AddPropertyForm = () => {
    const [propertyType, setPropertyType] = useState('Rent');
    const [formData, setFormData] = useState({
        price: '', description: '', sqMeters: '', rooms: '', address: '', civicNumber: '', energyClass: 'A'
    });
    const [addressDisplayValue, setAddressDisplayValue] = useState('');
    const [services, setServices] = useState(
        availableServices.reduce((acc, service) => ({ ...acc, [service.id]: false }), {})
    );
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAmenities, setIsCheckingAmenities] = useState(false); // Stato per il caricamento dei servizi
    const [selectedPlace, setSelectedPlace] = useState(null);
    const fileInputRef = useRef(null);

    // --- NUOVA FUNZIONE PER VERIFICARE I SERVIZI NELLE VICINANZE ---
    const checkNearbyAmenities = async (lat, lon) => {
        setIsCheckingAmenities(true);
        const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;
        const radius = 500;

        const amenitiesToSearch = [
            { category: 'education', serviceId: 'close to schools' },
            { category: 'leisure.park', serviceId: 'close to parks' },
            { category: 'public_transport', serviceId: 'close to public transport' }
        ];

        const updatedServices = { ...services };
        const foundNames = [];

        try {
            await Promise.all(
                amenitiesToSearch.map(async (amenity) => {
                    const url = `https://api.geoapify.com/v2/places?categories=${amenity.category}&filter=circle:${lon},${lat},${radius}&limit=1&apiKey=${apiKey}`;
                    const response = await fetch(url);
                    const data = await response.json();

                    if (data.features && data.features.length > 0) {
                        updatedServices[amenity.serviceId] = true;
                        // Aggiungiamo il nome del luogo trovato all'array
                        const placeName = data.features[0].properties.name;
                        if (placeName) {
                            foundNames.push(placeName);
                        }
                    }
                })
            );
            setServices(updatedServices);
            return foundNames; // Restituisce l'array dei nomi
        } catch (error) {
            console.error("Errore durante la verifica dei servizi vicini:", error);
            return []; // In caso di errore, restituisce un array vuoto
        } finally {
            setIsCheckingAmenities(false);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceChange = (e) => {
        const { name, checked } = e.target;
        setServices(prev => ({ ...prev, [name]: checked }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 7) {
            setMessage({ text: 'You can upload a maximum of 7 images.', type: 'error' });
            return;
        }
        setImages(prev => [...prev, ...files]);
    };

    const handleRemoveImage = (indexToRemove) => {
        setImages(prev => prev.filter((img, index) => index !== indexToRemove));
    };

    const resetForm = () => {
        setPropertyType('Rent');
        setFormData({ price: '', description: '', sqMeters: '', rooms: '', address: '', civicNumber: '', energyClass: 'A' });
        setServices(availableServices.reduce((acc, service) => ({ ...acc, [service.id]: false }), {}));
        setImages([]);
        setSelectedPlace(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setAddressDisplayValue('');
    };

      const onPlaceSelect = async (place) => {
        if (!place) {
            setSelectedPlace(null);
            return;
        }
        const { street, housenumber, lat, lon, formatted, city, postcode, state, county } = place.properties;
        setFormData(prev => ({ ...prev, address: street || '', civicNumber: housenumber || '' }));
        setAddressDisplayValue(formatted);
        const placeDetails = { fullAddress: formatted, street, housenumber, city, postcode, state, county, latitude: lat, longitude: lon };
        setSelectedPlace(placeDetails);

        // 1. Esegui la verifica e ottieni i nomi
        const nearbyNames = await checkNearbyAmenities(placeDetails.latitude, placeDetails.longitude);

        // 2. Se abbiamo trovato dei nomi, li aggiungiamo alla descrizione
        if (nearbyNames.length > 0) {
            const amenitiesText = "\n\nNelle immediate vicinanze: " + nearbyNames.join(', ') + ".";
            
            // Usiamo una funzione di aggiornamento per accodare il testo in modo sicuro
            setFormData(prevFormData => ({
                ...prevFormData,
                description: (prevFormData.description || '') + amenitiesText
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        setIsLoading(true);

        if (!selectedPlace) {
            setMessage({ text: 'Please select a valid address from the suggestions.', type: 'error' });
            setIsLoading(false);
            return;
        }

        if (!formData.price || !formData.address || !formData.description || !formData.sqMeters || !formData.rooms) {
            setMessage({ text: 'Please fill in all required fields.', type: 'error' });
            setIsLoading(false);
            return;
        }

        const servicesPayload = Object.entries(services)
            .filter(([key, value]) => value === true)
            .map(([key]) => ({ serviceName: key }));

        const addressPayload = {
            street: selectedPlace.street,
            houseNumber: formData.civicNumber || selectedPlace.housenumber,
            latitude: selectedPlace.latitude,
            longitude: selectedPlace.longitude,
            municipality: {
                municipalityName: selectedPlace.city,
                zipCode: selectedPlace.postcode,
                province: {
                    provinceName: selectedPlace.county || '',
                    acronym: '',
                    region: { regionName: selectedPlace.state }
                }
            }
        };

        const payload = {
            price: formData.price,
            description: formData.description,
            squareMeters: formData.sqMeters,
            numberOfRooms: formData.rooms,
            energyClass: formData.energyClass,
            saleType: propertyType,
            services: servicesPayload,
            address: addressPayload
        };

        try {
            const result = await createProperty(payload, images);
            setMessage({ text: 'Proprietà inserita con successo!', type: 'success' });
            resetForm();
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GeoapifyContext apiKey={process.env.REACT_APP_GEOAPIFY_API_KEY}>
            <div className="card">
                <h2>Add New Property</h2>
                <hr />
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label>Listing Type</label>
                        <div className="type-selector">
                            <input type="radio" id="Rent" name="propertyType" value="Rent" checked={propertyType === 'Rent'} onChange={() => setPropertyType('Rent')} />
                            <label htmlFor="Rent">For Rent</label>
                            <input type="radio" id="Sale" name="propertyType" value="Sale" checked={propertyType === 'Sale'} onChange={() => setPropertyType('Sale')} />
                            <label htmlFor="Sale">For Sale</label>
                        </div>
                    </div>
                    {/* ... (resto del form grid) ... */}
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="price">{propertyType === 'Rent' ? 'Monthly Price (€)' : 'Total Price (€)'}</label>
                            <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="sqMeters">Square Meters (m²)</label>
                            <input type="number" id="sqMeters" name="sqMeters" value={formData.sqMeters} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rooms">Number of Rooms</label>
                            <input type="number" id="rooms" name="rooms" value={formData.rooms} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="energyClass">Energy Class</label>
                            <select id="energyClass" name="energyClass" value={formData.energyClass} onChange={handleInputChange}>
                                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="address">Address</label>
                        <GeoapifyGeocoderAutocomplete
                            placeholder="Start typing an address..."
                            value={addressDisplayValue}
                            type="street"
                            placeSelect={onPlaceSelect}
                            biasByCountryCode={["it"]}
                            lang='it'
                            onUserInput={(value) => {
                                setAddressDisplayValue(value);
                                setFormData(prev => ({ ...prev, address: value, civicNumber: '' }));
                                setSelectedPlace(null);
                            }}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="civicNumber">Civic Number</label>
                        <input type="text" id="civicNumber" name="civicNumber" value={formData.civicNumber} onChange={handleInputChange} />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" name="description" rows="5" value={formData.description} onChange={handleInputChange} required></textarea>
                    </div>

                    <div className="form-group full-width">
                        <div className="services-header">
                            <label className="group-legend">Services</label>
                            {/* --- INDICATORE DI CARICAMENTO PER I SERVIZI --- */}
                            {isCheckingAmenities && <span className="amenities-loader">[Verifica servizi nelle vicinanze...]</span>}
                        </div>
                        <div className="checkbox-group">
                            {availableServices.map(service => (
                                <div key={service.id} className="checkbox">
                                    <label className="checkbox-wrapper">
                                        <input type="checkbox" className="checkbox-input" name={service.id} checked={services[service.id]} onChange={handleServiceChange} />
                                        <span className="checkbox-tile">
                                            <span className="checkbox-icon">{service.emoji}</span>
                                            <span className="checkbox-label">{service.label}</span>
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* ... (resto del form, immagini, etc.) ... */}
                    <div className="form-group full-width">
                        <label>Images (Max 7)</label>
                        <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                        <button type="button" className="upload-btn" onClick={() => fileInputRef.current.click()}>  
                            <FaUpload /> Select Images
                        </button>
                        <div className="image-preview-grid">
                            {images.map((image, index) => (
                                <div key={index} className="image-preview-item">
                                    <img src={URL.createObjectURL(image)} alt={`preview ${index}`} />
                                    <button type="button" className="remove-image-btn" onClick={() => handleRemoveImage(index)}><FaTrash /></button>
                                </div>
                            ))}
                        </div>
                    </div>


                    {message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
                    
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Submitting...' : 'List Property'}
                        </button>
                    </div>
                </form>
            </div>
        </GeoapifyContext>
    );
};

export default AddPropertyForm;