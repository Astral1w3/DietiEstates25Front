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
    const [propertyType, setPropertyType] = useState('rent');
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
    const [selectedPlace, setSelectedPlace] = useState(null);
    const fileInputRef = useRef(null);

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
        setPropertyType('rent');
        setFormData({
            price: '', description: '', sqMeters: '', rooms: '', address: '', civicNumber: '', energyClass: 'A'
        });
        setServices(
            availableServices.reduce((acc, service) => ({ ...acc, [service.id]: false }), {})
        );
        setImages([]);
        setSelectedPlace(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setAddressDisplayValue(''); 
    };

    const onPlaceSelect = (place) => {
        if (!place) {
            setSelectedPlace(null);
            return;
        }
        const { street, housenumber, lat, lon, formatted, city, postcode, state } = place.properties;
        setFormData(prev => ({
            ...prev,
            address: street || '',
            civicNumber: housenumber || ''
        }));
        setAddressDisplayValue(formatted);
        setSelectedPlace({
            fullAddress: formatted, street, housenumber, city, postcode, state, latitude: lat, longitude: lon
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (!selectedPlace) {
            setMessage({ text: 'Please select a valid address from the suggestions.', type: 'error' });
            return;
        }
        
        if (!formData.price || !formData.address || !formData.description || !formData.sqMeters || !formData.rooms) {
            setMessage({ text: 'Please fill in all required fields.', type: 'error' });
            return;
        }

        setIsLoading(true);

        // Prepara il payload esattamente come prima
        const payload = {
            propertyDetails: {
                price: formData.price,
                description: formData.description,
                square_meters: formData.sqMeters,
                number_of_rooms: formData.rooms,
                energy_class: formData.energyClass,
            },
            locationDetails: selectedPlace,
            services: services,
            propertyType: propertyType
        };

        try {
            // Ora chiamiamo la nostra funzione di servizio pulita.
            // Tutta la complessità di fetch, headers, etc. è nascosta.
            const result = await createProperty(payload);

            // Se la chiamata ha successo (non ha lanciato errori), gestiamo la UI
            console.log('Property created successfully:', result);
            setMessage({ text: 'Property listed successfully!', type: 'success' });
            resetForm();

        } catch (error) {
            // Se createProperty lancia un errore, lo catturiamo qui
            // e lo mostriamo all'utente.
            setMessage({ text: error.message, type: 'error' });

        } finally {
            // Il loading si disattiva sempre, sia in caso di successo che di errore.
            setIsLoading(false);
        }
    };

    return (
        <GeoapifyContext apiKey={process.env.REACT_APP_GEOAPIFY_API_KEY}>
            <div className="card">
                <h2>Add New Property</h2>
                <hr />
                <form onSubmit={handleSubmit} noValidate>
                    {/* ... (resto del form invariato) ... */}
                    <div className="form-group">
                        <label>Listing Type</label>
                        <div className="type-selector">
                            <input type="radio" id="rent" name="propertyType" value="rent" checked={propertyType === 'rent'} onChange={() => setPropertyType('rent')} />
                            <label htmlFor="rent">For Rent</label>
                            <input type="radio" id="sale" name="propertyType" value="sale" checked={propertyType === 'sale'} onChange={() => setPropertyType('sale')} />
                            <label htmlFor="sale">For Sale</label>
                        </div>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="price">{propertyType === 'rent' ? 'Monthly Price (€)' : 'Total Price (€)'}</label>
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
                                setFormData(prev => ({
                                    ...prev,
                                    address: value,
                                    civicNumber: ''
                                }));
                                setSelectedPlace(null);
                            }}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="civicNumber">Civic Number</label>
                        <input type="text" id="civicNumber" name="civicNumber" value={formData.civicNumber} onChange={handleInputChange} />
                    </div>

                    {/* ... (resto del form invariato) ... */}
                    <div className="form-group full-width">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" name="description" rows="5" value={formData.description} onChange={handleInputChange} required></textarea>
                    </div>

                    <div className="form-group full-width">
                        <label className="group-legend">Services</label>
                        <div className="checkbox-group">
                            {availableServices.map(service => (
                                <div key={service.id} className="checkbox">
                                    <label className="checkbox-wrapper">
                                        <input 
                                            type="checkbox" 
                                            className="checkbox-input"
                                            name={service.id}
                                            checked={services[service.id]}
                                            onChange={handleServiceChange}
                                        />
                                        <span className="checkbox-tile">
                                            <span className="checkbox-icon">{service.emoji}</span>
                                            <span className="checkbox-label">{service.label}</span>
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Images (Max 7)</label>
                        <input 
                            type="file" 
                            multiple accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            style={{ display: 'none' }} />
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